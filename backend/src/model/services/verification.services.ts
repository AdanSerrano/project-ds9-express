require("dotenv").config();
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

class VerificationService {
  private secret: string;

  constructor() {
    this.secret = "default_secret"; // Default value for secret
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
    const SECRET_KEY: any = process.env.SECRET_KEY;

    return jwt.sign({ payload }, SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    });
  }

  verifyToken(token: string): boolean {
    try {
      const SECRET_KEY: any = process.env.SECRET_KEY;

      const result = jwt.verify(token, SECRET_KEY, (err: any) => {
        if (err) {
          return false;
        }
        return true;
      });
      return false;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default VerificationService;
