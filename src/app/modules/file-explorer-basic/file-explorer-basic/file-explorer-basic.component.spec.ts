import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerBasicComponent } from './file-explorer-basic.component';

describe('FileExplorerBasicComponent', () => {
  let component: FileExplorerBasicComponent;
  let fixture: ComponentFixture<FileExplorerBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileExplorerBasicComponent]
    });
    fixture = TestBed.createComponent(FileExplorerBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
