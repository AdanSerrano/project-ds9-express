import { PrismaClient } from '@prisma/client';

class AuthModel {
    private database: PrismaClient;

    constructor(databaseInstance: PrismaClient) {
        this.database = databaseInstance;
    }

    async findUnique(email: string) {
        return await this.database.user.findUnique({
            where: {
                email: email,
            },
        });
    }
}

export default AuthModel;
