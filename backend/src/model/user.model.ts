import { PrismaClient } from '@prisma/client';
import * as bcryptjs from "bcryptjs";

class UserModel {
    private database: PrismaClient;

    constructor(databaseInstance: PrismaClient) {
        this.database = databaseInstance;
    }

    async createUser(inputData: any): Promise<any> {
        const { name, email, password, role } = inputData;
        return await this.database.user.create({
            data: {
                name,
                email,
                password,
            },
        });
    }

    async findUnique(email: string) {
        return await this.database.user.findUnique({
            where: {
                email: email,
            },
        });
    }

}

export default UserModel;