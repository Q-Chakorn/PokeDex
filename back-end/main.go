package main

import (
	"GO-Mongo/config"
	"GO-Mongo/db"
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ctx context.Context // ประกาศตัวแปร ctx สำหรับจัดการ context
	cfg *config.LoginWithParam
)

// Pokemon struct สำหรับ MongoDB
type Pokemon struct {
	DexNumber     string `json:"dex_number" bson:"dex_number"`
	Name          string `json:"name" bson:"name"`
	Type01        string `json:"type_01" bson:"type_01"`
	Type02        string `json:"type_02" bson:"type_02"`
	Ability01     string `json:"ability_01" bson:"ability_01"`
	Ability02     string `json:"ability_02" bson:"ability_02"`
	HiddenAbility string `json:"hidden_ability" bson:"hidden_ability"`
	IsLegendary   string `json:"is_legendary" bson:"is_legendary"`
	Bio           string `json:"bio" bson:"bio"`
	HP            string `json:"hp" bson:"hp"`
	Attack        string `json:"attack" bson:"attack"`
	Defense       string `json:"defense" bson:"defense"`
	SpAttack      string `json:"sp_attack" bson:"sp_attack"`
	SpDefense     string `json:"sp_defense" bson:"sp_defense"`
	Speed         string `json:"speed" bson:"speed"`
}

func main() {
	var err error
	cfg, err = config.LoadConfig("env.yaml")
	if err != nil {
		log.Fatal(err)
	}
	
	ctx = context.Background()
	db.Connect(cfg) //เรียกใช้ฟังก์ชันเชื่อมต่อฐานข้อมูล MongoDB
	db.CheckAndCreateDatabase(ctx, db.Collection.Database().Client(), cfg.MongoDB.Database)
	db.CheckCollection(ctx, db.Collection.Database().Client(), cfg.MongoDB.Database, "kanto_pokemons") //ตรวจสอบและสร้าง collection ถ้ายังไม่มี
	db.CheckCollection(ctx, db.Collection.Database().Client(), cfg.MongoDB.Database, "johto_pokemons") //ตรวจสอบและสร้าง collection ถ้ายังไม่มี

	// Setup Gin router
	r := gin.Default()
	
	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// API routes
	api := r.Group("/api")
	{
		api.GET("/pokemon", getAllPokemon)
		api.GET("/pokemon/:id", getPokemonByID)
		api.GET("/pokemon/name/:name", getPokemonByName)
		api.GET("/pokemon/search", searchPokemon)
		api.GET("/pokemon/types", getAvailableTypes)
		api.GET("/pokemon/legendary", getLegendaryPokemon)
		api.GET("/pokemon/stats", getStatsSummary)
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")
}

// API Handlers

func getAllPokemon(c *gin.Context) {
	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Pokemon"})
		return
	}
	defer cursor.Close(ctx)

	var pokemons []Pokemon
	if err = cursor.All(ctx, &pokemons); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Pokemon data"})
		return
	}

	c.JSON(http.StatusOK, pokemons)
}

func getPokemonByID(c *gin.Context) {
	idStr := c.Param("id")
	_, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Pokemon ID"})
		return
	}

	// Convert ID to dex_number format (#001, #002, etc.)
	dexNumber := "#" + strings.Repeat("0", 3-len(idStr)) + idStr

	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	var pokemon Pokemon
	err = collection.FindOne(ctx, bson.M{"dex_number": dexNumber}).Decode(&pokemon)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Pokemon not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Pokemon"})
		return
	}

	c.JSON(http.StatusOK, pokemon)
}

func getPokemonByName(c *gin.Context) {
	name := c.Param("name")
	
	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	var pokemon Pokemon
	err := collection.FindOne(ctx, bson.M{"name": bson.M{"$regex": "^" + name + "$", "$options": "i"}}).Decode(&pokemon)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Pokemon not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Pokemon"})
		return
	}

	c.JSON(http.StatusOK, pokemon)
}

func searchPokemon(c *gin.Context) {
	query := c.Query("q")
	pokemonType := c.Query("type")
	legendary := c.Query("legendary")

	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	filter := bson.M{}

	// Search by name or dex number
	if query != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"dex_number": bson.M{"$regex": query, "$options": "i"}},
		}
	}

	// Filter by type
	if pokemonType != "" {
		filter["$or"] = []bson.M{
			{"type_01": bson.M{"$regex": "^" + pokemonType + "$", "$options": "i"}},
			{"type_02": bson.M{"$regex": "^" + pokemonType + "$", "$options": "i"}},
		}
	}

	// Filter by legendary status
	if legendary != "" {
		if legendary == "true" {
			filter["is_legendary"] = "True"
		} else if legendary == "false" {
			filter["is_legendary"] = "False"
		}
	}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search Pokemon"})
		return
	}
	defer cursor.Close(ctx)

	var pokemons []Pokemon
	if err = cursor.All(ctx, &pokemons); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Pokemon data"})
		return
	}

	c.JSON(http.StatusOK, pokemons)
}

func getAvailableTypes(c *gin.Context) {
	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	// Get distinct types from both type_01 and type_02 fields
	types1, err := collection.Distinct(ctx, "type_01", bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch types"})
		return
	}

	types2, err := collection.Distinct(ctx, "type_02", bson.M{"type_02": bson.M{"$ne": ""}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch types"})
		return
	}

	// Combine and deduplicate types
	typeSet := make(map[string]bool)
	var allTypes []string

	for _, t := range types1 {
		if typeStr, ok := t.(string); ok && typeStr != "" {
			if !typeSet[typeStr] {
				typeSet[typeStr] = true
				allTypes = append(allTypes, typeStr)
			}
		}
	}

	for _, t := range types2 {
		if typeStr, ok := t.(string); ok && typeStr != "" {
			if !typeSet[typeStr] {
				typeSet[typeStr] = true
				allTypes = append(allTypes, typeStr)
			}
		}
	}

	c.JSON(http.StatusOK, allTypes)
}

func getLegendaryPokemon(c *gin.Context) {
	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	cursor, err := collection.Find(ctx, bson.M{"is_legendary": "True"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch legendary Pokemon"})
		return
	}
	defer cursor.Close(ctx)

	var pokemons []Pokemon
	if err = cursor.All(ctx, &pokemons); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Pokemon data"})
		return
	}

	c.JSON(http.StatusOK, pokemons)
}

func getStatsSummary(c *gin.Context) {
	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	// Count total Pokemon
	totalCount, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count Pokemon"})
		return
	}

	// Count legendary Pokemon
	legendaryCount, err := collection.CountDocuments(ctx, bson.M{"is_legendary": "True"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count legendary Pokemon"})
		return
	}

	// Get type distribution
	pipeline := []bson.M{
		{
			"$group": bson.M{
				"_id":   "$type_01",
				"count": bson.M{"$sum": 1},
			},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get type distribution"})
		return
	}
	defer cursor.Close(ctx)

	typeDistribution := make(map[string]int)
	for cursor.Next(ctx) {
		var result struct {
			ID    string `bson:"_id"`
			Count int    `bson:"count"`
		}
		if err := cursor.Decode(&result); err != nil {
			continue
		}
		typeDistribution[result.ID] = result.Count
	}

	summary := gin.H{
		"totalPokemon":     totalCount,
		"legendaryCount":   legendaryCount,
		"typeDistribution": typeDistribution,
	}

	c.JSON(http.StatusOK, summary)
}