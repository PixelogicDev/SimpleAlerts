export class Event {
  id: string;
  timestamp: string;
  from: string;
  message: string;
  amount: string;
  months: string;
  sub_plan: string;

  constructor(event: any) {
    this.id = event.id;
    this.timestamp = event.timestamp;
    this.from = event.from;

    if (event.message) {
      this.message = event.message;
    }

    if (event.amount) {
      this.amount = event.amount;
    }

    if (event.months) {
      this.months = event.months;
    }

    if (event.sub_plan) {
      this.sub_plan = event.sub_plan;
    }
  }
}
