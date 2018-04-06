export class Subscription {
  id: string;
  timestamp: string;
  from: string;
  months: number;
  message: string;
  sub_plan: string;
  isTest: boolean;

  constructor(subscription: any) {
    this.id = subscription.id;
    this.timestamp = subscription.timestamp;
    this.from = subscription.from;
    this.months = subscription.months;
    this.sub_plan = subscription.sub_plan;
    this.isTest = subscription.isTest;
  }
}
