import { PrismaClient } from '@prisma/client';

class ClientModel {
    private database: PrismaClient;

    constructor(databaseInstance: PrismaClient) {
        this.database = databaseInstance;
    }

    async findMany() {
        return await this.database.client.findMany();
    }

    async findUnique(userid: string) {
        return await this.database.client.findUnique({
            where: {
                id: userid,
            },
        });
    }
}

export default ClientModel;
