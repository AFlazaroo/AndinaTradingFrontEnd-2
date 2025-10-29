import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div *ngIf="chartOptions">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
        [title]="chartOptions.title"
        [tooltip]="chartOptions.tooltip">
      </apx-chart>
    </div>
  `,
})
export class StockChartComponent implements OnChanges {
  @Input() candles: any[] = [];
  @Input() symbol: string = '';

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.candles?.length || !this.symbol) return;

    this.chartOptions = {
      series: [{
        data: this.candles.map(c => ({
          x: new Date(c.timestamp).toLocaleDateString(),
          y: [c.open, c.high, c.low, c.close]
        }))
      }],
      chart: {
        type: 'candlestick',
        height: 350
      },
      xaxis: {
        type: 'category'
      },
      title: {
        text: `Gráfico de Velas – ${this.symbol}`,
        align: 'left'
      },
      tooltip: {
        enabled: true
      }
    };
  }
}