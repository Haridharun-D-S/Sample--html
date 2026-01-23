import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdToasterComponent } from './nd-toaster.component';

describe('NdToasterComponent', () => {
  let component: NdToasterComponent;
  let fixture: ComponentFixture<NdToasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdToasterComponent]
    });
    fixture = TestBed.createComponent(NdToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
