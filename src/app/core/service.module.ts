import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpService } from '../shared/services/http.service';
import { SessionStorageService } from '../shared/services/storage.service';
const SERVICES = [HttpService,SessionStorageService];

@NgModule({
  imports: [CommonModule],
  providers: [...SERVICES]
})
export class ServiceModule {
  static forRoot(): ModuleWithProviders<ServiceModule> {
    return <ModuleWithProviders<ServiceModule>>{
      ngModule: ServiceModule,
      providers: [
        ...SERVICES
      ]
    };
  }
}
