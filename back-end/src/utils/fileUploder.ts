import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../app/config';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name || process.env.CLOUDINARY_CLOUD_NAME || 'dwqdndar8',
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only images and PDF files are allowed'));
  },
});

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  mimetype: string,
  folder = 'chat-app/messages',
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype === 'application/pdf' ? 'raw' : 'auto';
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

export const fileUploader = {
  upload,
};
