import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVoucherComponent } from './update-voucher.component';

describe('UpdateVoucherComponent', () => {
  let component: UpdateVoucherComponent;
  let fixture: ComponentFixture<UpdateVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateVoucherComponent]
    });
    fixture = TestBed.createComponent(UpdateVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
