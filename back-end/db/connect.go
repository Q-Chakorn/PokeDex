package db // ประกาศ package ชื่อ db

import (
	"GO-Mongo/config" // นำเข้า package config สำหรับการตั้งค่าการเชื่อมต่อ MongoDB
	"context"         // นำเข้า context สำหรับจัดการ timeout/cancel ของ process
	"fmt"             // นำเข้า fmt สำหรับแสดงผลข้อความ
	"log"             // นำเข้า log สำหรับแสดง log ข้อผิดพลาด
	"time"            // นำเข้า time สำหรับใช้งานเกี่ยวกับเวลา

	"go.mongodb.org/mongo-driver/mongo"         // นำเข้า mongo driver สำหรับเชื่อมต่อ MongoDB
	"go.mongodb.org/mongo-driver/mongo/options" // นำเข้า options สำหรับตั้งค่าการเชื่อมต่อ MongoDB
)

var Collection *mongo.Collection // ประกาศตัวแปร global สำหรับเก็บ collection ที่จะใช้งาน

func Connect(cfg *config.LoginWithParam) { // ฟังก์ชันสำหรับเชื่อมต่อ MongoDB โดยรับค่า config เป็นพารามิเตอร์
	uri := fmt.Sprintf("mongodb://%s:%s@%s:%d", // สร้าง URI สำหรับเชื่อมต่อ MongoDB จากค่าที่กำหนดใน config
		cfg.MongoDB.User, //%s argument สำหรับชื่อผู้ใช้
		cfg.MongoDB.Pass,
		cfg.MongoDB.Host,
		cfg.MongoDB.Port, //%d argument สำหรับพอร์ตที่ MongoDB ทำงาน
	)
	ConnectFromParamOptions := options.Client().ApplyURI(uri)                // สร้าง ConnectFromParam โดยกำหนด URI สำหรับเชื่อมต่อ MongoDB จากค่าที่กำหนดใน config
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // สร้าง context ที่มี timeout 10 วินาที เพื่อป้องกันการเชื่อมต่อนาน
	defer cancel()                                                           // เมื่อฟังก์ชันจบ ให้ยกเลิก context เพื่อคืน resource

	client, err := mongo.Connect(ctx, ConnectFromParamOptions) // เชื่อมต่อ MongoDB ด้วย ConnectFromParamOptions และ context ที่กำหนด
	if err != nil {
		log.Fatal(err) // ถ้าเกิด error ให้แสดง log และหยุดโปรแกรม
	}
	Collection = client.Database(cfg.MongoDB.Database).Collection(cfg.MongoDB.Collection) // กำหนดค่า Collection ให้ชี้ไปที่ collection ที่กำหนดใน config
	fmt.Printf("Connection to MongoDB with parameters\n")

	collections, err := client.Database(cfg.MongoDB.Database).ListCollectionNames(ctx, struct{}{}) // เรียกใช้ ListCollectionNames เพื่อดึงชื่อ collection ทั้งหมดใน database ที่กำหนด
	if err != nil {
		log.Fatal(err)
	} // ถ้าเกิด error ในการดึงชื่อ collection ให้แสดง log และหยุดโปรแกรม
	fmt.Println("Collections in PokeDex:", collections)
}

// func Connect() { // ฟังก์ชันสำหรับเชื่อมต่อ MongoDB
// 	connectOptions := options.Client().ApplyURI("mongodb://localhost:27017/?authSource=admin") // สร้าง connectOptions โดยกำหนด URI สำหรับเชื่อมต่อ MongoDB
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)                                        // สร้าง context ที่มี timeout 10 วินาที เพื่อป้องกันการเชื่อมต่อนานเกินไป
// 	defer cancel()                                                                                                  // เมื่อฟังก์ชันจบ ให้ยกเลิก context เพื่อคืน resource
// 	client, err := mongo.Connect(ctx, connectOptions)                                                               // เชื่อมต่อ MongoDB ด้วย connectOptions และ context ที่กำหนด
// 	if err != nil {
// 		log.Fatal(err)
// 	} // ถ้าเกิด error ให้แสดง log และหยุดโปรแกรม

// 	Collection = client.Database("admin").Collection("PokeDex") // กำหนดค่า Collection ให้ชี้ไปที่ collection "users" ใน database "PokeDex"
// 	fmt.Printf("Connection to MongoDB\n")

// 	collections, err := client.Database("admin").ListCollectionNames(ctx, struct{}{}) // เรียกใช้ ListCollectionNames เพื่อดึงชื่อ collection ทั้งหมดใน database "admin"
// 	if err != nil {
// 		log.Fatal(err)
// 	} // ถ้าเกิด error ในการดึงชื่อ collection ให้แสดง log และหยุดโปรแกรม
// 	fmt.Println("Collections in PokeDex:", collections)
// }
