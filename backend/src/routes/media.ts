import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      // Videos
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/webm',
      // 3D Models
      'model/gltf+json',
      'model/gltf-binary',
      'application/octet-stream', // for .glb files
      'model/obj',
      'model/fbx'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to determine file type
const getFileType = (mimetype: string): 'image' | 'video' | '3d' => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('model/') || mimetype === 'application/octet-stream') return '3d';
  return 'image'; // default
};

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer: Buffer, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// POST /api/media/upload - Upload single file
router.post('/upload', 
  upload.single('file'),
  [
    body('alt').optional().isString().withMessage('Alt text must be a string'),
    body('folder').optional().isString().withMessage('Folder must be a string')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { alt, folder = 'monopharma' } = req.body;
      const fileType = getFileType(req.file.mimetype);
      
      // Prepare Cloudinary options
      const cloudinaryOptions: any = {
        folder: `${folder}/${fileType}s`,
        public_id: `${Date.now()}_${req.file.originalname.split('.')[0]}`,
        resource_type: 'auto'
      };

      // Additional options for different file types
      if (fileType === 'image') {
        cloudinaryOptions.transformation = [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ];
      } else if (fileType === 'video') {
        cloudinaryOptions.resource_type = 'video';
        cloudinaryOptions.quality = 'auto:good';
      } else if (fileType === '3d') {
        cloudinaryOptions.resource_type = 'raw';
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, cloudinaryOptions);

      const mediaFile = {
        type: fileType,
        url: result.secure_url,
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        alt: alt || '',
        cloudinaryId: result.public_id,
        dimensions: result.width && result.height ? {
          width: result.width,
          height: result.height
        } : null,
        duration: result.duration || null
      };

      res.status(201).json({
        success: true,
        data: mediaFile,
        message: 'File uploaded successfully'
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload file'
      });
    }
  }
);

// POST /api/media/upload-multiple - Upload multiple files
router.post('/upload-multiple',
  upload.array('files', 10), // Max 10 files
  [
    body('alt').optional().isArray().withMessage('Alt texts must be an array'),
    body('folder').optional().isString().withMessage('Folder must be a string')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const { alt = [], folder = 'monopharma' } = req.body;
      const uploadPromises = files.map(async (file, index) => {
        const fileType = getFileType(file.mimetype);
        
        const cloudinaryOptions: any = {
          folder: `${folder}/${fileType}s`,
          public_id: `${Date.now()}_${index}_${file.originalname.split('.')[0]}`,
          resource_type: 'auto'
        };

        if (fileType === 'image') {
          cloudinaryOptions.transformation = [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ];
        } else if (fileType === 'video') {
          cloudinaryOptions.resource_type = 'video';
        } else if (fileType === '3d') {
          cloudinaryOptions.resource_type = 'raw';
        }

        const result = await uploadToCloudinary(file.buffer, cloudinaryOptions);

        return {
          type: fileType,
          url: result.secure_url,
          filename: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          alt: alt[index] || '',
          cloudinaryId: result.public_id,
          dimensions: result.width && result.height ? {
            width: result.width,
            height: result.height
          } : null,
          duration: result.duration || null
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      res.status(201).json({
        success: true,
        data: uploadedFiles,
        message: `${uploadedFiles.length} files uploaded successfully`
      });

    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload files'
      });
    }
  }
);

// DELETE /api/media/:cloudinaryId - Delete file from Cloudinary
router.delete('/:cloudinaryId', [
  param('cloudinaryId').notEmpty().withMessage('Cloudinary ID is required')
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { cloudinaryId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found or already deleted'
      });
    }

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

// GET /api/media/info/:cloudinaryId - Get file information
router.get('/info/:cloudinaryId', [
  param('cloudinaryId').notEmpty().withMessage('Cloudinary ID is required')
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { cloudinaryId } = req.params;

    // Get resource info from Cloudinary
    const result = await cloudinary.api.resource(cloudinaryId);

    res.json({
      success: true,
      data: {
        cloudinaryId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        dimensions: result.width && result.height ? {
          width: result.width,
          height: result.height
        } : null,
        createdAt: result.created_at,
        resourceType: result.resource_type
      }
    });

  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

// GET /api/media/transform/:cloudinaryId - Get transformed image URL
router.get('/transform/:cloudinaryId', [
  param('cloudinaryId').notEmpty().withMessage('Cloudinary ID is required'),
  body('width').optional().isInt({ min: 1, max: 4000 }),
  body('height').optional().isInt({ min: 1, max: 4000 }),
  body('quality').optional().isIn(['auto', 'auto:good', 'auto:best', 'auto:low']),
  body('format').optional().isIn(['auto', 'jpg', 'png', 'webp'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { cloudinaryId } = req.params;
    const { width, height, quality = 'auto:good', format = 'auto' } = req.query;

    const transformations: any[] = [];

    if (width || height) {
      transformations.push({
        width: width ? parseInt(width as string) : undefined,
        height: height ? parseInt(height as string) : undefined,
        crop: 'fit'
      });
    }

    transformations.push({
      quality,
      fetch_format: format
    });

    const transformedUrl = cloudinary.url(cloudinaryId, {
      transformation: transformations
    });

    res.json({
      success: true,
      data: {
        originalId: cloudinaryId,
        transformedUrl,
        transformations
      }
    });

  } catch (error) {
    console.error('Error generating transformed URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate transformed URL'
    });
  }
});

export default router;