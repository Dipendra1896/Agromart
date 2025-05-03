// middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory path (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory in the project root if it doesn't exist
const uploadDir = path.resolve(__dirname, '../../uploads');
console.log('Upload directory path:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log('Creating uploads directory');
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create directory for documents if it doesn't exist
const documentsDir = path.resolve(uploadDir, 'documents');
if (!fs.existsSync(documentsDir)) {
  console.log('Creating documents directory');
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Create directory for profile pictures if it doesn't exist
const profilesDir = path.resolve(uploadDir, 'profiles');
if (!fs.existsSync(profilesDir)) {
  console.log('Creating profiles directory');
  fs.mkdirSync(profilesDir, { recursive: true });
}

// Create directory for product/input images if it doesn't exist
const productsDir = path.resolve(uploadDir, 'products');
if (!fs.existsSync(productsDir)) {
  console.log('Creating products directory');
  fs.mkdirSync(productsDir, { recursive: true });
}

// Base storage configuration
const getStorage = (directory) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(`Storing file in directory: ${directory}`);
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      // Create unique filename: timestamp-originalname
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      console.log(`Generated filename: ${uniqueName}`);
      cb(null, uniqueName);
    }
  });
};

// Image files filter
const imageFileFilter = (req, file, cb) => {
  console.log(`Checking file type: ${file.mimetype}`);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.log('File rejected: Not an image file');
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Document files filter
const documentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  console.log(`Checking document file type: ${file.mimetype}`);
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log(`File rejected: Invalid document type ${file.mimetype}`);
    cb(new Error(`Invalid file type. Allowed types: PDF, Images, Word and Excel documents. Got: ${file.mimetype}`), false);
  }
};

// Create different multer instances for different types of uploads
const uploadImage = multer({
  storage: getStorage(productsDir),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: imageFileFilter
});

const uploadProfilePic = multer({
  storage: getStorage(profilesDir),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: imageFileFilter
});

const uploadDocument = multer({
  storage: getStorage(documentsDir),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: documentFileFilter
});

// Export all needed items
export { 
  uploadImage, 
  uploadProfilePic, 
  uploadDocument,
  profilesDir, 
  productsDir, 
  documentsDir 
};

// For backward compatibility
// export default uploadImage;