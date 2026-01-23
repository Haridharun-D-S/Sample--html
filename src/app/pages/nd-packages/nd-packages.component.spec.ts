import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdPackagesComponent } from './nd-packages.component';

describe('NdPackagesComponent', () => {
  let component: NdPackagesComponent;
  let fixture: ComponentFixture<NdPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdPackagesComponent]
    });
    fixture = TestBed.createComponent(NdPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
