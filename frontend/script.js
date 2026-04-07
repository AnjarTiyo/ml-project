// Format angka ke Rupiah dengan titik sebagai separator
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

// Data contoh untuk testing
const exampleData = {
    small: {
        Modal: 10000000,
        Omset: 5000000,
        Aset: 15000000,
        Laba_Bersih: 1000000,
        Total_Karyawan: 3,
        Lama_Usaha: 2
    },
    medium: {
        Modal: 50000000,
        Omset: 25000000,
        Aset: 75000000,
        Laba_Bersih: 5000000,
        Total_Karyawan: 10,
        Lama_Usaha: 5
    },
    large: {
        Modal: 200000000,
        Omset: 100000000,
        Aset: 300000000,
        Laba_Bersih: 20000000,
        Total_Karyawan: 50,
        Lama_Usaha: 10
    }
};

// Interpretasi cluster
// Cluster 0 = Besar (Modal ~165M, Omset ~1.3B, Karyawan ~8)
// Cluster 1 = Kecil  (Modal ~6.8M, Omset ~51M,  Karyawan ~2)
// Cluster 2 = Menengah (Modal ~11.7M, Omset ~108M, Karyawan ~2, Lama ~23)
const clusterInfo = {
    0: {
        name: "UMKM Skala Besar",
        description: "UMKM dengan skala usaha besar yang sudah mapan dan berkembang pesat.",
        characteristics: [
            "Modal dan aset besar",
            "Omset dan laba bersih tinggi",
            "Jumlah karyawan banyak (>20 orang)",
            "Usia usaha sudah matang dan berpengalaman",
            "Memiliki sistem manajemen yang solid"
        ],
        recommendation: "Dapat berekspansi ke pasar yang lebih luas, mengembangkan inovasi produk, dan menjadi mentor bagi UMKM lainnya."
    },
    1: {
        name: "UMKM Skala Kecil",
        description: "UMKM dengan skala usaha kecil yang masih dalam tahap pengembangan.",
        characteristics: [
            "Modal dan aset relatif kecil",
            "Omset dan laba bersih masih terbatas",
            "Jumlah karyawan sedikit (1-5 orang)",
            "Usia usaha relatif baru atau menengah",
            "Potensi pertumbuhan tinggi dengan dukungan yang tepat"
        ],
        recommendation: "Disarankan untuk mendapatkan bantuan modal, pelatihan manajemen, dan akses pasar untuk pengembangan usaha."
    },
    2: {
        name: "UMKM Skala Menengah",
        description: "UMKM dengan skala usaha menengah yang sudah cukup stabil dan berkembang.",
        characteristics: [
            "Modal dan aset sudah cukup memadai",
            "Omset dan laba bersih stabil",
            "Memiliki karyawan 5-20 orang",
            "Usia usaha sudah cukup matang",
            "Memiliki sistem operasional yang baik"
        ],
        recommendation: "Fokus pada ekspansi pasar, diversifikasi produk, dan peningkatan efisiensi operasional."
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
        const response = await fetch('http://127.0.0.1:8000/predict', {
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
        console.error('Error:', error);
        document.getElementById('loading').classList.remove('show');
        document.getElementById('errorMessage').textContent = '❌ Terjadi kesalahan! Pastikan backend server berjalan di http://127.0.0.1:8000';
        document.getElementById('errorMessage').classList.add('show');
    } finally {
        document.getElementById('btnPredict').disabled = false;
    }
});
