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
  - `/auth/register = request {email, username, password}`
- `POST /auth/login` - Login user
  - `/auth/login = request {email, password}`

### User Management
- `GET /me` - Get my profile (authenticated)
  - No request body
- `PUT /me` - Update my profile (authenticated)
  - `/me = request {firstName, lastName, phone, displayName}` (optional fields)
- `GET /:id` - Get user profile (public, with privacy)
  - No request body
- `PATCH /me/visibility` - Update visibility settings (authenticated)
  - `/me/visibility = request {showProfile, showPhone, showLocation}`
- `PUT /location` - Update location (authenticated)
  - `/location = request {lat, lng}`
- `POST /upload-profile` - Upload profile image (authenticated, multipart)
  - Multipart: profilePic file

### Mechanic Management
- `POST /mechanic/profile` - Create mechanic profile (mechanic role)
  - `/mechanic/profile = request {skills, experience, documents}`
- `GET /mechanic/profile` - Get mechanic profile (authenticated)
  - No request body
- `PUT /mechanic/profile` - Update mechanic profile (authenticated)
  - `/mechanic/profile = request {skills, experience, documents}`
- `POST /mechanic/profile/upload-doc` - Upload mechanic documents (authenticated, multipart)
  - `/mechanic/profile/upload-doc = request {docType}`, Multipart: documents file

### Garage Management
- `POST /garage/profile` - Create garage profile (garage role)
  - `/garage/profile = request {name, address}`
- `GET /garage/profile` - Get garage profile (authenticated)
  - No request body
- `PUT /garage/profile` - Update garage profile (authenticated)
  - `/garage/profile = request {name, address, services}`
- `POST /garage/upload-photo` - Upload garage photo (garage role, multipart)
  - Multipart: photo file
- `DELETE /garage/delete-photo` - Delete garage photo (garage role)
  - `/garage/delete-photo = request {photoUrl}`

### Request Management
- `GET /request/get/history` - Get my request history (authenticated)
  - No request body
- `GET /request/nearby` - Get nearby requests (authenticated)
  - Query: {lng, lat}
- `POST /request` - Create a new request (customer role, multipart for image)
  - `/request = request {lng, lat, requestType, issueDescription, vehicleDetails}`, Multipart: damageImage file
- `POST /request/:id/accept` - Accept a request (mechanic/garage role)
  - No request body
- `POST /request/:id/complete` - Complete a request (mechanic/garage role)
  - No request body
- `GET /request/provider-stats` - Get provider stats (authenticated)
  - No request body
- `POST /request/update-location` - Update location (authenticated)
  - `/request/update-location = request {lng, lat}`

### Chat
- `GET /chat/:requestId` - Get chat history for a request (authenticated)
  - No request body
- `GET /chat` - Print chats (for testing?)
  - No request body

### Review
- `POST /review` - Create a review (authenticated)
  - `/review = request {requestId, rating, comment}`
- `PUT /review/:id` - Update a review (authenticated)
  - `/review/:id = request {rating, comment}`
- `DELETE /review/:id` - Delete a review (authenticated)
  - No request body

### Admin
- `GET /admin/mechanics/pending` - Get pending mechanics (admin)
  - No request body
- `PUT /admin/mechanics/:id/approve` - Approve mechanic (admin)
  - No request body
- `PUT /admin/mechanics/:id/reject` - Reject mechanic (admin)
  - No request body
- `GET /admin/garages/pending` - Get pending garages (admin)
  - No request body
- `PUT /admin/garages/:id/approve` - Approve garage (admin)
  - No request body
- `PUT /admin/garages/:id/reject` - Reject garage (admin)
  - No request body

## Testing

- **API Testing:** Use Postman or access Swagger docs at `/api-docs`.
- **Real-time Testing:** Use Postman's Socket.io client for events like `send_message`, `mark_as_read`.
- **File Upload:** Use `form-data` in Postman with keys like `profilePic`, `damageImage`, etc.

## Contributing

Contributions are welcome. Please follow standard practices for pull requests and issues.
