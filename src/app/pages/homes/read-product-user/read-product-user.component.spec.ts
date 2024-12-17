import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadProductUserComponent } from './read-product-user.component';

describe('ReadProductUserComponent', () => {
  let component: ReadProductUserComponent;
  let fixture: ComponentFixture<ReadProductUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadProductUserComponent]
    });
    fixture = TestBed.createComponent(ReadProductUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
