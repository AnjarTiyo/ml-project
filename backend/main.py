import json
import logging
import math

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ===============================
# KLASIFIKASI UMKM (UU 20/2008)
# ===============================
# Cluster mapping: 0 = Usaha Mikro, 1 = Usaha Kecil, 2 = Usaha Menengah

# Hard boundaries — primary criteria: aset & omset tahunan
BOUNDARIES = {
    "mikro": {"aset": 1_000_000_000,  "omset_thn": 2_000_000_000},
    "kecil": {"aset": 5_000_000_000,  "omset_thn": 15_000_000_000},
    # Menengah: aset ≤ 10 M, omset ≤ 50 M/thn (anything above kecil)
}

CLUSTER_NAMES = ["Usaha Mikro", "Usaha Kecil", "Usaha Menengah"]

# Log-scale Gaussian centers for soft membership (aset, omset_thn)
_CENTERS = [
    (math.log(500_000_000),   math.log(1_000_000_000)),   # Mikro center
    (math.log(3_000_000_000), math.log(8_500_000_000)),   # Kecil center
    (math.log(7_500_000_000), math.log(32_500_000_000)),  # Menengah center
]
_SIGMA = 0.9

# ===============================
# FASTAPI INIT
# ===============================

app = FastAPI(title="UMKM Klasifikasi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# REQUEST SCHEMA
# ===============================

class UMKMData(BaseModel):
    Modal: float
    Omset: float        # per bulan
    Aset: float
    Laba_Bersih: float  # per bulan
    Total_Karyawan: int
    Lama_Usaha: int


# ===============================
# CLASSIFICATION
# ===============================

def compute_membership(aset: float, omset_thn: float) -> list:
    """
    Soft membership using Gaussian kernels in log-scale on aset & omset.
    Returns [mikro, kecil, menengah] summing to 1.0.
    """
    log_aset  = math.log(max(aset, 1.0))
    log_omset = math.log(max(omset_thn, 1.0))

    scores = []
    for (ca, co) in _CENTERS:
        g_aset  = math.exp(-0.5 * ((log_aset  - ca) / _SIGMA) ** 2)
        g_omset = math.exp(-0.5 * ((log_omset - co) / _SIGMA) ** 2)
        scores.append((g_aset + g_omset) / 2.0)

    total = sum(scores) or 1.0
    return [round(s / total, 6) for s in scores]


def classify_umkm(data: UMKMData) -> dict:
    omset_thn = data.Omset * 12
    logger.debug("Omset/thn: %s | Aset: %s", omset_thn, data.Aset)

    # Hard classification per UU 20/2008 (aset & omset as primary criteria)
    if data.Aset <= BOUNDARIES["mikro"]["aset"] and omset_thn <= BOUNDARIES["mikro"]["omset_thn"]:
        cluster = 0  # Usaha Mikro
    elif data.Aset <= BOUNDARIES["kecil"]["aset"] and omset_thn <= BOUNDARIES["kecil"]["omset_thn"]:
        cluster = 1  # Usaha Kecil
    else:
        cluster = 2  # Usaha Menengah

    membership = compute_membership(data.Aset, omset_thn)
    logger.debug("cluster: %d (%s) | membership: %s", cluster, CLUSTER_NAMES[cluster], membership)

    return {
        "cluster": cluster,
        "category": CLUSTER_NAMES[cluster],
        "membership": membership,
    }


# ===============================
# API ENDPOINTS
# ===============================

@app.get("/")
def root():
    return {"message": "UMKM Klasifikasi API Ready (UU 20/2008)"}

@app.post("/predict")
def predict(data: UMKMData):
    logger.debug("received /predict: %s", data)
    result = classify_umkm(data)
    logger.debug("result: %s", result)
    return result
