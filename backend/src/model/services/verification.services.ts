require("dotenv").config();
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

class VerificationService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default_secret"; // Default value for secret
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword;
  }

  async comparePasswords(
    incomingPassword: string,
    encryptedPassword: string
  ): Promise<boolean> {
    return bcryptjs.compare(incomingPassword, encryptedPassword);
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: 60 * 60 * 24,
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
