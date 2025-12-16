const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API documentation",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],

    // 🔐 Security (for JWT – future ready)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        // ================= REGISTER =================
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password", "type"],
          properties: {
            username: { type: "string", example: "kamal123" },
            firstName: { type: "string", example: "Kamal" },
            lastName: { type: "string", example: "Perera" },
            displayName: { type: "string", example: "Kamal P" },
            email: { type: "string", example: "kamal@gmail.com" },
            phone: { type: "string", example: "0771234567" },
            password: { type: "string", example: "password123" },
            type: {
              type: "string",
              enum: ["customer", "mechanic", "garage", "admin"],
              example: "customer",
            },
            location: {
              type: "object",
              properties: {
                type: { type: "string", example: "Point" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                  example: [79.8612, 6.9271],
                },
              },
            },
          },
        },

        // ================= LOGIN =================
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "kamal@gmail.com" },
            password: { type: "string", example: "password123" },
          },
        },

        // ================= USER RESPONSE =================
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "string", example: "64afc9d9..." },
            username: { type: "string", example: "kamal123" },
            email: { type: "string", example: "kamal@gmail.com" },
            type: { type: "string", example: "customer" },
            isVerified: { type: "boolean", example: false },
          },
        },
      },
    },
  },

  // 🔍 Swagger annotations paths
  apis: [
    "./routes/*.js",
    "./docs/*.js", // optional (future)
  ],
};

module.exports = swaggerJsdoc(options);
