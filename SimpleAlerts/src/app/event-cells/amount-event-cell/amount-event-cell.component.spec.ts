import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountEventCellComponent } from './amount-event-cell.component';

describe('AmountEventCellComponent', () => {
  let component: AmountEventCellComponent;
  let fixture: ComponentFixture<AmountEventCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountEventCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountEventCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
