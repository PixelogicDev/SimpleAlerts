export class Donation {
  id: string;
  timestamp: string;
  from: string;
  amount: number;
  stringAmount: string;
  currency: string;
  message: string;
  isTest: boolean;

  constructor(donation: any) {
    this.id = donation.id;
    this.timestamp = donation.timestamp;
    this.from = donation.from;
    this.amount = donation.amount;
    this.stringAmount = donation.stringAmount;
    this.currency = donation.currency;
    this.message = donation.message;
    this.isTest = donation.isTest;
  }
}
