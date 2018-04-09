export class Cheer {
  id: string;
  type: string;
  timestamp: string;
  from: string;
  amount: number;
  stringAmount: string;
  message: string;
  isTest: boolean;

  constructor(cheer: any) {
    this.id = cheer.id;
    this.type = 'new_cheer';
    this.timestamp = cheer.timestamp;
    this.from = cheer.from;
    this.amount = cheer.amount;
    this.stringAmount = cheer.stringAmount;
    this.message = cheer.message;
    this.isTest = cheer.isTest;
  }
}
