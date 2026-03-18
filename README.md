# Emergency Mechanic Backend

A backend API for an on-demand mechanic and garage finder system in Sri Lanka. This system connects customers with nearby mechanics and garages using real-time communication, geolocation-based services, and a cash payment confirmation flow.

The platform is designed to support multiple roles including customers, mechanics, garages, and admins. Customers can create emergency service requests, providers can accept and complete them, and the system supports real-time communication, live location updates, provider verification, reviews, and payment tracking.

---

## Features

- **Geospatial Discovery:** Find the nearest mechanics based on the customer's live location.
- **Real-time Service Requests:** Send and receive service requests instantly using Socket.io.
- **Live Chat System:** Real-time messaging between customers and providers with 'seen' status.
- **Provider Dashboard:** View daily earnings and completed services.
- **Image Uploads:** Upload profile pictures and documents using Multer.
- **Cash Payment Confirmation:** Track request payments using a cash-based payment confirmation flow.
- **Role-Based Access Control:** Separate permissions for customers, mechanics, garages, and admins.
- **Provider Verification Flow:** Admin approval and rejection process for mechanics and garages.
- **Request Lifecycle Tracking:** Manage request status from creation to completion.
- **Static File Serving:** Uploaded files are available through the `/uploads` path.
- **API Documentation:** Swagger integration for API documentation and testing.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Real-time:** Socket.io
- **File Handling:** Multer
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger

---

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

### Example Structure

```bash
.
├── server.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── realtime/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
├── uploads/
├── package.json
└── README.md


```
System Roles

The system supports the following user roles:

customer - Creates service requests and pays after service completion.

mechanic - Accepts and completes mechanic-related emergency requests.

garage - Accepts and completes garage-related service requests.

admin - Reviews and verifies mechanics and garages.

Database Models
User Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

username: String (required, unique)

firstName: String

lastName: String

displayName: String

email: String (unique)

phone: String

password: String

type: String (enum: ["customer", "mechanic", "garage", "admin"], required)

location: Object

type: String (enum: ["Point"], default: "Point")

coordinates: Array of Numbers (default: [0, 0])

visibilitySettings: Object

showProfile: Boolean (default: true)

showPhone: Boolean (default: false)

showLocation: Boolean (default: false)

isVerified: Boolean (default: false)

profilePic: String (default: "")

isOnboarded: Boolean (default: false)

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

No foreign keys (base model)

Mechanic Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

userId: ObjectId (Foreign Key to User, required)

skills: Array of Strings

experience: Number

documents: Object

nic: String

certificate: String

license: String

verificationStatus: String (enum: ["pending", "approved", "rejected"], default: "pending")

isVerified: Boolean (default: false)

isAvailable: Boolean (default: true)

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

Foreign Key: userId references User._id

Garage Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

userId: ObjectId (Foreign Key to User, required)

name: String (required)

address: String

photos: Array of Strings

services: Array of Strings

verificationStatus: String (enum: ["pending", "approved", "rejected"], default: "pending")

isVerified: Boolean (default: false)

isAvailable: Boolean (default: true)

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

Foreign Key: userId references User._id

Request Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

customerId: ObjectId (Foreign Key to User, required)

providerId: ObjectId (Foreign Key to User)

requestType: String (enum: ["mechanic", "garage"])

issueDescription: String (required)

vehicleDetails: String

location: Object

type: String (enum: ["Point"], default: "Point")

coordinates: Array of Numbers (required)

status: String (enum: ["pending", "accepted", "in_progress", "completed", "cancelled"], default: "pending")

acceptedAt: Date (default: null)

completedAt: Date (default: null)

damageImage: String

estimatedCost: Number

finalAmount: Number

paymentStatus: String (enum may vary by implementation, e.g. "unpaid", "pending", "paid_cash")

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

Foreign Key: customerId references User._id

Foreign Key: providerId references User._id

Message Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

requestId: ObjectId (Foreign Key to Request, required)

senderId: ObjectId (Foreign Key to User, required)

receiverId: ObjectId (Foreign Key to User, required)

message: String

imageUrl: String

messageType: String (enum: ["text", "image"], default: "text")

isRead: Boolean (default: false)

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

Foreign Key: requestId references Request._id

Foreign Key: senderId references User._id

Foreign Key: receiverId references User._id

Review Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

requestId: ObjectId (Foreign Key to Request, required)

customerId: ObjectId (Foreign Key to User, required)

providerId: ObjectId (Foreign Key to User, required)

rating: Number (required, min: 1, max: 5)

comment: String (trimmed)

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

Foreign Key: requestId references Request._id

Foreign Key: customerId references User._id

Foreign Key: providerId references User._id

Payment Model
Attributes & Data Types

_id: ObjectId (Primary Key, auto-generated)

requestId: ObjectId (Foreign Key to Request, required)

customerId: ObjectId (Foreign Key to User, required)

providerId: ObjectId (Foreign Key to User, required)

amount: Number

method: String (default: "cash")

status: String (e.g. "pending", "completed")

paidAt: Date

createdAt: Date (auto-generated timestamp)

updatedAt: Date (auto-generated timestamp)

Relationships

Primary Key: _id

Foreign Key: requestId references Request._id

Foreign Key: customerId references User._id

Foreign Key: providerId references User._id

Relationships Overview

User is the central entity.

Mechanic and Garage extend User via userId (one-to-one relationship, as each User can have at most one Mechanic or Garage profile based on type).

Request links User as customer and provider (many-to-many via Users, but provider is optional until accepted).

Message belongs to a Request and involves two Users (sender and receiver).

Review belongs to a Request and involves User as customer and provider.

Payment belongs to a Request and tracks cash payment status between customer and provider.

Cardinality

User to Mechanic: One-to-One (each Mechanic has one User, each User can have one Mechanic if type is "mechanic").

User to Garage: One-to-One (each Garage has one User, each User can have one Garage if type is "garage").

User to Request (as customer): One-to-Many (one User can create many Requests).

User to Request (as provider): One-to-Many (one User can accept many Requests).

Request to Message: One-to-Many (one Request can have many Messages).

Request to Review: One-to-One (one Request can have one Review, assuming one review per request).

Request to Payment: One-to-One or One-to-Many depending on implementation, but currently intended as one main payment record per request.

User to Message (as sender/receiver): One-to-Many (one User can send/receive many Messages).

User to Review (as customer/provider): One-to-Many (one User can give/receive many Reviews).

ER Diagram Requirements
Missing Attributes

Added services array to Garage.

Added estimatedCost / finalAmount / paymentStatus to Request.

Added message and imageUrl to Message.

Added Payment model for cash payment tracking.

Improvements

Ensure consistent naming (e.g., providerId in Request could be more specific like mechanicId or garageId based on requestType).

Add indexes for performance (e.g., on foreign keys like userId in Mechanic/Garage).

Consider adding constraints or validations (e.g., ensure providerId matches requestType).

For ER diagram, represent inheritance: User as base, with Mechanic and Garage as subtypes.

Add composite keys or unique constraints where logical (e.g., one Review per Request).

Request Lifecycle

A typical service request follows this lifecycle:

Customer creates a request

Includes location, issue description, vehicle details, and optional damage image.

Nearby providers are discovered

Based on geolocation and provider availability.

Mechanic or garage accepts the request

The providerId is assigned and status changes from pending to accepted.

Service is provided

The provider and customer can communicate via chat.

Provider completes the request

The request is marked as completed and the final service amount can be saved.

Payment is tracked

A cash payment record is created and later confirmed.

Customer submits a review

A rating and comment can be stored after service completion.

Cash Payment Flow

This backend currently supports cash payment confirmation, not online payment integration.

Flow

Customer creates a request.

Provider accepts the request.

Provider completes the request and submits a finalAmount.

The backend creates a payment record for that request.

Customer pays the provider in cash.

Customer confirms the cash payment through the API.

Payment status is updated to completed.

Notes

No payment gateway is currently integrated.

This flow is useful for MVP and local deployment scenarios.

A future version can replace or extend this with online payment integration.

Real-Time Features

The system uses Socket.io for real-time communication.

Supported Real-Time Behaviors

Instant request notifications

Live chat between customer and provider

Read / seen status updates

Live location update support for request-related tracking

Example Socket Use Cases

send_message

mark_as_read

provider location updates

request notifications

Installation

Clone the repository.

Install dependencies:

npm install

Create a .env file with the following variables:

MONGO_URI: Your MongoDB connection string

JWT_SECRET: Secret key for JWT

PORT: Server port (default 5000 or project-specific)

Start the server:

npm run dev
Environment Variables

Example .env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001

You may also add other project-specific environment variables later depending on deployment needs.

Running the Project
Development
npm run dev
Production
npm start

If your project serves uploaded files, they will be accessible from:

/uploads/<filename>
API Endpoints

All endpoints are prefixed with /api/v1.

Authentication

POST /auth/register - Register a new user

/auth/register = request {email, username, password}

POST /auth/login - Login user

/auth/login = request {email, password}

Example Register Request
{
  "email": "user@example.com",
  "username": "exampleuser",
  "password": "12345678"
}
Example Login Request
{
  "email": "user@example.com",
  "password": "12345678"
}
User Management

GET /me - Get my profile (authenticated)

No request body

PUT /me - Update my profile (authenticated)

/me = request {firstName, lastName, phone, displayName} (optional fields)

GET /:id - Get user profile (public, with privacy)

No request body

PATCH /me/visibility - Update visibility settings (authenticated)

/me/visibility = request {showProfile, showPhone, showLocation}

PUT /location - Update location (authenticated)

/location = request {lat, lng}

POST /upload-profile - Upload profile image (authenticated, multipart)

Multipart: profilePic file

Mechanic Management

POST /mechanic/profile - Create mechanic profile (mechanic role)

/mechanic/profile = request {skills, experience, documents}

GET /mechanic/profile - Get mechanic profile (authenticated)

No request body

PUT /mechanic/profile - Update mechanic profile (authenticated)

/mechanic/profile = request {skills, experience, documents}

POST /mechanic/profile/upload-doc - Upload mechanic documents (authenticated, multipart)

/mechanic/profile/upload-doc = request {docType}, Multipart: documents file

Garage Management

POST /garage/profile - Create garage profile (garage role)

/garage/profile = request {name, address}

GET /garage/profile - Get garage profile (authenticated)

No request body

PUT /garage/profile - Update garage profile (authenticated)

/garage/profile = request {name, address, services}

POST /garage/upload-photo - Upload garage photo (garage role, multipart)

Multipart: photo file

DELETE /garage/delete-photo - Delete garage photo (garage role)

/garage/delete-photo = request {photoUrl}

Request Management

GET /request/get/history - Get my request history (authenticated)

No request body

GET /request/nearby - Get nearby requests (authenticated)

Query: {lng, lat}

POST /request - Create a new request (customer role, multipart for image)

/request = request {lng, lat, requestType, issueDescription, vehicleDetails, estimatedCost}, Multipart: damageImage file

POST /request/:id/accept - Accept a request (mechanic/garage role)

No request body

POST /request/:id/complete - Complete a request (mechanic/garage role)

Example body: {finalAmount}

GET /request/provider-stats - Get provider stats (authenticated)

No request body

POST /request/update-location - Update location (authenticated)

/request/update-location = request {lng, lat}

Example Create Request
{
  "lng": 79.8612,
  "lat": 6.9271,
  "requestType": "mechanic",
  "issueDescription": "Car won't start",
  "vehicleDetails": "Toyota Prius 2015",
  "estimatedCost": 3000
}
Example Complete Request
{
  "finalAmount": 4500
}
Payment Management

GET /payment/my - Get authenticated user's payment records

GET /payment/request/:requestId - Get payment details for a specific request

POST /payment/request/:requestId/confirm-cash - Confirm that the cash payment has been completed

Example Confirm Cash Payment
{}
Chat

GET /chat/:requestId - Get chat history for a request (authenticated)

No request body

GET /chat - Print chats / testing endpoint if available

No request body

Review

POST /review - Create a review (authenticated)

/review = request {requestId, rating, comment}

PUT /review/:id - Update a review (authenticated)

/review/:id = request {rating, comment}

DELETE /review/:id - Delete a review (authenticated)

No request body

Example Review Request
{
  "requestId": "REQUEST_ID_HERE",
  "rating": 5,
  "comment": "Quick and professional service"
}
Admin

GET /admin/mechanics/pending - Get pending mechanics (admin)

No request body

PUT /admin/mechanics/:id/approve - Approve mechanic (admin)

No request body

PUT /admin/mechanics/:id/reject - Reject mechanic (admin)

No request body

GET /admin/garages/pending - Get pending garages (admin)

No request body

PUT /admin/garages/:id/approve - Approve garage (admin)

No request body

PUT /admin/garages/:id/reject - Reject garage (admin)

No request body

Testing

API Testing: Use Postman or access Swagger docs at /api-docs.

Real-time Testing: Use Postman's Socket.io client for events like send_message, mark_as_read.

File Upload: Use form-data in Postman with keys like profilePic, damageImage, etc.

Payment Testing: Complete a request with a finalAmount, then call the cash confirmation endpoint.

Suggested Manual Test Order

Register/Login

Create mechanic or garage profile

Admin approval

Update provider location

Customer creates request

Provider accepts request

Chat between provider and customer

Provider completes request with finalAmount

Customer confirms cash payment

Customer submits review

Notes / Future Improvements

Add online payment gateway integration.

Strengthen provider-request type validation.

Improve Socket authentication and security.

Add better request lifecycle enforcement.

Add automated testing.

Add push notifications / SMS integration.

Improve analytics and provider earnings reporting.

Add map/tracking enhancements for live provider movement.