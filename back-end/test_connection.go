package main

import (
	"GO-Mongo/config"
	"GO-Mongo/db"
	"context"
	"fmt"
	"log"
)

func main() {
	cfg, err := config.LoadConfig("env.yaml")
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	fmt.Printf("Connecting to MongoDB at %s:%d\n", cfg.MongoDB.Host, cfg.MongoDB.Port)
	fmt.Printf("Database: %s\n", cfg.MongoDB.Database)
	fmt.Printf("Collection: %s\n", cfg.MongoDB.Collection)

	ctx := context.Background()
	db.Connect(cfg)
	
	// Test connection by listing collections
	collections, err := db.Collection.Database().ListCollectionNames(ctx, struct{}{})
	if err != nil {
		log.Fatal("Failed to list collections:", err)
	}

	fmt.Println("Available collections:")
	for _, coll := range collections {
		fmt.Printf("- %s\n", coll)
	}

	// Count documents in kanto_pokemons collection
	collection := db.Collection.Database().Collection("kanto_pokemons")
	count, err := collection.CountDocuments(ctx, struct{}{})
	if err != nil {
		log.Printf("Warning: Could not count documents in kanto_pokemons: %v", err)
	} else {
		fmt.Printf("Documents in kanto_pokemons: %d\n", count)
	}

	fmt.Println("Connection test completed successfully!")
}