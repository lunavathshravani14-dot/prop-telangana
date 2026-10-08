import { NextRequest } from 'next/server';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { uploadFile } from '@/lib/storage';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AGENT'])) {
      return apiError('Unauthorized to upload media', 'FORBIDDEN', 403);
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as any) || 'properties';

    if (!file) {
      return apiError('No file provided for upload', 'VALIDATION_ERROR', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadFile(buffer, file.name, folder);

    return apiSuccess(uploadResult, undefined, 201);
  } catch (error: any) {
    console.error('File upload error:', error);
    return apiError(error.message || 'File upload failed', 'UPLOAD_ERROR', 500);
  }
}
