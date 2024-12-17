import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadProductAdminComponent } from './read-product-admin.component';

describe('ReadProductAdminComponent', () => {
  let component: ReadProductAdminComponent;
  let fixture: ComponentFixture<ReadProductAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadProductAdminComponent]
    });
    fixture = TestBed.createComponent(ReadProductAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
