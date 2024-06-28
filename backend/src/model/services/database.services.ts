import { PrismaClient } from '@prisma/client';

class DatabaseService {
    private static instance: PrismaClient;

    static getInstance(): PrismaClient {
        if (!this.instance) {
            this.instance = new PrismaClient();
        }
        return this.instance;
    }
}

export default DatabaseService;
