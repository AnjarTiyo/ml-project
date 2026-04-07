"""
Mock test script untuk klasifikasi UMKM Indonesia
Berdasarkan UU 20/2008 + estimasi praktis industri

Catatan: field Omset dan Laba Bersih di API adalah per-BULAN,
sehingga nilai tahunan dibagi 12.
"""

import json
import sys
import urllib.request
import urllib.error

API_URL = "http://localhost:8000/predict"

# ==============================================================
# Definisi kategori UMKM (UU 20/2008 + estimasi praktis)
# ==============================================================
# Modal        : nilai aset modal usaha (Rp)
# Omset        : per BULAN  (tahunan / 12)
# Aset         : total aset (Rp)
# Laba_Bersih  : per BULAN  (tahunan / 12)
# Total_Karyawan: orang
# Lama_Usaha   : tahun

TEST_CASES = [
    # ── Usaha Mikro ─────────────────────────────────────────
    {
        "label": "Mikro – warung kecil (batas bawah)",
        "category": "Usaha Mikro",
        "data": {
            "Modal": 5_000_000,
            "Omset": 2_000_000,       # ~24 jt/thn
            "Aset": 8_000_000,
            "Laba_Bersih": 500_000,   # ~6 jt/thn
            "Total_Karyawan": 1,
            "Lama_Usaha": 1,
        },
    },
    {
        "label": "Mikro – pedagang kaki lima (tipikal)",
        "category": "Usaha Mikro",
        "data": {
            "Modal": 50_000_000,
            "Omset": 8_333_333,       # ~100 jt/thn
            "Aset": 60_000_000,
            "Laba_Bersih": 2_000_000, # ~24 jt/thn
            "Total_Karyawan": 3,
            "Lama_Usaha": 3,
        },
    },
    {
        "label": "Mikro – batas atas",
        "category": "Usaha Mikro",
        "data": {
            "Modal": 900_000_000,
            "Omset": 166_666_667,     # ~2 M/thn
            "Aset": 950_000_000,
            "Laba_Bersih": 20_833_333, # ~250 jt/thn
            "Total_Karyawan": 4,
            "Lama_Usaha": 4,
        },
    },

    # ── Usaha Kecil ─────────────────────────────────────────
    {
        "label": "Kecil – restoran kecil (batas bawah)",
        "category": "Usaha Kecil",
        "data": {
            "Modal": 1_500_000_000,
            "Omset": 208_333_333,     # ~2.5 M/thn
            "Aset": 1_500_000_000,
            "Laba_Bersih": 33_333_333, # ~400 jt/thn
            "Total_Karyawan": 5,
            "Lama_Usaha": 3,
        },
    },
    {
        "label": "Kecil – konveksi (tipikal)",
        "category": "Usaha Kecil",
        "data": {
            "Modal": 3_000_000_000,
            "Omset": 583_333_333,     # ~7 M/thn
            "Aset": 3_200_000_000,
            "Laba_Bersih": 100_000_000, # ~1.2 M/thn
            "Total_Karyawan": 12,
            "Lama_Usaha": 6,
        },
    },
    {
        "label": "Kecil – batas atas",
        "category": "Usaha Kecil",
        "data": {
            "Modal": 4_800_000_000,
            "Omset": 1_166_666_667,   # ~14 M/thn
            "Aset": 4_900_000_000,
            "Laba_Bersih": 183_333_333, # ~2.2 M/thn
            "Total_Karyawan": 18,
            "Lama_Usaha": 9,
        },
    },

    # ── Usaha Menengah ───────────────────────────────────────
    {
        "label": "Menengah – manufaktur skala menengah (batas bawah)",
        "category": "Usaha Menengah",
        "data": {
            "Modal": 5_500_000_000,
            "Omset": 1_333_333_333,   # ~16 M/thn
            "Aset": 5_500_000_000,
            "Laba_Bersih": 250_000_000, # ~3 M/thn
            "Total_Karyawan": 22,
            "Lama_Usaha": 6,
        },
    },
    {
        "label": "Menengah – distributor regional (tipikal)",
        "category": "Usaha Menengah",
        "data": {
            "Modal": 7_500_000_000,
            "Omset": 2_500_000_000,   # ~30 M/thn
            "Aset": 8_000_000_000,
            "Laba_Bersih": 500_000_000, # ~6 M/thn
            "Total_Karyawan": 55,
            "Lama_Usaha": 10,
        },
    },
    {
        "label": "Menengah – batas atas",
        "category": "Usaha Menengah",
        "data": {
            "Modal": 9_800_000_000,
            "Omset": 4_000_000_000,   # ~48 M/thn
            "Aset": 9_900_000_000,
            "Laba_Bersih": 750_000_000, # ~9 M/thn
            "Total_Karyawan": 95,
            "Lama_Usaha": 15,
        },
    },
]

CLUSTER_LABELS = {0: "Usaha Mikro", 1: "Usaha Kecil", 2: "Usaha Menengah"}
CATEGORY_COLORS = {
    "Usaha Mikro":    "\033[92m",  # green
    "Usaha Kecil":    "\033[94m",  # blue
    "Usaha Menengah": "\033[95m",  # magenta
}
RESET = "\033[0m"
BOLD  = "\033[1m"
RED   = "\033[91m"
YELLOW = "\033[93m"


def rp(val):
    """Format to Rupiah string."""
    return f"Rp{val:>18,.0f}"


def call_api(payload: dict) -> dict:
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())


def run():
    print(f"\n{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}  Mock Test – Klasifikasi UMKM Indonesia{RESET}")
    print(f"{BOLD}  API: {API_URL}{RESET}")
    print(f"{BOLD}{'='*70}{RESET}\n")

    passed = failed = errors = 0

    for tc in TEST_CASES:
        color = CATEGORY_COLORS.get(tc["category"], "")
        print(f"{color}{BOLD}[{tc['category']}]{RESET}  {tc['label']}")
        print(f"  Input:")
        d = tc["data"]
        print(f"    Modal        : {rp(d['Modal'])}")
        print(f"    Omset/bulan  : {rp(d['Omset'])}")
        print(f"    Aset         : {rp(d['Aset'])}")
        print(f"    Laba/bulan   : {rp(d['Laba_Bersih'])}")
        print(f"    Karyawan     : {d['Total_Karyawan']} orang")
        print(f"    Lama usaha   : {d['Lama_Usaha']} tahun")

        try:
            result = call_api(d)
            cluster = result["cluster"]
            membership = result["membership"]
            max_mem = max(membership)
            label = CLUSTER_LABELS.get(cluster, f"Cluster {cluster}")

            confidence_color = (
                "\033[92m" if max_mem >= 0.90 else
                "\033[94m" if max_mem >= 0.75 else
                "\033[93m" if max_mem >= 0.60 else RED
            )

            print(f"  {BOLD}Result  : Cluster {cluster} → {label}{RESET}")
            print(
                f"  Confidence: {confidence_color}{max_mem*100:.1f}%{RESET}  "
                f"(all: {[f'{v*100:.1f}%' for v in membership]})"
            )
            passed += 1

        except urllib.error.URLError as exc:
            print(f"  {RED}CONNECTION ERROR: {exc.reason}{RESET}")
            print(f"  {YELLOW}→ Pastikan backend berjalan: cd backend && uvicorn main:app --reload{RESET}")
            errors += 1
        except Exception as exc:
            print(f"  {RED}ERROR: {exc}{RESET}")
            errors += 1

        print()

    print(f"{BOLD}{'─'*70}{RESET}")
    print(f"{BOLD}Summary: {passed} success / {failed} failed / {errors} connection errors{RESET}")
    print(f"{BOLD}{'='*70}{RESET}\n")

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    run()
