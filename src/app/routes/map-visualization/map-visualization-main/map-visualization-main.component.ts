import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import * as echarts from 'echarts';
import moment from 'moment/moment';
import {salimAnimation} from '../../../shared/utils/animate';

@Component({
  selector: 'app-map-visualization-main',
  templateUrl: './map-visualization-main.component.html',
  styleUrls: ['./map-visualization-main.component.less'],
  animations: [salimAnimation]
})
export class MapVisualizationMainComponent implements OnInit, AfterViewInit {
  lineChart: any;
  ec = echarts as any;
  isOpen = true;
  isOpenRight: boolean = true;
  isOpenLeft: boolean = true;

  yearMonthDay: any;
  week: any;
  times: any;
  workSafetyDay: any;
  weather: any;
  user: any;

  constructor(private render2: Renderer2) {
  }

  @ViewChild('ccc', {static: false}) myElement: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.myElement);
  }

  ngOnInit(): void {
    moment.locale('zh-cn');
    this.workSafetyDay = '1986';
    this.weather = '天气潮汐';
    this.user = 'salim';
    setInterval(() => {
      var currentTime = new Date();
      console.log(currentTime);
      // console.log(moment().format('HH:mm:ss'));
      // console.log(moment().format('dddd'));
      // console.log(moment().format('L'));
      this.yearMonthDay = moment().format('L');
      this.week = moment().format('dddd');
      this.times = moment().format('HH:mm:ss');
    }, 1000);
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

  toggle() {
    this.isOpenRight = !this.isOpenRight;
    this.isOpenLeft = !this.isOpenLeft;

    // this.isOpen = !this.isOpen;
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
