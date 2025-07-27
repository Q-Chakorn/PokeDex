# Pokemon API System 🚀

ระบบ Pokemon API ที่ใช้ Go backend กับ MongoDB และ React frontend

## 📋 ภาพรวมของระบบ

### Backend (Go)
- **Framework**: Gin Web Framework
- **Database**: MongoDB
- **Features**: REST API endpoints, CORS support, Data import

### Frontend (React)
- **Framework**: React + TypeScript + Vite
- **Features**: Pokemon search, filtering, responsive design
- **API Integration**: ดึงข้อมูลจาก Go API แทนไฟล์ JSON

## 🛠️ การติดตั้งและใช้งาน

### วิธีที่ 1: ใช้ Setup Script (แนะนำ)

```bash
# รันสคริปต์ setup อัตโนมัติ
./setup.sh
```

สคริปต์จะทำการ:
1. ตรวจสอบการเชื่อมต่อ MongoDB
2. Import ข้อมูล Pokemon
3. เริ่มต้น Go API server
4. เริ่มต้น React frontend

### วิธีที่ 2: Setup แบบ Manual

#### 1. เตรียม MongoDB
ตรวจสอบการตั้งค่าใน `back-end/env.yaml`:
```yaml
mongodb:
  user: admin
  pass: secret123
  host: 27.254.134.143
  port: 32017
  database: PokeDx
  collection: kanto_pokemons
```

#### 2. ทดสอบการเชื่อมต่อ MongoDB
```bash
cd back-end
go run test_connection.go
```

#### 3. Import ข้อมูล Pokemon
```bash
cd back-end
go run import_data.go
```

#### 4. เริ่มต้น Go API Server
```bash
cd back-end
go run main.go
```
Server จะทำงานที่: `http://localhost:8080`

#### 5. เริ่มต้น React Frontend
```bash
cd modern-pokedex
npm install
npm run dev
```
Frontend จะทำงานที่: `http://localhost:5173`

## 🔌 API Endpoints

### Pokemon Data
- `GET /api/pokemon` - ดึงข้อมูล Pokemon ทั้งหมด
- `GET /api/pokemon/:id` - ดึงข้อมูล Pokemon ตาม ID (1-151)
- `GET /api/pokemon/name/:name` - ดึงข้อมูล Pokemon ตามชื่อ

### Search & Filter
- `GET /api/pokemon/search` - ค้นหา Pokemon
  - `?q=pikachu` - ค้นหาตามชื่อ
  - `?type=Electric` - กรองตามประเภท
  - `?legendary=true` - กรองตาม legendary status

### Metadata
- `GET /api/pokemon/types` - ดึงรายการประเภท Pokemon ทั้งหมด
- `GET /api/pokemon/legendary` - ดึงข้อมูล Pokemon legendary
- `GET /api/pokemon/stats` - ดึงสถิติสรุป

## 📁 โครงสร้างโปรเจค

```
PokeDx/
├── back-end/                 # Go API Server
│   ├── main.go              # Main server file
│   ├── import_data.go       # Data import script
│   ├── test_connection.go   # Connection test
│   ├── env.yaml            # MongoDB config
│   ├── config/             # Configuration
│   └── db/                 # Database utilities
├── modern-pokedex/          # React Frontend
│   ├── src/
│   │   ├── services/
│   │   │   ├── ApiService.ts      # API client
│   │   │   └── PokemonService.ts  # Business logic
│   │   └── components/      # React components
│   └── package.json
├── pokemon_kanto_dataset.json    # Source data
├── setup.sh                     # Auto setup script
├── stop_servers.sh              # Stop all servers
└── README.md
```

## 🔧 การแก้ไขปัญหา

### Quick Debug
```bash
# ดูข้อมูลระบบและสถานะทั้งหมด
./debug.sh

# ทดสอบระบบ
./test_system.sh
```

### API Server ไม่ทำงาน
```bash
# ตรวจสอบ log
tail -f back-end/api.log

# ตรวจสอบ port
lsof -i :8080

# Restart server
cd back-end
make run
# หรือ
go run main.go
```

### Frontend ไม่แสดงข้อมูล
1. ตรวจสอบ API server ทำงานอยู่หรือไม่
2. เปิด Developer Tools → Console เพื่อดู error
3. ตรวจสอบ Network tab สำหรับ API calls
4. รัน: `cd modern-pokedex && npm run dev`

### MongoDB Connection Error
1. ตรวจสอบการตั้งค่าใน `back-end/env.yaml`
2. ทดสอบการเชื่อมต่อ: `cd back-end && make test-connection`
3. ตรวจสอบ MongoDB server status
4. Import ข้อมูลใหม่: `cd back-end && make import-data`

### ไม่มีข้อมูล Pokemon
```bash
# Import ข้อมูลใหม่
cd back-end
make import-data
```

## 🧪 การทดสอบ

### System Testing (แนะนำ)
```bash
# ทดสอบระบบทั้งหมด
./test_system.sh
```

### Debug Information
```bash
# ดูข้อมูล debug และสถานะระบบ
./debug.sh
```

### Backend Testing
```bash
cd back-end
go test ./...

# หรือใช้ Makefile
make test
```

### Frontend Testing
```bash
cd modern-pokedex
npm test
npm run test:coverage
```

### API Testing
```bash
# Test API endpoints
curl http://localhost:8080/api/pokemon/1
curl http://localhost:8080/api/pokemon/search?q=pikachu
curl http://localhost:8080/api/pokemon/stats
```

## 🚀 การ Deploy

### Production Build
```bash
# Build frontend
cd modern-pokedex
npm run build

# Build backend
cd back-end
make build
```

## 📝 การเปลี่ยนแปลงจากเดิม

### Backend Changes
- ✅ เพิ่ม Gin web framework
- ✅ สร้าง REST API endpoints
- ✅ เพิ่ม CORS support
- ✅ สร้าง data import utilities

### Frontend Changes
- ✅ สร้าง ApiService สำหรับ API calls
- ✅ แก้ไข PokemonService ให้ใช้ API
- ✅ รักษา interface เดิมไว้
- ✅ อัพเดท tests สำหรับ API integration

### Data Flow
```
JSON File → MongoDB → Go API → React Frontend
```

## 🛑 การหยุดระบบ

```bash
# หยุด servers ทั้งหมด
./stop_servers.sh

# หรือหยุดแบบ manual
kill $(cat back-end/api.pid)  # Stop API server
pkill -f "npm run dev"        # Stop frontend
```

## 🤝 การพัฒนาต่อ

### เพิ่ม Features ใหม่
1. เพิ่ม endpoint ใหม่ใน `back-end/main.go`
2. อัพเดท `ApiService.ts` สำหรับ API calls
3. แก้ไข `PokemonService.ts` สำหรับ business logic
4. เพิ่ม tests ใน `__tests__/` folders

### Database Schema Changes
1. แก้ไข struct ใน `main.go`
2. อัพเดท import script
3. Re-import ข้อมูล

---

🎉 **Happy Coding!** สำหรับคำถามหรือปัญหา กรุณาตรวจสอบ logs หรือสร้าง issue ใหม่