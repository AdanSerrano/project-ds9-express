class SalesController {
  private salesService: any;
  private verificationService: any;

  constructor(salesService: any, verificationService: any) {
    this.salesService = salesService;
  }


  async createSales(clientId: any, saleDate: any, details: any) {
    return await this.salesService.createSales(clientId, saleDate, details);
  }

  async findAllSales() {
    return await this.salesService.findAllSales();
  }

  async getOneSales(id: string) {
    return await this.salesService.findUniqueSales(id);
  }
}

export default SalesController;
