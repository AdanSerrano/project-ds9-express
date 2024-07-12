class PaymentController {
  private paymentService: any;
  private verificationService: any;

  constructor(paymentService: any, verificationService: any) {
    this.paymentService = paymentService;
    this.verificationService = verificationService;
  }

  async createPayment(
    clientId: string,
    saleId: string,
    paymentDate: Date,
    amount: number
  ) {


    return this.paymentService.createPayment(
      clientId,
      saleId,
      paymentDate,
      amount
    );
  }

  async findAllPayments() {
    return this.paymentService.findAllPayments();
  }

  async getOnePayment(id: string) {
    return this.paymentService.getOnePayment(id);
  }
}

export default PaymentController;