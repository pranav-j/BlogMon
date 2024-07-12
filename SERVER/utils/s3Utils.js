const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
  },
  region: 'ap-south-1' // e.g., 'us-west-2'
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
};

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

const generateUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const uniqueSuffix = crypto.randomBytes(8).toString('hex');
  return `${baseName}-${uniqueSuffix}${ext}`;
};

const uploadFileToS3 = async (file, folderName) => {
  const uniqueFileName = generateUniqueFileName(file.originalname);
  const params = {
    Bucket: 'blog-images-kidiloski',
    Key: `${folderName}/${uniqueFileName}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const uploadImgToS3Command = new PutObjectCommand(params);
  await s3.send(uploadImgToS3Command);

  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
};

module.exports = {
  upload,
  uploadFileToS3
};
