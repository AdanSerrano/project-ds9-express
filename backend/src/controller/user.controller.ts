class UserController {
    private userService: any;
    private verificationService: any;

    constructor(userService: any, verificationService: any) {
        this.userService = userService;
        this.verificationService = verificationService;
    }

    async register(name: string, email: string, password: string, role: string) {
        if (!name.trim() || !email.trim() || !password.trim() || !role.trim() ) {
            throw new Error('Name, email, and password are required.');
        }

        const existingUser = await this.userService.findUnique(email);

        if (existingUser) {
            return;
        }

        const hashedPassword = await this.verificationService.hashPassword(password);
        console.log({ existingUser });

        const user = await this.userService.createUser({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return user;        
    }
}

export default UserController;
