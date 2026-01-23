export const htmlheaderCode = `<header class="header-container">
  <!-- Left: Logo and Title -->
  <div class="left-section">
    <img
      *ngIf="imgLogoPath"
      [src]="imgLogoPath"
      alt="Logo"
      class="logo"
    />
    <h2 *ngIf="title" class="title">{{ title }}</h2>
  </div>

  <!-- Center: Search bar -->
  <div class="center-section" *ngIf="isSearchEnabled">
    <div class="search-box">
      <input
        type="text"
        class="search-input"
        [(ngModel)]="searchText"
        (input)="onSearchChange()"
        placeholder="Search"
      />
      <button class="search-btn" (click)="onSearchClick()">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>

  <!-- Right: Menu icons, user info, logout -->
  <div class="right-section">
    <!-- Menu icons -->
    <div *ngIf="isMenuEnabled" class="menu-icons">
     <nav class="menu">
      <a
        *ngFor="let menu of menus"
        href="javascript:void(0)"
        (click)="onMenuClick(menu)"
        class="menu-item"
      >
        {{ menu.label }}
      </a>
    </nav>
    </div>

    <!-- Welcome text -->
    <div *ngIf="isUserInfoEnabled" class="user-info">
      <i class="fas fa-user-circle user-icon"></i>
      <span class="welcome-text">Welcome, <b>{{ fullName }}</b>!</span>
    </div>


    <!-- Logout -->
    <button *ngIf="isLogoutEnabled" class="logout-btn" (click)="onLogout()">
      <i class="fas fa-power-off"></i>
    </button>
  </div>
</header>
`;
export const cssheaderCode = `.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;

  padding: 8px 20px;
  font-family: 'Segoe UI', sans-serif;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  height: 40px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #2d2d2d;
  margin-top: 15px;
}

.center-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  width: 400px;
}

.search-input {
  flex: 1;
  border: none;
  padding: 6px 10px;
  outline: none;
  font-size: 14px;
}

.search-btn {
  background: white;
  border: none;
  border-left: 1px solid #ccc;
  padding: 6px 10px;
  cursor: pointer;
  color: #00b48a;
  font-size: 16px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-icons i {
  font-size: 18px;
  color: #b8860b;
  cursor: pointer;
  margin-right: 10px;
  transition: 0.3s;
}

.menu-icons i:hover {
  color: #d9a81e;
}

.user-info {
  display: flex;
  align-items: center;
  color: #4a4a4a;
  font-size: 14px;
}

.user-icon {
  font-size: 18px;
  color: #444;
  margin-right: 6px;
}


.logout-btn {
  background: none;
  border: none;
  color: #b22222;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn:hover {
  color: #ff0000;
}




.menu {
  display: flex;
  gap: 15px;
}

.menu-item {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
}

.menu-item:hover {
  color: #007bff;
}
`;
export const tsheaderCode = `import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  onSearchClick() {
    this.searchChange.emit(this.searchText);
  }

  onMenuClick(menu: string) {
    this.menuClick.emit(menu);
  }

  onLogout() {
    this.logout.emit();
  }
}
`;