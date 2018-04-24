import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-amount-event-cell',
  templateUrl: './amount-event-cell.component.html',
  styleUrls: ['../event-cell-common.css', './amount-event-cell.component.css']
})
export class AmountEventCellComponent implements OnInit {
  @Input() id: string;
  @Input() type: string;
  @Input() duration: string;
  @Input() from: string;
  @Input() message: string;
  @Input() amount: number;
  @Input() stringAmount: string;
  @Input() currency: string;
  @Input() isTest: boolean;
  amountType: string;
  timeIconPath = '../../../assets/event-list/common/cell-timestamp.png';
  donationIconPath = '../../../assets/event-list/icons/donations-enabled.png';
  cheerIconPath = '../../../assets/event-list/icons/cheers-enabled.png';
  constructor() {}

  ngOnInit() {
    if (this.type === 'new_donation') {
      this.amountType = 'Donation';
    } else {
      this.amountType = 'Cheer';
    }
  }
}
