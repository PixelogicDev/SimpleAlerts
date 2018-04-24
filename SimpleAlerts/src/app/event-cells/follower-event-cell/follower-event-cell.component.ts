import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-follower-event-cell',
  templateUrl: './follower-event-cell.component.html',
  styleUrls: ['../event-cell-common.css']
})
export class FollowerEventCellComponent implements OnInit {
  @Input() id: string;
  @Input() type: string;
  @Input() duration: string;
  @Input() from: string;
  @Input() isTest: boolean;
  timeIconPath = '../../../assets/event-list/common/cell-timestamp.png';
  followIconPath = '../../../assets/event-list/icons/follows-enabled.png';
  constructor() {}

  ngOnInit() {}
}
