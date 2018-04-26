import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEventListModalComponent } from './remove-event-list-modal.component';

describe('RemoveEventListModalComponent', () => {
  let component: RemoveEventListModalComponent;
  let fixture: ComponentFixture<RemoveEventListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveEventListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveEventListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
