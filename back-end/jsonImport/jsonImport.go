package main

import (
	"GO-Mongo/config"
	"GO-Mongo/db"
	"context"       // นำเข้า context สำหรับจัดการ timeout/cancel ของ process
	"encoding/json" // นำเข้า json สำหรับการจัดการข้อมูล JSON
	"fmt"           // นำเข้า fmt สำหรับแสดงผลข้อความ
	"io/ioutil"     // นำเข้า ioutil สำหรับการอ่านไฟล์
	"log"           // นำเข้า log สำหรับแสดง log ข้อผิดพลาด
	"os"            // นำเข้า os สำหรับการจัดการไฟล์และระบบปฏิบัติการ

	"go.mongodb.org/mongo-driver/mongo" // นำเข้า mongo driver สำหรับเชื่อมต่อ MongoDB
	// นำเข้า time สำหรับใช้งานเกี่ยวกับเวลา
)

// ประกาศ package ชื่อ main

func main() {
	cfg, err := config.LoadConfig("env.yaml") // โหลดการตั้งค่าจากไฟล์ env.yaml
	if err != nil {
		log.Fatal("Failed to load configuration:", err) // ถ้าโหลดการตั้งค่าไม่สำเร็จ ให้แสดง log และหยุดโปรแกรม
	}
	db.Connect(cfg) // เชื่อมต่อกับ MongoDB ด้วยการตั้งค่าที่โหลดมา
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err) // ถ้าเชื่อมต่อ MongoDB ไม่สำเร็จ ให้แสดง log และหยุดโปรแกรม
	} else {
		fmt.Println("Connected to MongoDB successfully") // แสดงข้อความเมื่อเชื่อมต่อ MongoDB สำเร็จ
	}
	ctx := context.Background() // สร้าง context สำหรับการเรียกใช้งาน
	// ImportJSONToMongo(ctx, db.Collection.Database().Collection("pokemons"), "jsonImport/kanto/pokemon_kanto_dataset.json") // นำเข้าข้อมูล JSON ไปยัง MongoDB
	ImportJSONToMongo(ctx, db.Collection, "jsonImport/kanto/pokemon_kanto_dataset.json")
}

func ImportJSONToMongo(ctx context.Context, collection *mongo.Collection, jsonFilePath string) { // ฟังก์ชันสำหรับนำเข้าข้อมูล JSON documents ไปยัง collection ที่กำหนด
	if collection == nil {
		log.Fatal("Collection is nil - make sure to connect to MongoDB first")
	} // ถ้าเกิด error ในการดึงชื่อ collection ให้แสดง log และหยุดโปรแกรม
	collectionNames, err := collection.Database().ListCollectionNames(ctx, struct{}{}) // ดึงชื่อ collection ทั้งหมดใน database ที่กำหนด
	if err != nil {
		log.Fatal("Error listing collections:", err)
	}
	found := false
	for _, name := range collectionNames {
		if name == collection.Name() { // ใช้ collection.Name() แทน hardcode "pokemons"
			found = true
			break
		}
	} // ตรวจสอบว่า collection ที่ต้องการมีอยู่ใน database หรือไม่
	if !found {
		fmt.Printf("Collection '%s' not found\n", collection.Name())
		return // ถ้า collection ไม่พบ ให้แสดงข้อความและออกจากฟังก์ชัน
	}

	file, err := os.Open(jsonFilePath) // เปิดไฟล์ JSON ที่ต้องการนำเข้า
	if err != nil {
		log.Fatal("Error opening JSON file:", err) // ถ้าเกิด error ในการเปิดไฟล์ ให้แสดง log และหยุดโปรแกรม
	}
	defer file.Close() // ปิดไฟล์เมื่อเสร็จสิ้น

	byteValue, err := ioutil.ReadAll(file) // อ่านเนื้อหาทั้งหมดจากไฟล์ JSON ที่เปิดไว้แล้ว และเก็บผลลัพธ์ในรูปแบบ []byte ไว้ในตัวแปร byteValue
	if err != nil {
		log.Fatal("Error reading JSON file:", err) // ถ้าเกิด error ในการอ่านไฟล์ ให้แสดง log และหยุดโปรแกรม
	}

	var documents []interface{}                 // ประกาศตัวแปร documents เป็น slice ของ interface{} เพื่อเก็บข้อมูล JSON ที่จะนำเข้า
	err = json.Unmarshal(byteValue, &documents) // แปลงข้อมูล JSON เป็น slice ของ interface{}
	if err != nil {
		log.Fatal("Error unmarshalling JSON data:", err) // ถ้าเกิด error ในการแปลงข้อมูล JSON ให้แสดง log และหยุดโปรแกรม
	}

	result, err := collection.InsertMany(ctx, documents) // แทรกข้อมูล JSON ลงใน collection ที่กำหนด
	if err != nil {
		log.Fatal("Error inserting documents into MongoDB:", err) // ถ้าเกิด error ในการแทรกข้อมูล ให้แสดง log และหยุดโปรแกรม
	}
	fmt.Printf("Successfully imported %d documents to pokemons collection\n", len(result.InsertedIDs)) // แสดงจำนวนเอกสารที่นำเข้าสำเร็จ
	fmt.Println("Inserted documents:", result.InsertedIDs)                                             // แสดง ID ของเอกสารที่ถูกแทรก
}
