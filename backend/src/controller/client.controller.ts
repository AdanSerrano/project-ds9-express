class ClientController {
    private clientService: any;

    constructor(clientService: any) {
        this.clientService = clientService;
    }

    async getAll() {
        return this.clientService.findMany();
    }

    async getOne(userid: string) {
        // Validate userid
        if (!userid) {
            throw new Error('User ID is required');
        }
        const client = await this.clientService.findUnique(userid);

        if (!client) {
            throw new Error('Client not found');
        }

        return client;
    }
}

export default ClientController;
