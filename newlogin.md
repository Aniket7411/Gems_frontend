# Simple Authentication API

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. User Signup
- **POST** `/auth/signup`
- **Description**: Create a new user account
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. User Login
- **POST** `/auth/login`
- **Description**: Login with email and password
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `500` - Internal Server Error

## Authentication

Use JWT tokens in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## How to Test

1. **Signup**: POST to `/api/auth/signup` with name, email, password
2. **Login**: POST to `/api/auth/login` with email, password
3. **Health Check**: GET `/api/health` to check if server is running

That's it! Simple and clean authentication API.
