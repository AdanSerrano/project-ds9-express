class UserController {
  private userService: any;
  private verificationService: any;

  constructor(userService: any, verificationService: any) {
    this.userService = userService;
    this.verificationService = verificationService;
  }

  async register(name: string, email: string, password: string, role: string) {
    if (!name.trim() || !email.trim() || !password.trim() || !role.trim()) {
      throw new Error("Name, email, and password are required.");
    }

    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      return;
    }

    const hashedPassword = await this.verificationService.hashPassword(
      password
    );

    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  async updateUser(id: string, email: string, name: string, role: string, password: string) {
    if (!email.trim() || !name.trim() || !role.trim() || !password.trim()) {
      throw new Error("Email, name, password, and role are required.");
    }

    const passwordNew = await this.verificationService.hashPassword(
      password
    );

    return await this.userService.updateUser(id, { email, name, role, passwordNew });
  }

  async changePassword(
    email: string,
    passwordOld: string,
    newPassword: string
  ) {
    if (!email.trim() || !passwordOld.trim() || !newPassword.trim()) {
      throw new Error("Email, old password, and new password are required.");
    }

    const user = await this.userService.findUnique(email);

    if (!user) {
      return;
    }

    const isPasswordValid = await this.verificationService.comparePassword(
      passwordOld,
      user.password
    );

    if (!isPasswordValid) {
      return;
    }

    const hashedPassword = await this.verificationService.hashPassword(
      newPassword
    );

    return await this.userService.changePassword(email, hashedPassword);
  }

  async deleteUser(email: string) {
    if (!email.trim()) {
      throw new Error("Email is required.");
    }

    return await this.userService.deleteUser(email);
  }
}

export default UserController;
