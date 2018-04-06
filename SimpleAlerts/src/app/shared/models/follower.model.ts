export class Follower {
  id: string;
  timestamp: string;
  from: string;
  isTest: boolean;

  constructor(follower: any) {
    this.id = follower.id;
    this.timestamp = follower.timestamp;
    this.from = follower.from;
    this.isTest = follower.isTest;
  }
}
