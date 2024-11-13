const cloudinary = require('cloudinary').v2;
require('dotenv').config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,

  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
