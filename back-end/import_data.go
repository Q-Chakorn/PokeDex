package main

import (
	"GO-Mongo/config"
	"GO-Mongo/db"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	cfg, err := config.LoadConfig("env.yaml")
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	ctx := context.Background()
	db.Connect(cfg)
	
	// Check and create database and collections
	db.CheckAndCreateDatabase(ctx, db.Collection.Database().Client(), cfg.MongoDB.Database)
	db.CheckCollection(ctx, db.Collection.Database().Client(), cfg.MongoDB.Database, "kanto_pokemons")

	// Import Pokemon data
	collection := db.Collection.Database().Collection("kanto_pokemons")
	
	// Clear existing data
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Printf("Warning: Failed to clear existing data: %v", err)
	}

	// Import from the JSON file in root directory
	jsonFilePath := "../pokemon_kanto_dataset.json"
	ImportJSONToMongo(ctx, collection, jsonFilePath)
	
	fmt.Println("Data import completed successfully!")
}

func ImportJSONToMongo(ctx context.Context, collection *mongo.Collection, jsonFilePath string) {
	if collection == nil {
		log.Fatal("Collection is nil - make sure to connect to MongoDB first")
	}

	file, err := os.Open(jsonFilePath)
	if err != nil {
		log.Fatal("Error opening JSON file:", err)
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatal("Error reading JSON file:", err)
	}

	var documents []interface{}
	err = json.Unmarshal(byteValue, &documents)
	if err != nil {
		log.Fatal("Error unmarshalling JSON data:", err)
	}

	if len(documents) == 0 {
		log.Fatal("No documents found in JSON file")
	}

	result, err := collection.InsertMany(ctx, documents)
	if err != nil {
		log.Fatal("Error inserting documents into MongoDB:", err)
	}

	fmt.Printf("Successfully imported %d documents to %s collection\n", len(result.InsertedIDs), collection.Name())
}