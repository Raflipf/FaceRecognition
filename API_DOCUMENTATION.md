# Dokumentasi API Mediface

API ini menyediakan layanan backend untuk aplikasi Mediface dengan fitur autentikasi dan manajemen data User, Patient, Doctor, dan Queue.

---

## Base URL

```
https://backend-mediface.vercel.app/api
```

---

## Autentikasi

### Register User

- **Endpoint:** `POST /auth/register`
- **Deskripsi:** Membuat user baru
- **Body JSON:**
  ```json
  {
    "username": "string",
    "password": "string",
    "name": "string",
    "role": "string" // contoh: "admin", "receptionist"
  }
  ```
- **Response:**
  - 201 Created: User berhasil dibuat

---

### Login User

- **Endpoint:** `POST /auth/login`
- **Deskripsi:** Login user dan mendapatkan token JWT
- **Body JSON:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string"
  }
  ```

---

## User

> Semua endpoint User memerlukan header Authorization dengan token JWT dan hanya dapat diakses oleh user dengan role `admin`.

### Get All Users

- **Endpoint:** `GET /users`
- **Deskripsi:** Mendapatkan daftar semua user
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:**
  ```json
  [
    {
      "id": "string",
      "username": "string",
      "name": "string",
      "role": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    },
    ...
  ]
  ```

---

## Patient

> Semua endpoint Patient memerlukan header Authorization dengan token JWT.

### Get All Patients

- **Endpoint:** `GET /patients`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Daftar pasien

### Add New Patient

- **Endpoint:** `POST /patients`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Body JSON:**
  ```json
  {
    "name": "string",
    "nik": "string",
    "birthDate": "YYYY-MM-DD",
    "gender": "string",
    "bloodType": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "emergencyContact": "string",
    "photos": ["string"],
    "embeddings": ["string"],
    "registrationDate": "ISO8601 datetime",
    "status": "string"
  }
  ```
- **Response:** Data pasien yang baru dibuat

### Get Patient by ID

- **Endpoint:** `GET /patients/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Data pasien sesuai ID

### Update Patient

- **Endpoint:** `PUT /patients/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Body JSON:** Data pasien yang ingin diupdate
- **Response:** Data pasien yang sudah diupdate

### Delete Patient

- **Endpoint:** `DELETE /patients/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Pesan sukses hapus

---

## Doctor

> Semua endpoint Doctor memerlukan header Authorization dengan token JWT.

### Get All Doctors

- **Endpoint:** `GET /doctors`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Daftar dokter

### Add New Doctor

- **Endpoint:** `POST /doctors`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Body JSON:** Sesuai skema dokter
- **Response:** Data dokter baru

### Get Doctor by ID

- **Endpoint:** `GET /doctors/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Data dokter sesuai ID

### Update Doctor

- **Endpoint:** `PUT /doctors/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Body JSON:** Data dokter yang ingin diupdate
- **Response:** Data dokter yang sudah diupdate

### Delete Doctor

- **Endpoint:** `DELETE /doctors/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Pesan sukses hapus

---

## Queue

> Semua endpoint Queue memerlukan header Authorization dengan token JWT.

### Get All Queues

- **Endpoint:** `GET /queues`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Daftar antrian

### Add New Queue

- **Endpoint:** `POST /queues`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Body JSON:** Sesuai skema antrian
- **Response:** Data antrian baru

### Get Queue by ID

- **Endpoint:** `GET /queues/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Data antrian sesuai ID

### Update Queue

- **Endpoint:** `PUT /queues/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Body JSON:** Data antrian yang ingin diupdate
- **Response:** Data antrian yang sudah diupdate

### Delete Queue

- **Endpoint:** `DELETE /queues/:id`
- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:** Pesan sukses hapus

---

## Catatan

- Semua tanggal dan waktu menggunakan format ISO 8601.
- Semua endpoint kecuali register dan login memerlukan header Authorization dengan token JWT.
- Pastikan token JWT valid dan belum expired saat mengakses endpoint.

---

Dokumentasi ini dapat digunakan sebagai panduan untuk mengakses API Mediface secara lengkap dan mudah.
