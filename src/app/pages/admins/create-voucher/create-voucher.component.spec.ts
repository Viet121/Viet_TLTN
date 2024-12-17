import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVoucherComponent } from './create-voucher.component';

describe('CreateVoucherComponent', () => {
  let component: CreateVoucherComponent;
  let fixture: ComponentFixture<CreateVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateVoucherComponent]
    });
    fixture = TestBed.createComponent(CreateVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
