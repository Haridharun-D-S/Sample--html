import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdFormbuilderComponent } from './nd-formbuilder.component';

describe('NdFormbuilderComponent', () => {
  let component: NdFormbuilderComponent;
  let fixture: ComponentFixture<NdFormbuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdFormbuilderComponent]
    });
    fixture = TestBed.createComponent(NdFormbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
