import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-map-visualization-main',
  templateUrl: './map-visualization-main.component.html',
  styleUrls: [ './map-visualization-main.component.less' ]
})
export class MapVisualizationMainComponent implements OnInit, AfterViewInit {
  lineChart: any;
  ec = echarts as any;
  constructor(private render2: Renderer2) {
  }

  @ViewChild('ccc', { static: false }) myElement: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.myElement);
  }

  ngOnInit(): void {
    // this.lineChart = this.ec.init(document.getElementById('lineChart'));
    // const lineChartOption = {
    //   xAxis: {
    //     type: 'category',
    //     data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [
    //     {
    //       data: [ 820, 932, 901, 934, 1290, 1330, 1320 ],
    //       type: 'line'
    //     }
    //   ]
    // };
    // this.lineChart.setOption(lineChartOption);
  }

  clickMap(e: any) {
    console.log(e);
  }

  ref() {
    // const lineChartOption = {
    //   xAxis: {
    //     type: 'category',
    //     data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [
    //     {
    //       data: [ 1820, 1932, 1901, 1934, 1290, 1330, 1320 ],
    //       type: 'line'
    //     }
    //   ]
    // };
    // this.lineChart.setOption(lineChartOption);

    // this.lineChart.reload();


  }
}
