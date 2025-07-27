package config

import (
	"os"

	"gopkg.in/yaml.v3" // นำเข้า package yaml สำหรับอ่านไฟล์ YAML
)

type MongoConnect struct {
	User       string `yaml:"user"`       // ชื่อผู้ใช้สำหรับเชื่อมต่อ
	Pass       string `yaml:"pass"`       // รหัสผ่านสำหรับเชื่อมต่อ
	Host       string `yaml:"host"`       // โฮสต์ที่ MongoDB ทำงาน
	Port       int    `yaml:"port"`       // พอร์ตที่ MongoDB ทำงาน
	Database   string `yaml:"database"`   // ชื่อฐานข้อมูลที่ต้องการเชื่อม
	Collection string `yaml:"collection"` // ชื่อ collection ที่ต้องการเชื่อมต่อ
}

type LoginWithParam struct {
	MongoDB MongoConnect `yaml:"mongodb"` // กำหนดโครงสร้างสำหรับการเชื่อมต่อ MongoDB
}

func LoadConfig(path string) (*LoginWithParam, error) {
	file, err := os.Open(path) //os ทำหน้าที่เปิดไฟล์ config ที่ระบุใน path
	if err != nil {
		return nil, err // ถ้าเปิดไฟล์ไม่สำเร็จ ให้คืนค่า error
	}
	defer file.Close()               // ปิดไฟล์เมื่อฟังก์ชันจบการทำงาน
	var config LoginWithParam        // สร้างตัวแปรสำหรับเก็บข้อมูล config
	decoder := yaml.NewDecoder(file) // สร้าง decoder สำหรับอ่านไฟล์ YAML
	err = decoder.Decode(&config)
	if err != nil {
		return nil, err // ถ้า decode ไม่สำเร็จ ให้คืนค่า error
	}
	return &config, nil // คืนค่าตัวแปร config ที่อ่านได้
}
