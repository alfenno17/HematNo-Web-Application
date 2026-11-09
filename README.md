# HematNo – Web App Keuangan PKL

Aplikasi web interaktif & PWA offline-first untuk pengelolaan keuangan anak PKL berbasis 4 kantong alokasi kustom (Custom Allocation), pembatasan pengeluaran (spending limit), dan saldo minus transparan.

---

## Fitur Utama

1. **Pengaturan Alokasi Kustom (Custom Allocation)**:
   - Pengguna bebas menentukan persentase alokasi untuk ke-4 kantong:
     - 🍲 **Kebutuhan Pokok**
     - 🎮 **Hiburan**
     - 💰 **Tabungan**
     - 🛡️ **Dana Darurat**
   - Validasi ketat: Total penjumlahan persentase **wajib pas 100%**. Tersedia indikator visual dan tombol simpan dinonaktifkan jika kurang atau lebih dari 100%.
   - Dilengkapi preset cepat (Klasik 50-30-10-10, Fokus Pokok 60-20-10-10, dsb.) dan tombol stepper + / - 5%.
   - Tersimpan permanen di `localStorage` dan tidak akan hilang saat browser di-refresh.

2. **Pemasukan Tunggal (Single Input & Auto-Split)**:
   - Satu form input pemasukan.
   - Otomatis terbagi ke 4 kantong mengikuti persentase kustom aktif yang telah ditentukan oleh pengguna.
   - Preview pembagian langsung tampil secara real-time saat nominal diketik.

3. **Pengeluaran & Saldo Minus**:
   - Pengeluaran wajib memilih salah satu dari 4 kantong.
   - Jika pengeluaran > sisa saldo kantong yang dipilih, saldo kantong langsung menjadi **MINUS** dengan peringatan visual merah (`SALDO MINUS`).

4. **Spending Limit**:
   - Pengaturan dan pemantauan limit **Harian**, **Mingguan**, dan **Bulanan**.
   - Indikator progres visual (Aman: Hijau, Waspada: Kuning `≥80%`, Terlampaui: Merah `≥100%`).

5. **Dashboard Lengkap**:
   - Total saldo akumulatif.
   - Kartu 4 kantong saldo dengan pembagian persentase kustom & status minus.
   - Tombol shortcut cepat **Atur Alokasi** langsung dari beranda maupun topbar.
   - Widget ringkasan progress spending limit langsung di beranda.
   - Riwayat transaksi terbaru dengan navigasi cepat ke riwayat penuh.

6. **100% Offline-First & PWA**:
   - Service Worker & Web App Manifest via `vite-plugin-pwa`.
   - Data tersimpan permanen di `localStorage` tanpa ketergantungan server/database eksternal.
   - Bisa diinstall di iOS ("Add to Home Screen") dan Android ("Install App").

7. **Desain Anti-AI Slop**:
   - Warna netral solid modern (`#1a1a1a`, `#f9f9f7`, `#ffffff`).
   - Ikon vektor SVG presisi dari Lucide React.
   - Tipografi rapi dan tata letak mobile-first responsif.

---

## Cara Menjalankan

### Mode Pengembangan (Dev Server)
```bash
cd /Users/alfennoseptianramadhan/Downloads/HematNo
npm run dev
```

### Build Produksi & PWA
```bash
cd /Users/alfennoseptianramadhan/Downloads/HematNo
npm run build
```

### Preview Hasil Build
```bash
cd /Users/alfennoseptianramadhan/Downloads/HematNo
npm run preview
```
