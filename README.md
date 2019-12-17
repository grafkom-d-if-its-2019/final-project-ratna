# Threesonance

Sebuah rhythm game 3D yang dibuat menggunakan library Three.js

## Table of Contents
- [Threesonance](#threesonance)
  - [Table of Contents](#table-of-contents)
  - [Konfigurasi](#konfigurasi)
  - [Server](#server)
    - [Requirements Server](#requirements-server)
    - [Instalasi Server](#instalasi-server)
    - [Konfigurasi Server](#konfigurasi-server)
    - [Caveats](#caveats)

## Konfigurasi
Untuk mengubah alamat server yang digunakan(default 127.0.0.1:2999), ubah isi **settings.json** pada folder **js**


## Server
Meng-generate notemap dilakukan dengan menggunakan server lokal node.js yang terpisah dari javascript gamenya itu sendiri. Tanpa adanya server ini, game tidak bisa dimainkan.

### Requirements Server

- Operating System Windows
- Node.js
- Anaconda / Python 3.7 
- PyTorch (https://pytorch.org/get-started/locally/)

### Instalasi Server

1. Clone project git ini
2. Jika menggunakan Anaconda, set Anaconda di dalam PATH lalu jalankan ```conda init``` di cmd
3. Buka folder **server** di dalam project
4. Jalankan npm install untuk menginstall npm
    ```npm install ```
5. Install requirements python dengan menjalankan
   ```pip install -r requirements.txt```
6. Install nodemon untuk menjalankan server
   ```npm install nodemon```
7. Pastikan PyTorch sudah terinstall sebelum menjalankan server
8. Untuk menjalankan server, jalankan nodemon dari dalam folder **server** di dalam project
    ```nodemon```

### Konfigurasi Server
Untuk mengubah port listen server yang digunakan, ubah nilai **PORT** di dalam **.env** pada folder **server**


### Caveats
Karena beberapa limitasi, generasi note hanya bisa dilakukan untuk satu request lagu pada satu waktu, melakukan request lebih dari satu lagu pada satu waktu akan mengakibatkan ketidaksesuaian pada notemap yang dibuat

