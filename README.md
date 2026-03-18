# Emergency Mechanic Backend [![Node.js](https://img.shields.io/badge/Node.js-v20-green)](https://nodejs.org) [![Express](https://img.shields.io/badge/Express-5.2.1-blue)](https://expressjs.com) [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.0.1-green)](https://mongoosejs.com) [![License: ISC](https://img.shields.io/badge/License-ISC-yellow)](LICENSE) [![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-red)](https://socket.io)

A backend API for an on-demand mechanic and garage finder system in Sri Lanka. Connects customers with nearby mechanics/garages using real-time communication, geolocation, **cash payment confirmation**, and request tracking.

Supports roles: **customers**, **mechanics**, **garages**, **admins**. Features emergency requests, real-time chat/location, verification, reviews, payments.

## 🚀 Quick Start
```bash
git clone <repo> && cd emergency-mechanic-backend
npm install
npm run dev
```
Visit `http://localhost:5001/api-docs` (Swagger).

## Changelog
**Recent Updates (v1.0.0+):**
- **Payment Enhancements**: Full Payment model/service/controller/routes. Cash confirmation flow (`POST /payment/request/:id/confirm-cash`), status tracking (unpaid/pending/paid_cash).
- **Request Improvements**: `finalAmount`, `paymentStatus`, lifecycle (pending/accepted/in_progress/completed).
- **Real-time**: Enhanced `locationSocket.js` for live tracking.
- **User/Request**: Optimized repositories/services (`userRepository.js`, `requestRepository.js` etc.).
- **Dependencies**: Express 5.x, Mongoose 9.x, Socket.io 4.x.

## Features
- **Geospatial Discovery**: Nearest mechanics via live location.
- **Real-time Requests/Chat**: Socket.io for instant messaging ('seen' status), notifications.
- **Cash Payments**: Track/complete cash payments post-service.
- **Provider Dashboard**: Earnings, stats (`GET /request/provider-stats`).
- **Uploads**: Profiles/docs/images (Multer, `/uploads`).
- **RBAC**: Customer/mechanic/garage/admin middleware.
- **Verification**: Admin approve/reject mechanics/garages.
- **Reviews**: Post-service ratings/comments.
- **Privacy**: User visibility controls.
- **API Docs**: Swagger (`/api-docs`).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js ^5.2.1
- **Database**: MongoDB (Mongoose ^9.0.1)
- **Real-time**: Socket.io ^4.8.1
- **Auth**: JWT (bcryptjs)
- **Uploads**: Multer ^2.0.2
- **Docs**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Dev**: Nodemon ^3.1.11

## 📁 Project Structure
```
.
├── server.js          # Entry point
├── src/
│   ├── app.js         # Express app
│   ├── config/        # DB, Swagger
│   ├── controllers/   # HTTP handlers
│   ├── middleware/    # Auth, roles, upload
│   ├── models/        # Mongoose schemas (User, Request, Payment, etc.)
│   ├── realtime/      # Socket.io (chatHandler.js, locationSocket.js)
│   ├── repositories/  # DB queries
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Helpers (privacy, tokens)
├── uploads/           # Static files
├── package.json
└── README.md
```

## Models Overview
See `src/models/` for schemas:
- **User**: Core (roles, location, privacy).
- **Mechanic/Garage**: Profiles (skills/services, verification).
- **Request**: Lifecycle, geo-point, images.
- **Payment**: Cash tracking (linked to Request).
- **Message/Review**: Chat/reviews per request.

**Relationships**: User 1:N Request/Message/Review; Request 1:1 Payment.

## Installation
1. Clone repo.
2. `npm install`
3. Create `.env`:
   ```
   MONGO_URI=mongodb://...
   JWT_SECRET=your-secret
   PORT=5001
   ```
4. `npm run dev`

**Scripts**:
- `npm run dev` (nodemon)
- `npm start` (production)

## API Endpoints
Prefixed `/api/v1`. Auth via `Authorization: Bearer <token>`.

### Auth
- `POST /auth/register` {email, username, password}
- `POST /auth/login`

### User
- `GET/PUT /me`, `/me/visibility`, `/location`
- `POST /upload-profile`

### Requests
- `POST /request` {lat,lng,requestType,...} (multipart damageImage)
- `POST /request/:id/accept|complete` {finalAmount}
- `GET /request/nearby?lat=&lng=`, `/request/get/history`

### Payments (New!)
- `GET /payment/my`, `/payment/request/:requestId`
- `POST /payment/request/:requestId/confirm-cash`

### Chat/Review
- `GET/POST /chat/:requestId`
- `POST /review` {requestId, rating, comment}

### Providers
- `POST/PUT /mechanic/profile`, `/garage/profile`
- Admin: `PUT /admin/mechanics/:id/approve|reject`

**Swagger**: `/api-docs` for full docs/testing.

## Testing
- **Postman/Swagger**: API calls.
- **Sockets**: Postman Socket.io (send_message, mark_as_read).
- Flow: Register → Profile → Request → Accept/Chat → Complete → Pay → Review.

## Contributing
1. Fork & PR.
2. Follow repository pattern.
3. Lint: (add ESLint?).
4. Test changes.

## Notes / Future
- MVP cash payments (no gateway).
- Add: Online payments, push notifications, analytics.
- Indexes on geo/queries recommended.

---

*Version 1.0.0 | Built with ❤️ for Sri Lankan roads.*

