import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberEventCellComponent } from './subscriber-event-cell.component';

describe('SubscriberEventCellComponent', () => {
  let component: SubscriberEventCellComponent;
  let fixture: ComponentFixture<SubscriberEventCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberEventCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberEventCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
