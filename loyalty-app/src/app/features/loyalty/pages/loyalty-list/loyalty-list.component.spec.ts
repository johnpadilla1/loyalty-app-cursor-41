import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyListComponent } from './loyalty-list.component';

describe('LoyaltyListComponent', () => {
  let component: LoyaltyListComponent;
  let fixture: ComponentFixture<LoyaltyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
