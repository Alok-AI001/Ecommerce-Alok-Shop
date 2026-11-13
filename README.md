# 🛒 Ecommerce Alok Shop

A full-stack E-Commerce web application developed using **React.js, Django, Django REST Framework, and SQLite**. This project provides an online shopping platform where users can browse products, register, log in, add products to their cart, and place orders.

## 🚀 Features

- User Registration and Login
- User Profile Management
- Browse and View Products
- Product Details
- Add Products to Cart
- Update and Remove Cart Items
- Shipping Address Management
- Payment Method Selection
- Place Orders
- View Order Details
- Admin Product Management
- Admin User Management
- Order Management

## 💻 Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Redux
- React Router DOM
- Axios

### Backend
- Python
- Django
- Django REST Framework
- Django REST Framework Simple JWT

### Database
- SQLite

### Tools
- Visual Studio Code
- Git
- GitHub
- Postman

## 📂 Project Structure

```text
Ecommerce-Alok-Shop/
│
├── backend/
│   └── ecommerce/
│       └── project/
│           ├── app/
│           ├── project/
│           ├── static/
│           ├── templates/
│           └── manage.py
│
└── frontend/
    └── app/
        ├── public/
        ├── src/
        │   ├── actions/
        │   ├── components/
        │   ├── constants/
        │   ├── reducers/
        │   └── store.js
        └── package.json
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Alok-AI001/Ecommerce-Alok-Shop.git
```

### 2. Backend Setup

Open a terminal:

```bash
cd Ecommerce-Alok-Shop/backend/ecommerce/project
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install Django==5.0.6 djangorestframework django-cors-headers djangorestframework-simplejwt six Pillow
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend server:

```bash
python manage.py runserver
```

Backend URL: http://127.0.0.1:8000/

### 3. Frontend Setup

Open another terminal:

```bash
cd Ecommerce-Alok-Shop/frontend/app
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

Frontend URL: http://localhost:3000/

## 🔐 Authentication

The application supports user registration and login. JWT-based authentication is included through Django REST Framework Simple JWT.

## 🎯 Project Objective

The main objective of this project is to develop a full-stack online shopping application and gain practical experience in frontend development, backend API development, database integration, authentication, and state management.

## 👨‍💻 Author

**Alok Khandare**

BE – Artificial Intelligence and Machine Learning

GitHub: [Alok-AI001](https://github.com/Alok-AI001)

---

⭐ If you find this project useful, consider giving it a star!
