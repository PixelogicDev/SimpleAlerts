import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-follower-event-cell',
  templateUrl: './follower-event-cell.component.html',
  styleUrls: ['./follower-event-cell.component.css']
})
export class FollowerEventCellComponent implements OnInit {
  @Input() id: string;
  @Input() type: string;
  @Input() timestamp: string;
  @Input() from: string;
  @Input() isTest: boolean;

  constructor() {}

  ngOnInit() {}
}
