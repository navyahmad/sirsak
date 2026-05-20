# Sirsak (Sistem Sirkular Ekonomi)

**Sirsak** adalah platform digital berbasis React yang dirancang untuk membangun ekosistem sirkular ekonomi dengan menghubungkan pemilik **Warkop** (Warung Kopi) dengan **Perusahaan Pengolahan/Daur Ulang Limbah** (Gudang Sirsak). 

Platform ini memfasilitasi pengumpulan sampah kemasan sachet plastik multilayer (**Multi-Layer Plastic / MLP**) yang dihasilkan oleh warkop secara kolektif, dan memberikan insentif berupa poin. Poin yang dikumpulkan warkop dapat digunakan untuk membiayai iuran jaminan sosial kesehatan (**BPJS Kesehatan**) bagi para pegawai warkop (barista, kasir, pelayan) atau ditukarkan dengan produk kreatif hasil daur ulang MLP.

---

## 🚀 Fitur Utama

Sistem ini memiliki dua peran pengguna (*roles*) dengan dashboard yang saling terintegrasi:

### 1. Admin Warkop (Mitra Penghasil Sampah)
*   **Manajemen Cabang**: Mendaftarkan dan mengelola cabang-cabang warkop beserta data koordinat wilayah untuk rute logistik.
*   **Pengajuan Penjemputan (*Pickup Request*)**: Mengajukan request penjemputan sampah MLP dengan input estimasi berat.
*   **Manajemen Pegawai**: Mengelola data karyawan dan menggunakan poin warkop untuk membayar iuran BPJS Kesehatan karyawan (pilihan cover 6 atau 12 bulan).
*   **Marketplace Produk Daur Ulang**: Menukarkan poin yang terkumpul dengan produk hasil olahan daur ulang sampah plastik (paving block, tas belanja, pot tanaman, dll.).
*   **Histori Transaksi**: Melacak riwayat keluar-masuk poin baik dari setoran sampah maupun penukaran iuran/produk.

### 2. Admin Sirsak (Pengelola Logistik & Gudang)
*   **Statistik Real-time**: Memantau akumulasi total sampah terdaur ulang, jumlah poin terdistribusi, dan status logistik.
*   **Pemetaan GIS (*Geographic Information System*)**: Visualisasi lokasi seluruh cabang warkop dan gudang pusat. Dilengkapi dengan **Formula Haversine** untuk merekomendasikan rute penjemputan terdekat dari gudang.
*   **Manajemen Armada & Driver**: Menjadwalkan penjemputan sampah, memilih tim driver (Tim A, B, atau C dengan kapasitas dan tipe armada yang berbeda).
*   **Validasi & Konversi Berat**: Mengonversi sampah fisik yang sampai di gudang menjadi poin secara otomatis menggunakan kalkulator timbangan digital sistem.
*   **Simulasi Notifikasi**: Notifikasi dinamis ketika ada warkop yang mengajukan permintaan penjemputan baru.

---

## 🛠️ Teknologi yang Digunakan

*   **Frontend**: React 19, Vite, Javascript (ES6+)
*   **Styling & Animasi**: Tailwind CSS v3 (Custom Theme Sirsak & Keyframes), Framer Motion v12
*   **State Management**: Zustand v5 (Persist middleware untuk simulasi penyimpanan lokal tanpa database eksternal)
*   **GIS & Peta**: Leaflet.js, React Leaflet, React Google Maps API
*   **Grafik**: Chart.js, React Chartjs 2
*   **Icons**: React Icons (FontAwesome & GameIcons)

---

## 📌 Aturan Bisnis & Konversi

*   **Rasio Poin**: `1 kg Sampah MLP = 100 Poin`
*   **Iuran BPJS**: `1 Bulan BPJS Kesehatan Pegawai = 10.000 Poin`
*   **Kapasitas Pengangkutan**:
    *   *Mini Truck*: 300 kg
    *   *Pickup Truck*: 500 kg
    *   *Box Truck*: 1000 - 1200 kg

---

## 💻 Cara Menjalankan Project Secara Lokal

1.  **Clone repositori ini**:
    ```bash
    git clone https://github.com/username/sirsak.git
    cd sirsak
    ```

2.  **Instalasi dependensi**:
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan (development server)**:
    ```bash
    npm run dev
    ```

4.  **Buka di browser**:
    Akses URL yang tertera di terminal (biasanya `http://localhost:5173`).

---

## 📁 Struktur Folder Proyek

```text
src/
├── components/          # Komponen UI modular (Auth, Map, warkop, sirsak, dll.)
├── data/                # Konstanta sistem & mock data awal (Haversine calculation)
├── pages/               # Halaman utama (LoginPage, WarkopDashboard, SirsakDashboard)
├── stores/              # State management Zustand (useWarkopStore, useSirsakStore)
├── App.jsx              # Router & validasi role
├── index.css            # Pengaturan Tailwind CSS & animasi kustom
└── main.jsx             # Entry point React
```
