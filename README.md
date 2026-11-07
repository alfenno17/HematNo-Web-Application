# HematNo – Web App Keuangan PKL

Aplikasi web interaktif & PWA offline-first untuk pengelolaan keuangan anak PKL berbasis 4 kantong alokasi otomatis, pembatasan pengeluaran (spending limit), dan saldo minus transparan.

---

## Fitur Utama

1. **Pemasukan (Single Input & Auto-Split)**:
   - Satu form input pemasukan.
   - Otomatis dialokasikan ke 4 kantong:
     - 🍲 **Kebutuhan Pokok**: 50%
     - 🎮 **Hiburan**: 30%
     - 💰 **Tabungan**: 10%
     - 🛡️ **Dana Darurat**: 10%

2. **Pengeluaran & Saldo Minus**:
   - Pengeluaran wajib memilih salah satu dari 4 kantong.
   - Jika pengeluaran > sisa saldo kantong yang dipilih, saldo kantong langsung menjadi **MINUS** dengan peringatan visual merah (`SALDO MINUS`).

3. **Spending Limit**:
   - Pengaturan dan pemantauan limit **Harian**, **Mingguan**, dan **Bulanan**.
   - Indikator progres visual (Aman: Hijau, Waspada: Kuning `≥80%`, Terlampaui: Merah `≥100%`).

4. **Dashboard Lengkap**:
   - Total saldo akumulatif.
   - Kartu 4 kantong saldo dengan pembagian persentase & status minus.
   - Widget ringkasan progress spending limit langsung di beranda.
   - Riwayat transaksi terbaru dengan navigasi cepat ke riwayat penuh.

5. **100% Offline-First & PWA**:
   - Service Worker & Web App Manifest via `vite-plugin-pwa`.
   - Data tersimpan permanen di `localStorage` tanpa ketergantungan server/database eksternal.
   - Bisa diinstall di iOS ("Add to Home Screen") dan Android ("Install App").

6. **Desain Anti-AI Slop**:
   - Warna netral solid modern (`#1a1a1a`, `#f9f9f7`, `#ffffff`).
   - Ikon vektor SVG presisi dari Lucide React.
   - Tipografi rapi dan tata letak mobile-first responsif.

---

## Cara Menjalankan

### Mode Pengembangan (Dev Server)
```bash
npm run dev
```

### Build Produksi & PWA
```bash
npm run build
```

### Preview Hasil Build
```bash
npm run preview
```
