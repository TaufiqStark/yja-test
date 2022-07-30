<h3 align="center">SIMPLE TODO LIST</h3>

---

# Setup
- Jalankan database anda (ex. mysql) dan buat database baru
- Copy file `.env.example` dan rename menjadi `.env`
- Edit configurasi database sesuai yang anda gunakan
- Buka terminal dan ketik perintah `npm install`
- Lalu migrate database dengan perintah `node ace migration:run`
- Pastikan migrate berhasil dan jalankan aplikasi

# Menjalankan Aplikasi (Dev)
- Buka terminal ketik perintah `npm run dev`, maka aplikasi akan berjalan dalam mode development
- Buka link Server addres yg muncul pada terminal
- Jika berhasil maka kan tampil halaman todo list

# Menjalankan Aplikasi (Production)
- Buka terminal ketik perintah `npm run build`, pastikan build success
- Ketik perintah `cd build && npm ci --production && node server.js`
- Jika berhasil silahkan cek dari link yg muncul 


---

Taufiq 