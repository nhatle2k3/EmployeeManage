import { PrismaService } from '../prisma/prisma.service';
export declare class NetworksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        cidr: string;
        location: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        cidr: string;
        location: string;
    }>;
    create(data: {
        name: string;
        cidr: string;
        location: string;
        description?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        cidr: string;
        location: string;
    }>;
    update(id: string, data: {
        name?: string;
        cidr?: string;
        location?: string;
        description?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        cidr: string;
        location: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        cidr: string;
        location: string;
    }>;
}
