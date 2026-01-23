import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdHeaderComponent } from './nd-header.component';

describe('NdHeaderComponent', () => {
  let component: NdHeaderComponent;
  let fixture: ComponentFixture<NdHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdHeaderComponent]
    });
    fixture = TestBed.createComponent(NdHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
