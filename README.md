# 📚 School Management System

A full-stack School Management System built with **Spring Boot**, **React**, and **MySQL**. The system is designed to automate and simplify school administration by managing students, teachers, academic records, examinations, fees, attendance, and more.



## 🏗️ Project Structure


SchoolManagementSystem/
│
├── backend/                             # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── school/
│   │   │   │           └── management/
│   │   │   │
│   │   │   │               ├── academicyear/
│   │   │   │               ├── attendance/
│   │   │   │               ├── auth/
│   │   │   │               ├── classroom/
│   │   │   │               ├── config/
│   │   │   │               ├── dashboard/
│   │   │   │               ├── exam/
│   │   │   │               ├── fee/
│   │   │   │               ├── grade/
│   │   │   │               ├── security/
│   │   │   │               ├── student/
│   │   │   │               ├── subject/
│   │   │   │               ├── teacher/
│   │   │   │               ├── timetable/
│   │   │   │               ├── user/
│   │   │   │               ├── exception/
│   │   │   │               └── common/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── README.md
│
├── frontend/                            # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
├── docs/
│   ├── ERD.pdf
│   ├── Relational_Schema.pdf
│   ├── API_Documentation.md
│   └── Screenshots/
│
├── .gitignore
├── LICENSE
└── README.md


## 🚀 Technologies Used

### Backend
- Java 17+
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven
- Lombok

### Frontend
- React
- Vite
- React Router
- Axios
- Bootstrap

### Database
- MySQL 8

### Tools
- Git & GitHub
- Postman
- VS Code
- IntelliJ IDEA
- MySQL Workbench



## 📋 Planned Modules

- ✅ User Authentication
- 🚧 Dashboard
- 🚧 Student Management
- 🚧 Teacher Management
- 🚧 Academic Year Management
- 🚧 Class Management
- 🚧 Subject Management
- 🚧 Timetable Management
- 🚧 Attendance Management
- 🚧 Examination Management
- 🚧 Grade Management
- 🚧 Fee Management
- 🚧 Reports & Analytics


## 📌 Current Progress

- ✅ Spring Boot Backend Setup
- ✅ MySQL Integration
- ✅ Spring Security Configuration
- ✅ User Registration API
- ✅ Login API
- 🚧 JWT Authentication
- 🚧 React Frontend
- 🚧 REST API Documentation
