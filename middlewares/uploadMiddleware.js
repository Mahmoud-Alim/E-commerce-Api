import multer from "multer";
import path from "path";
import fs from "fs/promises";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const UPLOAD_DIR = "public/uploads";

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};
ensureUploadDir();

const sanitizeFilename = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const fileExtension = FILE_TYPE_MAP[file.mimetype];
    const baseName = path.parse(file.originalname).name;
    const filename = `${Date.now()}-${sanitizeFilename(baseName)}.${fileExtension}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const isValid = !!FILE_TYPE_MAP[file.mimetype];
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image type. Only PNG, JPG, and JPEG are allowed."), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

export const deleteFiles = async (files) => {
  if (!files || files.length === 0) return;
  const deletePromises = files.map((file) => 
    fs.unlink(file.path).catch((err) => console.error(`Failed to delete file: ${file.path}`, err))
  );
  await Promise.all(deletePromises);
};
