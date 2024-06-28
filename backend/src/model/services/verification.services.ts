import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

class VerificationService {
    private secret: string;

    constructor() {
        this.secret = 'default_secret'; // Default value for secret
    }

    async comparePasswords(incomingPassword: string, encryptedPassword: string): Promise<boolean> {
        return bcryptjs.compare(incomingPassword, encryptedPassword);
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, {
            expiresIn: 60 * 60 * 24, // 24 hours
        });
    }

    verifyToken(token: string): object {
        try {
            return jwt.verify(token, this.secret) as object;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

export default VerificationService;
