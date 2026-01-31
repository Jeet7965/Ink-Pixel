# Ink Pixel – Full Stack Blogging Platform (MERN)

Ink Pixel is a full-stack blogging platform built using the MERN stack (MongoDB, Express.js, React, Node.js). The project focuses on real-world backend architecture with authentication, role-based authorization, media uploads, and RESTful API design.

---

## 🚀 Features

### User
- User registration and login (JWT authentication)
- View and read blogs
- Add reviews/comments
- Access protected routes securely

### Admin
- Admin authentication and authorization
- Create, update, and delete blogs
- Manage blog categories
- Manage users
- Upload images using Cloudinary
- Moderate blog reviews

### Backend
- RESTful API architecture
- JWT-based authentication
- Role-based access control (Admin/User)
- MongoDB with Mongoose
- Cloudinary integration for image uploads
- Secure middleware implementation

---

## 🛠 Tech Stack

**Frontend**
- React.js
- HTML5, CSS3, JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Mongoose)

**Tools & Libraries**
- JWT
- bcrypt
- dotenv
- Multer
- Cloudinary

---

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Protected routes using middleware
- Role-based access control for admin and users

---

## ⚙️ Installation & Setup

### Clone Repository
```bash
git clone https://github.com/your-username/ink-pixel.git
cd ink-pixel/Backend
Install Dependencies
npm install

Environment Variables (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Run Server
npm start


Server runs at:

http://localhost:5000

📡 API Endpoints (Sample)

POST /api/auth/register

POST /api/auth/login

POST /api/blog/create

GET /api/blog/all

PUT /api/blog/update/:id

DELETE /api/blog/delete/:id

POST /api/review/add

🎯 Learning Outcomes

MERN stack architecture

REST API development

Authentication & Authorization

Middleware implementation

Cloudinary media uploads

Secure backend design
## 📂 Project Structure
Ink-Pixel-main/
│
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── admincontroller.js
│   │   ├── blogController.js
│   │   ├── reviewcontroller.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── AuthMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── ImgUpload.js
│   │
│   ├── model/
│   │   ├── userModel.js
│   │   ├── blogModel.js
│   │   ├── categoryModel.js
│   │   ├── reviewModel.js
│   │   └── mediaModel.js
│   │
│   ├── index.js
│   └── package.json
│
└── .gitignore

