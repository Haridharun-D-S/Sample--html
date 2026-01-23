import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdDropdownComponent } from './nd-dropdown.component';

describe('NdDropdownComponent', () => {
  let component: NdDropdownComponent;
  let fixture: ComponentFixture<NdDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdDropdownComponent]
    });
    fixture = TestBed.createComponent(NdDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
