import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdModalComponent } from './nd-modal.component';

describe('NdModalComponent', () => {
  let component: NdModalComponent;
  let fixture: ComponentFixture<NdModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdModalComponent]
    });
    fixture = TestBed.createComponent(NdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
