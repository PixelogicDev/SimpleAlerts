import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subscriber-event-cell',
  templateUrl: './subscriber-event-cell.component.html',
  styleUrls: [
    '../event-cell-common.css',
    './subscriber-event-cell.component.css'
  ]
})
export class SubscriberEventCellComponent implements OnInit {
  @Input() id: string;
  @Input() type: string;
  @Input() duration: string;
  @Input() from: string;
  @Input() months: number;
  @Input() message: string;
  @Input() subplan: string;
  @Input() isTest: boolean;
  @Input() didRead: boolean;
  @Input() parent: any;

  timeIconPath = '../../../assets/event-list/common/cell-timestamp.png';
  subscriberIconPath = '../../../assets/event-list/icons/subscriptions-enabled.png';
  constructor() {}

  ngOnInit() {}

  removeEvent() {
    console.log('Removing event...');
    this.parent.removeEvent(this.id);
  }
}
