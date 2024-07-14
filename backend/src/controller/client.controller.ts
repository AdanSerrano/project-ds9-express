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
      throw new Error("User ID is required");
    }
    const client = await this.clientService.findUnique(userid);

    if (!client) {
      throw new Error("Client not found");
    }

    return client;
  }

  async createClient(inputData: any) {
    // Validate inputData
    if (
      !inputData.name ||
      !inputData.lastname ||
      !inputData.phoneNumber ||
      !inputData.ident ||
      !inputData.email
    ) {
      throw new Error(
        "Name, Lastname, Phone Number, and Identification are required"
      );
    }

    return this.clientService.createClient(inputData);
  }

  async updateClient(userid: string, inputData: any) {
    // Validate userid
    if (!userid) {
      throw new Error("User ID is required");
    }

    // Validate inputData
    if (!inputData.name || !inputData.lastname || !inputData.phoneNumber) {
      throw new Error("Name, Lastname, and Phone Number are required");
    }

    return this.clientService.updateClient(userid, inputData);
  }

  async deleteClient(userid: string) {
    // Validate userid
    if (!userid) {
      throw new Error("User ID is required");
    }

    return this.clientService.deleteClient(userid);
  }
}

export default ClientController;
