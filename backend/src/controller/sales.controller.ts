class SalesController {
  private salesService: any;

  constructor(salesService: any) {
    this.salesService = salesService;
  }


  async createSales(inputData: any) {
    return await this.salesService.createSales(inputData);
  }

  async findAllSales() {
    return await this.salesService.findAllSales();
  }

  async getOneSales(id: string) {
    return await this.salesService.findUniqueSales(id);
  }
}

export default SalesController;
