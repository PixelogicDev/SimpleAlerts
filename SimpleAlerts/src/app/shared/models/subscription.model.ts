export class Subscription {
  id: string;
  type: string;
  timestamp: string;
  from: string;
  months: number;
  message: string;
  sub_plan: string;
  isTest: boolean;

  constructor(subscription: any) {
    this.id = subscription.id;
    this.type = 'new_subscription';
    this.timestamp = subscription.timestamp;
    this.from = subscription.from;
    this.message = subscription.message;
    this.months = subscription.months;
    this.sub_plan = subscription.sub_plan;
    this.isTest = subscription.isTest;
  }
}
