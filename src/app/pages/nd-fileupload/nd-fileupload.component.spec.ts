import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdFileuploadComponent } from './nd-fileupload.component';

describe('NdFileuploadComponent', () => {
  let component: NdFileuploadComponent;
  let fixture: ComponentFixture<NdFileuploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdFileuploadComponent]
    });
    fixture = TestBed.createComponent(NdFileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
