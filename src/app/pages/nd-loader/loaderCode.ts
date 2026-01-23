export const htmlloaderCode = `<div class="loader-overlay text-center">
  <p class="loader-text text-center">{{ message }}</p> 
</div>`;
export const cssloaderCode = `.loader-overlay {
    position: absolute;
    top: 0;
    right: 50%;
    bottom: 0;
    left: 0;
    z-index: 1100;
    opacity: 1;
  
    .loader-text{
      position: fixed;
      top: 53%;
      right: 0%;
      bottom: 0;
      left: 0%;
      z-index: 9999;
      color: #fff;
      font-size: 87%;
    }
  }
  .loader-overlay:before {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: url('/assets/img/loader-svam.gif') 50% 50% no-repeat transparent;
    background-color: rgba(0,0,0,0.25);
    background-size: 50% 30% !important;
    content: '';
  }`
export const tsloaderCode = `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
 @Input() message: string = 'Page Loading...';
}
`