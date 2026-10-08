import prisma from './prisma';

export interface AuditLogParams {
  userId?: string;
  userEmail?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'FEATURE' | 'ARCHIVE' | 'ASSIGN' | 'STATUS_CHANGE';
  entity: 'PROPERTY' | 'PROJECT' | 'DEVELOPER' | 'LEAD' | 'USER' | 'BLOG' | 'SETTING';
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    return null;
  }
}
