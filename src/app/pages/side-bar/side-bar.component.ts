import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PagesComponent } from '../pages.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy {
  searchText = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  menuList = this.router.config
    .find((r: any) => r.component === PagesComponent)
    ?.children
    ?.filter((r: any) => r.data?.menu)
    .map((r: any) => ({
      label: r.data.label,
      icon: r.data.icon,
      route: `/pages/${r.path}`
    })) || [];
  filteredMenu = [...this.menuList];

  constructor(private router: Router) {

  }
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000), // ⏱ 1 second delay
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.applyFilter(value);
      });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  private applyFilter(value: string): void {
    this.filteredMenu = this.menuList.filter((menu: any) =>
      menu.label.toLowerCase().includes(value.toLowerCase())
    );

    // ✅ Auto activate first item & load right side
    if (this.filteredMenu.length) {
      this.router.navigate([this.filteredMenu[0].route]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
