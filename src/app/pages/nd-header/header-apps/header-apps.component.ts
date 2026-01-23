import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-apps',
  templateUrl: './header-apps.component.html',
  styleUrls: ['./header-apps.component.scss']
})
export class HeaderappsComponent {

   // Inputs
  @Input() title: string = 'Conversational Data Explorer';
  @Input() imgLogoPath: string = 'assets/img/svam2.png';
  @Input() fullName: string = '';
  @Input() menus: any[] = [];
  @Input() searchText: string = '';
  activeDropdown: string | null = null;

  // Conditional visibility
  @Input() isSearchEnabled: boolean = true;
  @Input() isMenuEnabled: boolean = true;
  @Input() isUserInfoEnabled: boolean = true;
  @Input() isLogoutEnabled: boolean = true;

  // Outputs
  @Output() searchChange = new EventEmitter<string>();
  @Output() menuClick = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

 
  onSearchChange() {
    this.searchChange.emit(this.searchText);
  }
    toggleDropdown(menuLabel: string) {
    this.activeDropdown = this.activeDropdown === menuLabel ? null : menuLabel;
  }

  onSubMenuClick(subItem: string) {
    this.menuClick.emit(subItem);
    this.activeDropdown = null;
  }

  onMenuClick(menu: any) {
    if (!menu.submenu || menu.submenu.length === 0) {
      this.menuClick.emit(menu.label);
    } else {
      this.toggleDropdown(menu.label);
    }
  }

  onSearchClick() {
    this.searchChange.emit(this.searchText);
  }

  // onMenuClick(menu: string) {
  //   this.menuClick.emit(menu);
  // }

  onLogout() {
    this.logout.emit();
  }
}
