const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uniskills/resumes', 
    allowed_formats: ['pdf'],
    format: 'pdf', 
    resource_type: 'image', 
    public_id: (req, file) => {
      const cleanName = file.originalname.replace(/\.pdf$/i, '').replace(/\s+/g, '-');
      return Date.now() + '-' + cleanName;
    },
  },
});

const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uniskills/profile_pics',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => 'pp-' + Date.now(),
  },
});

module.exports = {
  cloudinary,
  resumeStorage,
  profilePicStorage
};
