// Format angka ke Rupiah dengan titik sebagai separator
const API_BASE = `http://${window.location.hostname || '127.0.0.1'}:8000`;

// Fallback classification (mirrors backend rule — used when API is unreachable)
function classifyFallback(data) {
    const omsetThn = data.Omset * 12;
    let cluster;
    if (data.Aset <= 1_000_000_000 && omsetThn <= 2_000_000_000) {
        cluster = 0; // Usaha Mikro
    } else if (data.Aset <= 5_000_000_000 && omsetThn <= 15_000_000_000) {
        cluster = 1; // Usaha Kecil
    } else {
        cluster = 2; // Usaha Menengah
    }
    const membership = [0.0, 0.0, 0.0];
    membership[cluster] = 1.0;
    return { cluster, category: ["Usaha Mikro","Usaha Kecil","Usaha Menengah"][cluster], membership };
}

function formatRupiahInput(angka) {
    const numberString = angka.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
}

// Parse Rupiah string ke number
function parseRupiah(rupiah) {
    return parseInt(rupiah.replace(/\./g, '')) || 0;
}

// Tambahkan event listener untuk format otomatis
document.addEventListener('DOMContentLoaded', function() {
    const rupiahInputs = document.querySelectorAll('.rupiah-input');
    
    rupiahInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            this.value = formatRupiahInput(this.value);
        });

        input.addEventListener('blur', function() {
            if (this.value && !this.value.includes('.')) {
                this.value = formatRupiahInput(this.value);
            }
        });
    });
});

// Data contoh untuk testing (UU 20/2008)
const exampleData = {
    small: {
        // Usaha Mikro: aset ≤ 1M, omset ≤ 2M/thn
        Modal: 50000000,
        Omset: 8333333,       // ~100 jt/thn
        Aset: 60000000,
        Laba_Bersih: 2000000,
        Total_Karyawan: 3,
        Lama_Usaha: 3
    },
    medium: {
        // Usaha Kecil: aset ≤ 5M, omset ≤ 15M/thn
        Modal: 3000000000,
        Omset: 583333333,     // ~7 M/thn
        Aset: 3200000000,
        Laba_Bersih: 100000000,
        Total_Karyawan: 12,
        Lama_Usaha: 6
    },
    large: {
        // Usaha Menengah: aset ≤ 10M, omset ≤ 50M/thn
        Modal: 7500000000,
        Omset: 2500000000,    // ~30 M/thn
        Aset: 8000000000,
        Laba_Bersih: 500000000,
        Total_Karyawan: 55,
        Lama_Usaha: 10
    }
};

// Interpretasi cluster — UU 20/2008
// Cluster 0 = Usaha Mikro  (aset ≤ 1M, omset ≤ 2M/thn)
// Cluster 1 = Usaha Kecil  (aset ≤ 5M, omset ≤ 15M/thn)
// Cluster 2 = Usaha Menengah (aset ≤ 10M, omset ≤ 50M/thn)
const clusterInfo = {
    0: {
        name: "Usaha Mikro",
        description: "Usaha produktif milik perorangan atau badan usaha dengan skala terkecil (UU 20/2008).",
        characteristics: [
            "Aset ≤ Rp1 miliar (di luar tanah & bangunan)",
            "Omzet ≤ Rp2 miliar per tahun",
            "Jumlah karyawan 1–4 orang",
            "Biasanya usaha individu atau keluarga",
            "Contoh: warung kecil, pedagang kaki lima"
        ],
        recommendation: "Disarankan mendapatkan bantuan modal (KUR Mikro), pelatihan manajemen dasar, dan akses digitalisasi usaha."
    },
    1: {
        name: "Usaha Kecil",
        description: "Usaha ekonomi produktif yang berdiri sendiri dengan skala lebih besar dari usaha mikro (UU 20/2008).",
        characteristics: [
            "Aset > Rp1 miliar s.d. Rp5 miliar",
            "Omzet > Rp2 miliar s.d. Rp15 miliar per tahun",
            "Jumlah karyawan 5–19 orang",
            "Sudah memiliki pembukuan sederhana",
            "Contoh: restoran kecil, konveksi"
        ],
        recommendation: "Fokus pada formalisasi usaha, akses KUR Kecil, sertifikasi produk, dan pengembangan SDM."
    },
    2: {
        name: "Usaha Menengah",
        description: "Usaha ekonomi produktif yang berdiri sendiri dengan kekayaan bersih lebih besar dari usaha kecil (UU 20/2008).",
        characteristics: [
            "Aset > Rp5 miliar s.d. Rp10 miliar",
            "Omzet > Rp15 miliar s.d. Rp50 miliar per tahun",
            "Jumlah karyawan 20–99 orang",
            "Memiliki manajemen formal dan sistem operasional stabil",
            "Contoh: manufaktur skala menengah, distributor regional"
        ],
        recommendation: "Ekspansi pasar, inovasi produk, sertifikasi ISO, dan pertimbangkan go-public atau kemitraan strategis."
    }
};

function fillExample(type) {
    const data = exampleData[type];
    document.getElementById('modal').value = formatRupiahInput(data.Modal.toString());
    document.getElementById('omset').value = formatRupiahInput(data.Omset.toString());
    document.getElementById('aset').value = formatRupiahInput(data.Aset.toString());
    document.getElementById('laba').value = formatRupiahInput(data.Laba_Bersih.toString());
    document.getElementById('karyawan').value = data.Total_Karyawan;
    document.getElementById('lama').value = data.Lama_Usaha;
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

function getConfidenceLevel(membership) {
    const maxMembership = Math.max(...membership);
    const percentage = (maxMembership * 100).toFixed(1);
    
    if (percentage >= 90) return { level: "Sangat Tinggi", color: "#43e97b" };
    if (percentage >= 75) return { level: "Tinggi", color: "#4facfe" };
    if (percentage >= 60) return { level: "Sedang", color: "#ffc107"};
    return { level: "Rendah", color: "#f5576c" };
}

function displayResult(result, inputData) {
    const cluster = result.cluster;
    const membership = result.membership;
    const maxMembership = Math.max(...membership);
    const confidence = getConfidenceLevel(membership);
    const info = clusterInfo[cluster];

    let html = `
        <div style="text-align: center;">
            <h2 style="color: #333; margin-bottom: 10px;">Hasil Clustering:</h3>
            <div class="cluster-badge cluster-${cluster}">
                ${info.name}
            </div>
        </div>

        <div class="interpretation">
            <h3>📋 Interpretasi Hasil</h3>
            <p><strong>${info.description}</strong></p>
            
            <div class="confidence-bar">
                <div class="confidence-label">
                    <span><strong>Tingkat Kepercayaan:</strong></span>
                    <span><strong>${(maxMembership * 100).toFixed(1)}%</strong></span>
                </div>
                <div class="confidence-track">
                    <div class="confidence-fill" style="width: ${maxMembership * 100}%">
                        ${confidence.level}
                    </div>
                </div>
            </div>

            <div class="characteristics">
                <h4 style="color: #667eea; margin-bottom: 10px;">Karakteristik Cluster:</h4>
                <ul>
                    ${info.characteristics.map(char => `<li>${char}</li>`).join('')}
                </ul>
            </div>

            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <h4 style="color: #0066cc; margin-bottom: 10px;">💡 Rekomendasi:</h4>
                <p style="color: #333; line-height: 1.6;">${info.recommendation}</p>
            </div>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h4 style="color: #667eea; margin-bottom: 10px;">📊 Data UMKM yang Dianalisis:</h4>
            <table style="width: 100%; font-size: 0.9em;">
                <tr>
                    <td style="padding: 5px; color: #666;">Modal:</td>
                    <td style="padding: 5px; text-align: right; font-weight: 600;">${formatRupiah(inputData.Modal)}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; color: #666;">Omset/bulan:</td>
                    <td style="padding: 5px; text-align: right; font-weight: 600;">${formatRupiah(inputData.Omset)}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; color: #666;">Aset:</td>
                    <td style="padding: 5px; text-align: right; font-weight: 600;">${formatRupiah(inputData.Aset)}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; color: #666;">Laba Bersih/bulan:</td>
                    <td style="padding: 5px; text-align: right; font-weight: 600;">${formatRupiah(inputData.Laba_Bersih)}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; color: #666;">Karyawan:</td>
                    <td style="padding: 5px; text-align: right; font-weight: 600;">${inputData.Total_Karyawan} orang</td>
                </tr>
                <tr>
                    <td style="padding: 5px; color: #666;">Lama Usaha:</td>
                    <td style="padding: 5px; text-align: right; font-weight: 600;">${inputData.Lama_Usaha} tahun</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff; padding: 10px; border-radius: 8px; margin-top: 15px; font-size: 0.85em; color: #999; border: 1px solid #eee;">
            <strong>Technical Details:</strong> Cluster ${cluster} | Membership Values: 
            ${membership.map((m, i) => `C${i}: ${(m * 100).toFixed(2)}%`).join(', ')}
        </div>
    `;

    document.getElementById('resultSection').innerHTML = html;
    document.getElementById('resultSection').classList.add('show');
}

document.getElementById('umkmForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Hide error message
    document.getElementById('errorMessage').classList.remove('show');

    // Collect data - parse Rupiah values
    const data = {
        Modal: parseRupiah(document.getElementById('modal').value),
        Omset: parseRupiah(document.getElementById('omset').value),
        Aset: parseRupiah(document.getElementById('aset').value),
        Laba_Bersih: parseRupiah(document.getElementById('laba').value),
        Total_Karyawan: parseInt(document.getElementById('karyawan').value),
        Lama_Usaha: parseInt(document.getElementById('lama').value)
    };

    // Validate
    if (Object.values(data).some(v => isNaN(v) || v < 0)) {
        document.getElementById('errorMessage').textContent = '❌ Mohon isi semua field dengan nilai yang valid!';
        document.getElementById('errorMessage').classList.add('show');
        return;
    }

    // Show loading
    document.getElementById('resultSection').classList.remove('show');
    document.getElementById('loading').classList.add('show');
    document.getElementById('btnPredict').disabled = true;

    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Hide loading
        document.getElementById('loading').classList.remove('show');
        
        // Display result
        displayResult(result, data);

    } catch (error) {
        console.warn('Backend tidak tersedia, menggunakan klasifikasi lokal:', error);
        document.getElementById('loading').classList.remove('show');
        const fallback = classifyFallback(data);
        displayResult(fallback, data);
        document.getElementById('errorMessage').textContent = '⚠️ Backend tidak terhubung — hasil menggunakan klasifikasi lokal (UU 20/2008).';
        document.getElementById('errorMessage').classList.add('show');
    } finally {
        document.getElementById('btnPredict').disabled = false;
    }
});
