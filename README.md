# UMKM Semarang ML - Aplikasi Clustering UMKM

Aplikasi Machine Learning untuk melakukan clustering (pengelompokan) data UMKM (Usaha Mikro, Kecil, dan Menengah) di Semarang menggunakan algoritma Fuzzy C-Means.

## 📋 Deskripsi Proyek

Aplikasi ini terdiri dari:
- **Backend**: API FastAPI yang menjalankan model prediksi clustering
- **Frontend**: Antarmuka web sederhana untuk input data dan melihat hasil prediksi
- **Model**: Model Machine Learning yang sudah dilatih (Fuzzy C-Means)

## 🔧 Teknologi yang Digunakan

- Python 3.10+
- FastAPI (Web Framework)
- Uvicorn (ASGI Server)
- Scikit-fuzzy (Fuzzy C-Means Clustering)
- NumPy, Scikit-learn (Machine Learning)
- HTML/JavaScript (Frontend)

## 📦 Struktur Folder

```
umkm-semarang-ml/
├── backend/
│   └── main.py          # API Backend FastAPI
├── frontend/
│   └── index.html       # Antarmuka Web
├── model/
│   ├── centers.npy      # Model cluster centers
│   ├── config.json      # Konfigurasi model
│   ├── pca.pkl          # Model PCA
│   └── scaler.pkl       # Model scaler
├── venv/                # Virtual Environment (dibuat saat install)
├── Makefile             # Automation script untuk kemudahan
├── requirements.txt     # Dependencies Python
├── .gitignore           # Git ignore file
└── README.md            # File ini
```

## 🚀 Cara Instalasi dan Menjalankan Aplikasi

### Prerequisites (Prasyarat)

Pastikan Anda sudah menginstal:
- Python 3.10 atau lebih tinggi ([Download Python](https://www.python.org/downloads/))
- Make (untuk menggunakan Makefile - opsional tapi direkomendasikan)
  - **Windows**: Install [Make for Windows](https://gnuwin32.sourceforge.net/packages/make.htm) atau gunakan WSL
  - **Linux**: Biasanya sudah terinstal, jika belum: `sudo apt install build-essential`
  - **macOS**: Sudah terinstal secara default dengan Xcode Command Line Tools
- Git (opsional, untuk clone repository)

---

## ⚡ Quick Start dengan Makefile (Direkomendasikan)

Cara tercepat dan termudah untuk menjalankan aplikasi:

### 1. Install Dependencies

```bash
make install
```

Perintah ini akan:
- Membuat virtual environment secara otomatis
- Menginstall semua dependencies yang diperlukan
- Setup environment yang siap digunakan

### 2. Jalankan Backend Server

```bash
make run
```

Server akan berjalan di **http://127.0.0.1:8000**

### 3. Buka Frontend (Terminal Baru)

```bash
make frontend
```

### Perintah Makefile Lainnya

```bash
make help           # Lihat semua perintah yang tersedia
make stop-server    # Hentikan server yang berjalan
make clean          # Hapus virtual environment
make reinstall      # Install ulang dari awal
make check-deps     # Cek apakah dependencies terinstall
make test-api       # Test API endpoint
make update         # Update dependencies
```

**Catatan untuk Windows**: Pastikan Anda sudah menginstall Make for Windows atau gunakan WSL (Windows Subsystem for Linux).

---

## 📝 Langkah-langkah Instalasi Manual

Jika Anda tidak menggunakan Makefile atau ingin melakukan instalasi manual, ikuti langkah berikut:

### Untuk Windows

#### 1. Buka Command Prompt atau PowerShell

Tekan `Win + R`, ketik `cmd` atau `powershell`, lalu Enter.

#### 2. Navigasi ke Folder Proyek

```cmd
cd C:\path\to\umkm-semarang-ml
```
*Ganti `C:\path\to\umkm-semarang-ml` dengan lokasi folder Anda*

#### 3. Buat Virtual Environment

```cmd
python -m venv venv
```

#### 4. Aktifkan Virtual Environment

```cmd
venv\Scripts\activate
```

Jika berhasil, Anda akan melihat `(venv)` di awal baris command prompt.

#### 5. Install Dependencies

```cmd
pip install -r requirements.txt
```

#### 6. Jalankan Backend Server

```cmd
cd backend
python -m uvicorn main:app --reload
```

atau

```cmd
cd backend
..\venv\Scripts\uvicorn main:app --reload
```

Server akan berjalan di: **http://127.0.0.1:8000**

#### 7. Buka Frontend

Buka file `frontend/index.html` di browser Anda dengan cara:
- Klik kanan pada file `index.html` → Open with → Browser pilihan Anda (Chrome, Firefox, Edge, dll.)
- Atau drag & drop file tersebut ke jendela browser

---

### Untuk Linux

#### 1. Buka Terminal

Tekan `Ctrl + Alt + T` atau cari "Terminal" di aplikasi.

#### 2. Navigasi ke Folder Proyek

```bash
cd /path/to/umkm-semarang-ml
```
*Ganti `/path/to/umkm-semarang-ml` dengan lokasi folder Anda*

#### 3. Buat Virtual Environment

```bash
python3 -m venv venv
```

#### 4. Aktifkan Virtual Environment

```bash
source venv/bin/activate
```

Jika berhasil, Anda akan melihat `(venv)` di awal baris terminal.

#### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 6. Jalankan Backend Server

```bash
cd backend
uvicorn main:app --reload
```

atau

```bash
cd backend
../venv/bin/uvicorn main:app --reload
```

Server akan berjalan di: **http://127.0.0.1:8000**

#### 7. Buka Frontend

Buka file `frontend/index.html` di browser:
```bash
# Menggunakan browser default
xdg-open frontend/index.html

# Atau dengan browser spesifik
firefox frontend/index.html
google-chrome frontend/index.html
```

---

### Untuk macOS

#### 1. Buka Terminal

Tekan `Cmd + Space`, ketik "Terminal", lalu Enter.

#### 2. Navigasi ke Folder Proyek

```bash
cd /path/to/umkm-semarang-ml
```
*Ganti `/path/to/umkm-semarang-ml` dengan lokasi folder Anda*

#### 3. Buat Virtual Environment

```bash
python3 -m venv venv
```

#### 4. Aktifkan Virtual Environment

```bash
source venv/bin/activate
```

Jika berhasil, Anda akan melihat `(venv)` di awal baris terminal.

#### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 6. Jalankan Backend Server

```bash
cd backend
uvicorn main:app --reload
```

atau

```bash
cd backend
../venv/bin/uvicorn main:app --reload
```

Server akan berjalan di: **http://127.0.0.1:8000**

#### 7. Buka Frontend

Buka file `frontend/index.html` di browser:
```bash
# Menggunakan browser default
open frontend/index.html

# Atau dengan browser spesifik
open -a "Google Chrome" frontend/index.html
open -a "Safari" frontend/index.html
```

---

## 🎯 Cara Menggunakan Aplikasi

### 1. Pastikan Backend Berjalan

Setelah menjalankan perintah di langkah 6, Anda akan melihat output seperti ini:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 2. Buka API Documentation (Opsional)

Anda bisa mengakses dokumentasi API otomatis di:
- Swagger UI: **http://127.0.0.1:8000/docs**
- ReDoc: **http://127.0.0.1:8000/redoc**

### 3. Gunakan Frontend untuk Prediksi

1. Buka `frontend/index.html` di browser
2. Isi semua field dengan data UMKM:
   - **Modal**: Modal usaha (dalam rupiah)
   - **Omset**: Omset per bulan (dalam rupiah)
   - **Aset**: Total aset (dalam rupiah)
   - **Laba Bersih**: Laba bersih per bulan (dalam rupiah)
   - **Total Karyawan**: Jumlah karyawan
   - **Lama Usaha**: Lama usaha beroperasi (dalam tahun)

3. Klik tombol **"Predict"**
4. Hasil akan menampilkan:
   - **Cluster**: Nomor cluster (0, 1, atau 2)
   - **Membership**: Nilai keanggotaan untuk setiap cluster

### 4. Contoh Data untuk Testing

```
Modal: 50000000
Omset: 25000000
Aset: 75000000
Laba Bersih: 5000000
Total Karyawan: 10
Lama Usaha: 5
```

---

## � Workflow Umum

### Workflow 1: Pertama Kali Setup

```bash
# 1. Clone atau download project
cd umkm-semarang-ml

# 2. Install dependencies
make install

# 3. Jalankan backend
make run

# 4. Di terminal lain, buka frontend
make frontend
```

### Workflow 2: Development Harian

```bash
# Setiap kali ingin bekerja dengan project:
cd umkm-semarang-ml
make run
```

### Workflow 3: Jika Ada Masalah

```bash
# Bersihkan dan install ulang
make clean
make install
make run
```

### Workflow 4: Update Dependencies

```bash
# Update semua dependencies ke versi terbaru
make update
```

---

## �🛑 Cara Menghentikan Aplikasi

### Dengan Makefile (Termudah)

```bash
make stop-server
```

### Manual

### Windows
Tekan `Ctrl + C` di Command Prompt/PowerShell tempat server berjalan.

### Linux / macOS
Tekan `Ctrl + C` di Terminal tempat server berjalan.

### Menonaktifkan Virtual Environment

Setelah selesai, ketik:
```bash
deactivate
```

**Catatan**: Jika menggunakan Makefile, Anda tidak perlu manual aktivasi/deaktivasi virtual environment.

---

## ❗ Troubleshooting

### 0. Gunakan Makefile untuk Kemudahan

Banyak masalah dapat dihindari dengan menggunakan Makefile:
```bash
make clean      # Bersihkan environment
make install    # Install ulang
make run        # Jalankan server
```

### 1. Port 8000 Sudah Digunakan

**Error**: `Address already in use`

**Solusi Cepat dengan Makefile**:
```bash
make stop-server
make run
```

**Solusi Manual**:

**Windows:**
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
lsof -ti:8000 | xargs kill -9
```

### 2. Module Not Found Error

**Error**: `ModuleNotFoundError: No module named 'xxx'`

**Solusi dengan Makefile**: 
```bash
make reinstall
```

**Solusi Manual**:
Pastikan virtual environment aktif dan install ulang dependencies:
```bash
pip install -r requirements.txt
```

### 3. Python Tidak Ditemukan

**Error**: `'python' is not recognized...` atau `command not found: python`

**Solusi**:
- Windows: Gunakan `python` atau `py`
- Linux/macOS: Gunakan `python3`
- Atau pastikan Python sudah terinstal dan ada di PATH

### 4. CORS Error di Browser

**Error**: Masalah Cross-Origin Request

**Solusi**: 
Pastikan backend sudah berjalan di `http://127.0.0.1:8000` sebelum membuka frontend.

Gunakan:
```bash
# Terminal 1
make run

# Terminal 2 (setelah backend berjalan)
make frontend
```

### 5. Version Warning Scikit-learn

**Warning**: `InconsistentVersionWarning`

**Info**: 
Ini adalah warning, bukan error. Aplikasi tetap akan berjalan normal. Warning ini muncul karena model dilatih dengan versi scikit-learn yang berbeda.

### 6. Make Command Not Found (Windows)

**Error**: `'make' is not recognized as an internal or external command`

**Solusi**:
- Install [Make for Windows](https://gnuwin32.sourceforge.net/packages/make.htm)
- Atau gunakan WSL (Windows Subsystem for Linux)
- Atau ikuti instruksi instalasi manual di atas

---

## 📚 Informasi API

### Endpoint: GET `/`
Cek status API

**Response:**
```json
{
  "message": "UMKM Clustering API Ready"
}
```

### Endpoint: POST `/predict`
Prediksi cluster UMKM

**Request Body:**
```json
{
  "Modal": 50000000,
  "Omset": 25000000,
  "Aset": 75000000,
  "Laba_Bersih": 5000000,
  "Total_Karyawan": 10,
  "Lama_Usaha": 5
}
```

**Response:**
```json
{
  "cluster": 1,
  "membership": [0.123, 0.756, 0.121]
}
```

---

## 🔒 Catatan Keamanan

- Aplikasi ini untuk development/testing saja
- Jangan expose ke internet tanpa security tambahan
- Untuk production, gunakan HTTPS dan authentication

---

## 👨‍💻 Developer

Jika ada pertanyaan atau masalah, silakan hubungi developer atau buat issue di repository.

---

## 📄 Lisensi

[Sesuaikan dengan lisensi proyek Anda]

---

**Selamat menggunakan aplikasi UMKM Clustering! 🎉**
