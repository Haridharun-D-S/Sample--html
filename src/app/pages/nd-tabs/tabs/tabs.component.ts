import { Component, EventEmitter, Input, Output } from '@angular/core';
export interface TabItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  show?: boolean;
}

export interface TabSelectEvent {
  index: number;
  tab: TabItem;
}
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [
    {
      show: true,
      label: '',
    },
  ];
  @Input() activeTab: number = 0;
  @Output() onSelect = new EventEmitter<any>();

  selectTab(index: number) {
    if (this.tabs[index]?.disabled) return;

    this.activeTab = index;
    this.onSelect.emit({
      index: index,
      tab: this.tabs[index],
    });
  }
}
