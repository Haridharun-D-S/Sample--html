import { Component, ViewChild } from '@angular/core';
import { TabItem, TabsComponent } from './tabs/tabs.component';
import { CssTab, HtmlTab, TsTab } from './tabCode';

@Component({
  selector: 'app-nd-tabs',
  templateUrl: './nd-tabs.component.html',
  styleUrls: ['./nd-tabs.component.scss'],
})
export class NdTabsComponent {
  activeTab: number = 0;
  activeTabHide: number = 0;
  selectedTabInfo: any = null;
  selectedTabInfoHide: any = null;
  htmlCode = HtmlTab
  cssCode =  CssTab
  tsCode = TsTab
  // hide tab for Hide
  tabForHide: TabItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      disabled: false,
      show: false,
    },
    {
      label: 'Profile',
      icon: 'fa-solid fa-user',
      disabled: false,
      show: true,
    },
    {
      label: 'Settings',
      icon: 'fa-solid fa-gear',
      disabled: false,
      show: false,
    },
    {
      label: 'Premium',
      icon: 'fa-solid fa-star',
      disabled: false,
      show: true,
    },
  ];

  // disable tab
  tabsData: TabItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      disabled: false,
      show: true,
    },
    {
      label: 'Profile',
      icon: 'fa-solid fa-user',
      disabled: false,
      show: true,
    },
    {
      label: 'Settings',
      icon: 'fa-solid fa-gear',
      disabled: false,
      show: true,
    },
    {
      label: 'Premium',
      icon: 'fa-solid fa-star',
      disabled: true,
      show: true,
    },
  ];

  onTabSelect(event: any) {
    this.selectedTabInfo = event;
    this.activeTab = event.index;
    console.log('Tab Selected:', event);
  }
  onTabHideSelect(event: any) {
    this.selectedTabInfoHide = event;
    this.activeTabHide = event.index;
    console.log('Tab Selected:', event);
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }
  setActiveTabHide(index: number) {
    this.activeTabHide = index;
  }

  toggleTabDisabled(index: number) {
    this.tabsData[index].disabled = !this.tabsData[index].disabled;
  }
  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
}
