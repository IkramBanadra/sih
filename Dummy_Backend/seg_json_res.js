const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|webp/i;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'), false);
    }
  },
});

app.options('*', cors());

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file format' });
  }
  
  console.log('Image uploaded:', req.file);
  
  global.lastUploadedFile = req.file.filename;
  
  res.status(200).json({
    message: 'Image uploaded successfully',
    filename: req.file.filename
  });
});

app.get('/getRes', (req, res) => {
  if (!global.lastUploadedFile) {
    return res.status(400).json({ error: 'No recent file upload found' });
  }

  const response = {
    uploaded_file: global.lastUploadedFile,
    intensity_results: {},
    type_results: {
      "Plastic film": 96.34,
      "Single-use carrier bag": 100,
      "Clear plastic bottle": 75,
      "Unlabeled litter": 50,
    },
    litter_results: {},
    frequency: {
      "Plastic film": 41,
      "Clear plastic bottle": 4,
      "Single-use carrier bag": 1,
      "Unlabeled litter": 1,
    },
    garbage_percentage: "0.0",
    processed_video_URL: `http://127.0.0.1:${PORT}/uploads/${global.lastUploadedFile}`,
  };
  
  res.status(200).json(response);
});

app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error', details: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});