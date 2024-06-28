class AuthController {
    private service: any;
    private verification: any;

    constructor(authService: any, verificationService: any) {
        this.service = authService;
        this.verification = verificationService;
    }

    async login(email: string, password: string) {
        if (!email.trim() || !password.trim()) {
            throw new Error('Email and password are required.');
        }

        const existingUser = await this.service.findUnique(email);

        if (!existingUser) {
            throw new Error('User ID is required');
        }

        const isValid = await this.verification.comparePasswords(
            password,
            existingUser.password
        );

        if (!isValid) {
            throw new Error('usuario o contraseña incorrecta ');
        }

        const accessToken = this.verification.generateToken({
            userInfo: {
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser.id,
            },
        });

        return accessToken;
    }

    async register() { }
}

module.exports = AuthController;