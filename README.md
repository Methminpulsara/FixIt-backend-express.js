# Emergency Mechanic Backend

A backend API for an on-demand mechanic and garage finder system in Sri Lanka. This system connects customers with nearby mechanics and garages using real-time communication and geolocation-based services.

## Features

- **Geospatial Discovery:** Find the nearest mechanics based on the customer's live location.
- **Real-time Service Requests:** Send and receive service requests instantly using Socket.io.
- **Live Chat System:** Real-time messaging between customers and providers with 'seen' status.
- **Provider Dashboard:** View daily earnings and completed services.
- **Image Uploads:** Upload profile pictures and documents using Multer.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Real-time:** Socket.io
- **File Handling:** Multer
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger

## Project Structure

The project follows a repository pattern for better organization:

- **models/:** Database schemas.
- **repositories/:** Database query handling.
- **services/:** Business logic.
- **controllers/:** HTTP request handling.
- **routes/:** API route definitions.
- **middleware/:** Custom middleware for authentication, roles, uploads, etc.
- **realtime/:** Socket.io handlers for real-time features.
- **utils/:** Utility functions.
- **config/:** Configuration files for DB and Swagger.

## Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT
   - `PORT`: Server port (default 5000)
4. Start the server: `npm run dev`

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### User Management
- `GET /me` - Get my profile (authenticated)
- `PUT /me` - Update my profile (authenticated)
- `GET /:id` - Get user profile (public, with privacy)
- `PATCH /me/visibility` - Update visibility settings (authenticated)
- `PUT /location` - Update location (authenticated)
- `POST /upload-profile` - Upload profile image (authenticated, multipart)

### Mechanic Management
- `POST /mechanic/profile` - Create mechanic profile (mechanic role)
- `GET /mechanic/profile` - Get mechanic profile (authenticated)
- `PUT /mechanic/profile` - Update mechanic profile (authenticated)
- `POST /mechanic/profile/upload-doc` - Upload mechanic documents (authenticated, multipart)

### Garage Management
- `POST /garage/profile` - Create garage profile (garage role)
- `GET /garage/profile` - Get garage profile (authenticated)
- `PUT /garage/profile` - Update garage profile (authenticated)
- `POST /garage/upload-photo` - Upload garage photo (garage role, multipart)
- `DELETE /garage/delete-photo` - Delete garage photo (garage role)

### Request Management
- `GET /request/get/history` - Get my request history (authenticated)
- `GET /request/nearby` - Get nearby requests (authenticated)
- `POST /request` - Create a new request (customer role, multipart for image)
- `POST /request/:id/accept` - Accept a request (mechanic/garage role)
- `POST /request/:id/complete` - Complete a request (mechanic/garage role)
- `GET /request/provider-stats` - Get provider stats (authenticated)
- `POST /request/update-location` - Update location (authenticated)

### Chat
- `GET /chat/:requestId` - Get chat history for a request (authenticated)
- `GET /chat` - Print chats (for testing?)

### Review
- `POST /review` - Create a review (authenticated)

### Admin
- `GET /admin/mechanics/pending` - Get pending mechanics (admin)
- `PUT /admin/mechanics/:id/approve` - Approve mechanic (admin)
- `PUT /admin/mechanics/:id/reject` - Reject mechanic (admin)
- `GET /admin/garages/pending` - Get pending garages (admin)
- `PUT /admin/garages/:id/approve` - Approve garage (admin)
- `PUT /admin/garages/:id/reject` - Reject garage (admin)

## Testing

- **API Testing:** Use Postman or access Swagger docs at `/api-docs`.
- **Real-time Testing:** Use Postman's Socket.io client for events like `send_message`, `mark_as_read`.
- **File Upload:** Use `form-data` in Postman with keys like `profilePic`, `damageImage`, etc.

## Contributing

Contributions are welcome. Please follow standard practices for pull requests and issues.
