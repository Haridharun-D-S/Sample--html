import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-splitter',
  templateUrl: './splitter.component.html',
  styleUrls: ['./splitter.component.scss'],
})
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
}
