# TODO: Implementasi Parameter Token di Booking API

## Tujuan
Memastikan token selalu disertakan dalam panggilan API untuk menghindari masalah refresh setelah login dan memungkinkan user submit peminjaman.

## Perubahan yang Dilakukan
- [x] Modifikasi `getAuthHeaders()` di `src/api/bookings.js` untuk menerima token sebagai parameter.
- [x] Update semua fungsi API di `src/api/bookings.js` untuk menerima dan menggunakan token.
- [x] Update `src/contexts/BookingContext.jsx` untuk meneruskan token ke semua panggilan API.
- [x] Update `src/utils/bookingUtils.js` untuk mendapatkan token dari localStorage dan meneruskannya ke API (untuk komponen yang menggunakan utility ini).

## Testing
- [ ] Test login admin: Akses data admin tanpa perlu refresh.
- [ ] Test submit peminjaman user: Pastikan berhasil tanpa error autentikasi.
- [ ] Test fetch riwayat peminjaman: Pastikan data dimuat dengan benar.

## Catatan
Utility `bookingUtils.js` menggunakan localStorage untuk token agar kompatibel dengan komponen yang memanggilnya langsung. Context menggunakan token dari state untuk akses langsung setelah login.

- [x] Update `DaftarRuangan.jsx` untuk menggunakan gambar dari assets (`public/assets/sc/`) berdasarkan nama ruangan.
- [ ] Copy gambar dari `src/assets/sc/` ke `public/assets/sc/` agar dapat diakses sebagai `/assets/sc/...`.
