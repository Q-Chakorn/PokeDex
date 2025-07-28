# Pokemon API Backend - Docker Setup

## 🐳 Docker Commands

### Build Docker Image
```bash
# Build the image
docker build -t pokedex-backend .

# Or use Makefile
make docker-build
```

### Run Docker Container
```bash
# Run the container
docker run -p 8080:8080 pokedex-backend

# Or use Makefile
make docker-run

# Build and run in one command
make docker-all
```

### Using Docker Compose
```bash
# Start the API service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## 🚀 What happens when container starts:

1. **Data Import**: รัน `jsonImport/jsonImport.go` เพื่อ import ข้อมูล Pokemon เข้า MongoDB
2. **API Server**: รัน `main.go` เพื่อเริ่ม API server บน port 8080

## 📡 API Endpoints

Once running, the API will be available at `http://localhost:8080`:

- `GET /api/pokemon` - Get all Pokemon
- `GET /api/pokemon/:id` - Get Pokemon by ID
- `GET /api/pokemon/name/:name` - Get Pokemon by name
- `GET /api/pokemon/search?q=pikachu` - Search Pokemon
- `GET /api/pokemon/types` - Get available types
- `GET /api/pokemon/legendary` - Get legendary Pokemon
- `GET /api/pokemon/stats` - Get stats summary

## 🔧 Configuration

The container uses `env.yaml` for MongoDB connection settings. Make sure your external MongoDB server is running and accessible from the container.

Current MongoDB settings in `env.yaml`:
- Host: `27.254.134.143`
- Port: `32017`
- Database: `PokeDex`

## 🏥 Health Check

The container includes a health check that verifies the API is responding on `/api/pokemon`.

## 📝 Logs

To view container logs:
```bash
docker logs <container_id>

# Or with docker-compose
docker-compose logs pokemon-api
```

## 🛠 Troubleshooting

1. **Connection Issues**: Make sure your external MongoDB server is running and accessible
2. **Port Conflicts**: Change the port mapping if 8080 is already in use: `-p 3000:8080`
3. **Data Import Fails**: Check MongoDB connection settings in `env.yaml`
4. **Network Issues**: If running in Docker, make sure the container can reach your MongoDB server