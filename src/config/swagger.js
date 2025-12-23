const swaggerAutogen = require('swagger-autogen')({ language: 'en-US', autoHeaders: false });

const doc = {
  info: { title: 'Emergency Mechanic API', description: 'API Documentation' },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Please enter JWT with Bearer prefix (Example: Bearer <token>)'
    }
  },
  // මෙන්න මෙතන තමයි ඔයාගේ Models ටික definition එකක් විදියට එක පාරක් ලියන්නේ
  definitions: {
    MechanicProfile: {
      bio: "I am a professional engine specialist with 5 years experience.",
      specialization: ["Engine", "Brakes", "Hybrid"],
      experienceYears: 5,
      availability: true,
      baseFee: 1500
    },
    UploadDocument: {
      docType: "nic" // nic, certificate, license
    }
  }
};

const outputFile = './src/config/swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);