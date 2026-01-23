import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public router: Router) {}

  isComponentsActive(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/pages') &&
      !url.startsWith('/pages/nd-packages') &&
      !url.startsWith('/pages/design-standards')
    );
  }
}
