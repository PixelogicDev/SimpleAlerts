import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerEventCellComponent } from './follower-event-cell.component';

describe('FollowerEventCellComponent', () => {
  let component: FollowerEventCellComponent;
  let fixture: ComponentFixture<FollowerEventCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowerEventCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowerEventCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
