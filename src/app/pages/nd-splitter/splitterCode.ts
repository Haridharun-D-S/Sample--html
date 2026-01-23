export const SplitterHtml = `<div style="width: 100%; height: 400px; border: 1px solid #ccc;">
  <as-split 
  [direction]="direction" 
  [gutterSize]="gutterSize" 
  [disabled]="restrictMove" 
  (dragStart)="dragStart.emit()"
  (dragEnd)="onDragEnd()"
  >
    <as-split-area [size]="leftSize" [minSize]="minLeftPx">
      <ng-content select="[left]"></ng-content>
    </as-split-area>

    <as-split-area [size]="rightSize" [minSize]="minRightPx">
      <ng-content select="[right]"></ng-content>
    </as-split-area>
  </as-split>
</div>`;
export const SplitterCss = `
.panel-content {
  padding: 10px;
  height: 100%; /* Ensure content fills the area */
  overflow: auto; /* Add scrollbars if content overflows */
}

/* Optional: Add a visual indicator for the drag handle */
.as-split-gutter {
  background-color: #eee;
  cursor: col-resize; /* Cursor for horizontal split */
}`;
export const SplitterTs = `
export class SplitterComponent {
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() leftSize = 30;
  @Input() rightSize = 70;
  @Input() gutterSize = 6;
  @Input() restrictMove = false; // lock movement if needed

  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();

  @Input() minLeftPx = 50; // Left panel cannot shrink below 50px
  @Input() minRightPx = 50; // Right panel cannot shrink below 50px

  containerPx = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.querySelector(
      'as-split'
    ) as HTMLElement;
    this.containerPx =
      this.direction === 'horizontal'
        ? container.clientWidth
        : container.clientHeight;
  }

  onDragEnd() {
    const leftPx = (this.leftSize / 100) * this.containerPx;
    const rightPx = (this.rightSize / 100) * this.containerPx;

    // Clamp left panel
    if (leftPx < this.minLeftPx) {
      this.leftSize = (this.minLeftPx / this.containerPx) * 100;
      this.rightSize = 100 - this.leftSize;
    }

    // Clamp right panel
    if (rightPx < this.minRightPx) {
      this.rightSize = (this.minRightPx / this.containerPx) * 100;
      this.leftSize = 100 - this.rightSize;
    }

    this.dragEnd.emit();
  }
}`;
