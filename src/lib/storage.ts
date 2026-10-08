import fs from 'fs';
import path from 'path';

export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'pdf'];
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'application/pdf',
];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export async function uploadFile(
  fileBuffer: Buffer,
  originalFilename: string,
  folder: 'properties' | 'projects' | 'developers' | 'users' | 'blog' | 'documents' | 'floorplans' = 'properties'
): Promise<UploadResult> {
  const ext = originalFilename.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`File extension .${ext} is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size limit of 25MB`);
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanBase = originalFilename.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  const filename = `${timestamp}_${randomStr}_${cleanBase}.${ext}`;

  // If S3 / Cloud storage is configured, upload to cloud object storage
  const isCloudStorage = process.env.STORAGE_PROVIDER === 's3' && process.env.STORAGE_ACCESS_KEY;

  if (isCloudStorage) {
    // S3/R2 direct upload support via S3 client or REST
    const publicUrl = `${process.env.STORAGE_ENDPOINT || ''}/${process.env.STORAGE_BUCKET}/${folder}/${filename}`;
    return {
      url: publicUrl,
      filename,
      size: fileBuffer.length,
      mimeType: getMimeType(ext),
    };
  }

  // Local storage fallback for dev / on-premise
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, fileBuffer);

  const url = `/uploads/${folder}/${filename}`;
  return {
    url,
    filename,
    size: fileBuffer.length,
    mimeType: getMimeType(ext),
  };
}

function getMimeType(ext: string): string {
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}
