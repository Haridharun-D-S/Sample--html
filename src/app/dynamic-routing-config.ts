// dynamic-routing.service.ts
import { Injectable } from '@angular/core';
import { moduleConfiguration } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DynamicRoutingService {
  generateRoutes(): any[] {
    const routes = [];
    if (moduleConfiguration.piechart) {
      routes.push({
        path: 'pie',
        loadChildren: () => import('./modules/pie-chart/pie-chart.module').then((m) => m.PieChartModule)
      });
    }
    if (moduleConfiguration.barchart) {
      routes.push({
        path: 'bar',
        loadChildren: () => import('./modules/bar-chart/bar-chart.module').then(m => m.BarChartModule)
      });
    }
    if (moduleConfiguration.scatterchart) {
        routes.push({
          path: 'scatter',
          loadChildren: () => import('./modules/scatter-chart/scatter-chart.module').then(m => m.ScatterChartModule)
        });
      }
      if (moduleConfiguration.GroupedandStacked) {
        routes.push({
          path: 'chartg-sc',
          loadChildren: () => import('./modules/GroupedandStacked-chart/GroupedandStacked-chart.module').then(m => m.GroupedandStackedChartModule)
        });
      }
    return routes;
  }
}