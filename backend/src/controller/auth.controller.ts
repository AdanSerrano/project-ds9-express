import { Role } from "@prisma/client";

type LoginResult = {
  accessToken: string;
  userInfo: {
    name: string;
    email: string;
    id: string;
    role: Role;
  };
};

class AuthController {
  private authService: any;
  private verificationService: any;

  constructor(authService: any, verificationService: any) {
    this.authService = authService;
    this.verificationService = verificationService;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    if (!email.trim() || !password.trim()) {
      throw new Error("Email and password are required.");
    }

    const existingUser = await this.authService.findUnique(email);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const isValid = await this.verificationService.comparePasswords(
      password,
      existingUser.password
    );

    if (!isValid) {
      throw new Error("Invalid email or password.");
    }

    const accessToken = this.verificationService.generateToken({
      userInfo: {
        name: existingUser.name,
        email: existingUser.email,
        id: existingUser.id,
        role: existingUser.role
      },
    });
    const userInfo = {
      name: existingUser.name,
      email: existingUser.email,
      id: existingUser.id,
      role: existingUser.role
    };

    return {
      accessToken,
      userInfo: userInfo,
    }
  }
}

export default AuthController;
