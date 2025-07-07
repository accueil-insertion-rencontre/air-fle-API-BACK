import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Session } from '@prisma/client';

// Type pour une session avec ses relations
type SessionWithRelations = Prisma.SessionGetPayload<{
  include: {
    groups: true;
  };
}>;

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }): Promise<{
    data: SessionWithRelations[];
    meta: { total: number; skip: number; take: number };
  }> {
    const { skip, take, where, orderBy } = params || {};

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          groups: true,
        },
      }),
      this.prisma.session.count({ where }),
    ]);

    return {
      data: sessions,
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async findOne(id: string): Promise<SessionWithRelations | null> {
    return this.prisma.session.findUnique({
      where: { session_uuid: id },
      include: {
        groups: true,
      },
    });
  }

  async create(createSessionData: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({
      data: createSessionData,
    });
  }

  async update(
    id: string,
    updateSessionData: Prisma.SessionUpdateInput,
  ): Promise<Session> {
    return this.prisma.session.update({
      where: { session_uuid: id },
      data: updateSessionData,
    });
  }

  async delete(id: string): Promise<Session> {
    return this.prisma.session.delete({
      where: { session_uuid: id },
    });
  }
}
