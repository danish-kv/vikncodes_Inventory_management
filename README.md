# Inventory Management System

## Overview

This project is a full-stack Inventory Management System that provides a comprehensive solution for managing product inventory, sales, and user access. It features JWT authentication, product and category management, variant control, and detailed analytics dashboard.

## Features

### Authentication & Security
- JWT token-based authentication
- Role-based access control
- Secure API endpoints

### Product Management
- Product listing and details
- Category management
- Variant and sub-variant management
- Stock tracking and updates

### User Management
- User registration and authentication
- Role assignment and permissions
- User activity tracking

### Dashboard Analytics
- Total products overview
- Sales analytics
- User statistics
- Category distribution

### Purchase Management
- Seamless purchase processing
- Transaction history
- Purchase analytics

## Tech Stack

- **Frontend:** React with Tailwind CSS
- **Backend:** Django, Django Rest Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

## Prerequisites

Before you begin, ensure you have the following installed:
- Git
- Python (3.8 or higher)
- Node.js (14.0 or higher)
- npm (6.0 or higher)
- PostgreSQL

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/danish-kv/vikncodes_Inventory_management.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Set up environment variables:
   ```bash
  nano .env

   ```
   
   Configure the following in your `.env` file:
   ```
   DEBUG=True
   SECRET_KEY=your_secret_key
   DATABASE_URL=postgresql://username:password@localhost:5432/db_name
   ALLOWED_HOSTS=localhost,127.0.0.1
   JWT_SECRET_KEY=your_jwt_secret
   ```

7. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Usage

Here's a brief guide on how to use the application:

1. **Access the frontend at http://localhost:5173**
2. **Explore the various features**
   - Register or login with JWT token
   - Manage products and categories
   - Track inventory and product variants
   - Create and manage user accounts
   - Monitor product counts and sales
   - Analyze user engagement and category distribution


Landing Page
![alt text](documentation/image-3.png)

Userside Produt Listing
![alt text](documentation/image-4.png)
![alt text](documentation/image-5.png)

Product Dashboard
![alt text](documentation/image.png)

Product Details
![alt text](documentation/image-1.png)

User Management
![alt text](documentation/image-2.png)



## API Documentation

The API endpoints are available at `http://127.0.0.1:8000/api/`

