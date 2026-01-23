import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMainDashboardComponent } from './file-main-dashboard.component';

describe('FileMainDashboardComponent', () => {
  let component: FileMainDashboardComponent;
  let fixture: ComponentFixture<FileMainDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileMainDashboardComponent]
    });
    fixture = TestBed.createComponent(FileMainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
