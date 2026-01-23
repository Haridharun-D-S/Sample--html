import { Component } from '@angular/core';
import { cssheaderCode, htmlheaderCode, tsheaderCode } from './headerCode';
import { JsonService } from 'src/app/shared/service/service.service';

@Component({
  selector: 'app-nd-header',
  templateUrl: './nd-header.component.html',
  styleUrls: ['./nd-header.component.scss']
})
export class NdHeaderComponent {
  htmlheaderCode = htmlheaderCode;
  cssheaderCode = cssheaderCode;
  tsheaderCode = tsheaderCode;
  headerConfigOptions: any[] = [];
  headerOutputEvents: any[] = [];

  constructor(readonly service: JsonService) { }
  onSearchChange(event: any) {
  }

  onSearchClick(event: any) {
  }

  onMenuClick(menu: string) { }

  onLogout() {
  }
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
  
  ngOnInit(): void {
    this.service.headerConfig().subscribe({
      next: (res: any) => {
        this.headerConfigOptions = res.headerConfigOptions;
        this.headerOutputEvents = res.headerOutputEvents;
      },
      error: (error: any) => {
      },
    })
  }
}
