# 🚀 Quick Start Guide

## เริ่มต้นใช้งานใน 3 ขั้นตอน

### 1. Setup ระบบ
```bash
./setup.sh
```

### 2. เปิดเว็บไซต์
- Frontend: http://localhost:5173
- API: http://localhost:8080

### 3. หยุดระบบ
```bash
./stop_servers.sh
```

---

## 🛠️ Commands ที่ใช้บ่อย

### ระบบทั้งหมด
```bash
./setup.sh           # เริ่มต้นระบบ
./stop_servers.sh     # หยุดระบบ
./test_system.sh      # ทดสอบระบบ
./debug.sh           # ดูข้อมูล debug
```

### Backend
```bash
cd back-end
make run             # เริ่ม API server
make test-connection # ทดสอบ MongoDB
make import-data     # Import ข้อมูล Pokemon
make help           # ดู commands ทั้งหมด
```

### Frontend
```bash
cd modern-pokedex
npm run dev         # เริ่ม development server
npm test           # รัน tests
npm run build      # Build สำหรับ production
```

---

## 📋 Checklist การติดตั้ง

- [ ] Go installed (version 1.21+)
- [ ] Node.js installed (version 18+)
- [ ] MongoDB accessible at configured host
- [ ] Port 8080 และ 5173 ว่าง
- [ ] ไฟล์ `pokemon_kanto_dataset.json` อยู่ใน root directory

---

## 🔍 การตรวจสอบ

### ตรวจสอบ API
```bash
curl http://localhost:8080/api/pokemon/stats
```

### ตรวจสอบ Frontend
เปิด http://localhost:5173 ใน browser

### ตรวจสอบ MongoDB
```bash
cd back-end && go run test_connection.go
```

---

## ❗ ปัญหาที่พบบ่อย

### "MongoDB connection failed"
- ตรวจสอบ `back-end/env.yaml`
- ตรวจสอบ MongoDB server

### "Port already in use"
```bash
./stop_servers.sh
lsof -ti:8080 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### "No Pokemon data"
```bash
cd back-end && make import-data
```

---

## 📞 ขอความช่วยเหลือ

1. รัน `./debug.sh` เพื่อดูข้อมูลระบบ
2. ตรวจสอบ logs ใน `back-end/api.log`
3. ดู console ใน browser developer tools