import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdLoaderComponent } from './nd-loader.component';

describe('NdLoaderComponent', () => {
  let component: NdLoaderComponent;
  let fixture: ComponentFixture<NdLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdLoaderComponent]
    });
    fixture = TestBed.createComponent(NdLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
