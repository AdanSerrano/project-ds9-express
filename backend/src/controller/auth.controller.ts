class AuthController {
    private authService: any;
    private verificationService: any;

    constructor(authService: any, verificationService: any) {
        this.authService = authService;
        this.verificationService = verificationService;
    }

    async login(email: string, password: string): Promise<string> {
        if (!email.trim() || !password.trim()) {
            throw new Error('Email and password are required.');
        }

        const existingUser = await this.authService.findUnique(email);

        if (!existingUser) {
            throw new Error('User not found.');
        }

        const isValid = await this.verificationService.comparePasswords(password, existingUser.password);

        if (!isValid) {
            throw new Error('Invalid email or password.');
        }

        const accessToken = this.verificationService.generateToken({
            userInfo: {
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser.id,
            },
        });

        return accessToken;
    }

    async register(name: string, email: string, password: string) {
        if (!name.trim() || !email.trim() || !password.trim()) {
            throw new Error('Name, email, and password are required.');
        }

        const existingUser = await this.authService.findUnique(email);

        if (existingUser) {
            throw new Error('User already exists.');
        }

        const hashedPassword = await this.verificationService.hashPassword(password);

        await this.authService.create({
            name,
            email,
            password: hashedPassword,
        });

        return;
    }
}

export default AuthController;
