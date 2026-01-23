import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerHighlightComponent } from './file-explorer-highlight.component';

describe('FileExplorerHighlightComponent', () => {
  let component: FileExplorerHighlightComponent;
  let fixture: ComponentFixture<FileExplorerHighlightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileExplorerHighlightComponent]
    });
    fixture = TestBed.createComponent(FileExplorerHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
