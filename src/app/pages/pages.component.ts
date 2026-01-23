import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  es = false
   showSidebar = true;


  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        // hide for ND Packages route
        this.showSidebar = (!url.includes('/nd-packages') && !url.includes('/design-standards'));
      });

    const easter =  sessionStorage.getItem('Easter') ?? null;
    this.es =  easter === 'admin@123' ? true : false
  }

}
