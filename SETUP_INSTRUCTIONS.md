# Pokemon API Setup Instructions

## 🚀 Quick Setup

```bash
# เริ่มต้นระบบทั้งหมดด้วยคำสั่งเดียว
./setup.sh
```

## 📋 Manual Setup

### 1. ตรวจสอบ MongoDB Connection
```bash
cd back-end
go run test_connection.go
```

### 2. Import ข้อมูล Pokemon
```bash
cd back-end
make import-data
```

### 3. เริ่ม API Server
```bash
cd back-end
make run
```
Server: `http://localhost:8080`

### 4. เริ่ม Frontend
```bash
cd modern-pokedex
npm install
npm run dev
```
Frontend: `http://localhost:5173`

## API Endpoints

### GET /api/pokemon
ดึงข้อมูล Pokemon ทั้งหมด

### GET /api/pokemon/:id
ดึงข้อมูล Pokemon ตาม ID (1-151)

### GET /api/pokemon/name/:name
ดึงข้อมูล Pokemon ตามชื่อ

### GET /api/pokemon/search
ค้นหา Pokemon ด้วยพารามิเตอร์:
- `q`: ค้นหาตามชื่อหรือหมายเลข
- `type`: กรองตามประเภท
- `legendary`: กรองตามสถานะ legendary (true/false)

### GET /api/pokemon/types
ดึงรายการประเภท Pokemon ทั้งหมด

### GET /api/pokemon/legendary
ดึงข้อมูล Pokemon legendary ทั้งหมด

### GET /api/pokemon/stats
ดึงสถิติสรุปของ Pokemon

## 🔧 Troubleshooting

### Debug ระบบ
```bash
./debug.sh          # ดูข้อมูลระบบทั้งหมด
./test_system.sh     # ทดสอบระบบ
```

### หยุดระบบ
```bash
./stop_servers.sh    # หยุด servers ทั้งหมด
```

### ปัญหาที่พบบ่อย
- **MongoDB Error**: ตรวจสอบ `back-end/env.yaml`
- **Port in use**: รัน `./stop_servers.sh`
- **No data**: รัน `cd back-end && make import-data`

## การเปลี่ยนแปลงที่ทำ

1. **Backend (Go)**:
   - เพิ่ม Gin web framework
   - สร้าง REST API endpoints
   - เพิ่ม CORS support
   - สร้างสคริปต์ import ข้อมูล

2. **Frontend (React)**:
   - สร้าง ApiService สำหรับเรียก API
   - แก้ไข PokemonService ให้ใช้ API แทนไฟล์ JSON
   - รักษา interface เดิมไว้เพื่อไม่ให้กระทบกับ components อื่น

3. **ข้อมูล**:
   - ย้ายจากการอ่านไฟล์ JSON ไปเป็นการดึงจาก MongoDB
   - รักษาโครงสร้างข้อมูลเดิมไว้