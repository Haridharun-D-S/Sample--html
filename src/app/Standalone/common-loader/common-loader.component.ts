import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonLoaderService } from './common-loader.service';

@Component({
  selector: 'app-common-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-loader.component.html',
  styleUrls: ['./common-loader.component.scss']
})
export class CommonLoaderComponent  implements OnInit {
  isLoading: boolean;

  constructor(private loaderService: CommonLoaderService) { }

  ngOnInit(): void {
    this.loaderService.getLoaderState().subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }
}