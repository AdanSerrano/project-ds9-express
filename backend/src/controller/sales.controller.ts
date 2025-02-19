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

  async deleteSales(id: string) {
    return await this.salesService.deleteSales(id);
  }

  async updateSales(id: string, data: any) {
    const { clientId, saleDate, details } = data;
    return await this.salesService.updateSales(id, clientId, saleDate, details);
  }

  async deleteSalesDetails(id: string) {
    return await this.salesService.deleteSalesDetails(id);
  }

  async updateSalesDetails(id: string, data: any) {
    return await this.salesService.updateSalesDetails(id, data);
  }

  async createSalesDetails(saleId: any, details: any) {
    return await this.salesService.createSalesDetails(saleId, details);
  }

  async findUniqueSalesDetails(id: string) {
    return await this.salesService.findUniqueSalesDetails(id);
  }

  async findSalesByPayment(statusPayment: boolean) {
    return await this.salesService.findSalesByPayment(statusPayment);
  }
}

export default SalesController;