import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './http.service';
import { SessionStorageService } from './storage.service';


const SERVICES = [HttpService,SessionStorageService];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [...SERVICES]
})
export class CoreProjectServicesModule { 
}
