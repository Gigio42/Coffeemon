import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface LogActionParams {
  action: string;
  userId?: number | null;
  targetId?: string | number | null;
  targetType?: string | null;
  metadata?: Record<string, any> | null;
  ipAddress?: string | null;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(params: LogActionParams): Promise<void> {
    const entry = this.auditLogRepository.create({
      action: params.action,
      userId: params.userId ?? null,
      targetId: params.targetId != null ? String(params.targetId) : null,
      targetType: params.targetType ?? null,
      metadata: params.metadata ?? null,
      ipAddress: params.ipAddress ?? null,
    });
    await this.auditLogRepository.save(entry);
  }

  async findAll(page = 1, limit = 50, action?: string, userId?: number) {
    const qb = this.auditLogRepository.createQueryBuilder('log');

    if (action) {
      qb.andWhere('log.action = :action', { action });
    }
    if (userId != null) {
      qb.andWhere('log.userId = :userId', { userId });
    }

    const [logs, total] = await qb
      .orderBy('log.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { logs, total, page, limit };
  }
}
