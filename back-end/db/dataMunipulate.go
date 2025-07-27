package db

import (
	"GO-Mongo/config"
	"context"
	"encoding/json"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
)

func CheckAndCreateDatabase(ctx context.Context, client *mongo.Client, databaseName string) {
	databases, err := client.ListDatabaseNames(ctx, struct{}{})
	if err != nil {
		log.Fatal("Error listing databases:", err) // ถ้าเกิด error ในการดึงชื่อ database ให้แสดง log และหยุดโปรแกรม
	}
	databasesExists := false
	for _, db := range databases {
		if db == databaseName {
			databasesExists = true // ถ้า database ที่ต้องการมีอยู่แล้ว ให้เปลี่ยนค่าเป็น true
			fmt.Println("Database already exists:", databaseName)
			break
		}
	}
	if !databasesExists {
		fmt.Println("Creating database:", databaseName)                           // ใน MongoDB การสร้าง database จะเกิดขึ้นเมื่อมีการเพิ่ม collection หรือ document
		collection := client.Database(databaseName).Collection("temp_Collection") // สร้าง collection ชั่วคราวเพื่อสร้าง database
		_, err := collection.InsertOne(ctx, struct{}{})                           // แทรก document ว่างเปล่าเพื่อสร้าง database
		if err != nil {
			log.Fatal("Error creating database:", err) // ถ้าเกิด error ในการสร้าง database ให้แสดง log และหยุดโปรแกรม
		}
		_, err = collection.DeleteOne(ctx, struct{}{}) // ลบ collection ชั่วคราวหลังจากสร้าง database เสร็จ
		if err != nil {
			log.Fatal("Error deleting temporary collection:", err) // ถ้าเกิด error ในการลบ collection ชั่วคราว ให้แสดง log และหยุดโปรแกรม
		}
	}
	fmt.Printf("Database '%s' created successfully\n", databaseName) // แสดงชื่อ database ทั้งหมดที่มีอยู่
}
func CheckCollection(ctx context.Context, client *mongo.Client, databaseName string, collectionName string) {
	collections, err := client.Database(databaseName).ListCollectionNames(ctx, struct{}{}) // ดึงชื่อ collection ทั้งหมดใน database ที่กำหนด
	if err != nil {
		log.Fatal("Error listing collections:", err) // ถ้าเกิด error ในการดึงชื่อ collection ให้แสดง log และหยุดโปรแกรม
	}
	collectionsExists := false
	for _, coll := range collections {
		if coll == collectionName {
			collectionsExists = true // ถ้า collection ที่ต้องการมีอยู่แล้ว ให้เปลี่ยนค่าเป็น true
			fmt.Println("Collection already exists:", collectionName)
			break
		}
	}
	if !collectionsExists {
		fmt.Println("Creating collection:", collectionName)                    // ถ้า collection ไม่อยู่ ให้สร้าง collection ใหม่
		collection := client.Database(databaseName).Collection(collectionName) // สร้าง collection ใหม่
		_, err := collection.InsertOne(ctx, struct{}{})                        // แทรก document ว่างเปล่าเพื่อสร้าง collection
		if err != nil {
			log.Fatal("Error creating collection:", err) // ถ้าเกิด error ในการสร้าง collection ให้แสดง log และหยุดโปรแกรม
		}
		_, err = collection.DeleteOne(ctx, struct{}{}) // ลบ document ว่างเปล่าหลังจากสร้าง collection เสร็จ
		if err != nil {
			log.Fatal("Error deleting temporary document:", err) // ถ้าเกิด error ในการลบ document ว่างเปล่า ให้แสดง log และหยุดโปรแกรม
		}
	}
}

// ฟังก์ชันสำหรับแสดงข้อมูลใน collection ที่กำหนดใน config
func ShowDocument(ctx context.Context, cfg *config.LoginWithParam) {
	// ดึงข้อมูลทั้งหมดจาก collection ที่กำหนด
	showdocument, err := Collection.Find(ctx, struct{}{})
	if err != nil {
		log.Fatal(err)
	}
	defer showdocument.Close(ctx) // ปิด cursor เมื่อจบการใช้งาน

	fmt.Printf("Documents in collection %s:\n", cfg.MongoDB.Collection)
	for showdocument.Next(ctx) {
		var result map[string]interface{}
		if err := showdocument.Decode(&result); err != nil {
			log.Fatal(err)
		}
		fmt.Println(result) // แสดงข้อมูลที่ดึงมา
		var resultJSON map[string]interface{}
		if err := showdocument.Decode(&resultJSON); err != nil {
			log.Fatal(err)
		}
		jsonData, err := json.MarshalIndent(resultJSON, "", "  ") // แปลงข้อมูลเป็น JSON format
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(string(jsonData)) // แสดงข้อมูลในรูปแบบ JSON
	}
}
