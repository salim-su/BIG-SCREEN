import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import moment from 'moment/moment';

import { salimAnimation } from '../../../shared/utils/animate';

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
  tunTuPieChart1: any;
  tunTuPieChart2: any;
  tunTuPieChart3: any;
  tunTuPieChart4: any;
  tunTuBarChart1: any;
  quList = [
    { name: '有色矿', color: '#04A7F0' },
    { name: '集袋', color: '#007AFF' },
    { name: '钢材', color: '#8402FF' },
    { name: '铁矿', color: '#01C702' },
    { name: '化肥', color: '#CACF20' },
    { name: '设备', color: '#E8395D' },
    { name: '铁条', color: '#FF940A' }
  ];

  constructor(private render2: Renderer2) {}

  @ViewChild('ccc', { static: false }) myElement: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.myElement);
  }

  loadTunTuBarChart1() {
    this.tunTuBarChart1 = this.ec.init(document.getElementById('tunTuBarChart1'));
    let tunTuBarChart1Option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      // legend: {
      //   data: ['散货', '杂货', '实际']
      // },
      legend: false,
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value', // y 轴为类目轴

          axisTick: {
            show: false // 是否显示刻度线
          },

          axisLabel: {
            show: false // 是否显示刻度标签
          },

          axisLine: { show: false }, // 是否显示坐标轴轴线

          splitLine: { show: false }
        }
      ],
      grid: {
        bottom: '40px',
        top:0,
        left:0,
        right:0
      },
      series: [
        {
          name: '散货',
          type: 'bar',
          data: [120, 132, 101, 134, 90, 230, 210, 134, 90, 230, 210, 230],
          stack: 'A',
          itemStyle: {//自定义颜色
            normal: { color: "#2D77FF" },
          },
        },
        {
          name: '杂货',
          type: 'bar',
          stack: 'A',
          data: [150, 232, 201, 154, 190, 330, 410, 134, 90, 230, 210, 230],
          itemStyle: {//自定义颜色
            normal: { color: "#20DEE6" },
          },
        },
        {
          name: '实际',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310, 134, 90, 230, 210, 230],
          itemStyle: {//自定义颜色
            normal: { color: "#FEC614" },
          },
        }
      ]
    };
    this.tunTuBarChart1.setOption(tunTuBarChart1Option);
  }
  loadTunTuPieChart4() {
    this.tunTuPieChart4 = this.ec.init(document.getElementById('tunTuPieChart4'));
    let tunTuPieChart4Option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '有色矿1',
          type: 'pie',
          radius: ['70%', '75%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          data: [
            {
              value: 800,
              name: '有色矿',
              itemStyle: {
                normal: {
                  color: '#04A7F0'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        },
        {
          name: '集袋2',
          type: 'pie',
          radius: ['60%', '65%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 700,
              name: '集袋',
              itemStyle: {
                normal: {
                  color: '#007AFF'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        },
        {
          name: '钢材3',
          type: 'pie',
          radius: ['50%', '55%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 600,
              name: '钢材',
              itemStyle: {
                normal: {
                  color: '#8402FF'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        },
        {
          name: '铁矿4',
          type: 'pie',
          radius: ['40%', '45%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 500,
              name: '铁矿',
              itemStyle: {
                normal: {
                  color: '#01C702'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        },
        {
          name: '化肥5',
          type: 'pie',
          radius: ['30%', '35%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 400,
              name: '化肥',
              itemStyle: {
                normal: {
                  color: '#CACF20'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        },
        {
          name: '设备',
          type: 'pie',
          radius: ['20%', '25%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 300,
              name: '设备',
              itemStyle: {
                normal: {
                  color: '#E8395D'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        },
        {
          name: '铁条7',
          type: 'pie',
          radius: ['10%', '15%'],
          center: ['50%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 200,
              name: '铁条',
              itemStyle: {
                normal: {
                  color: '#FF940A'
                }
              }
            },
            {
              value: 1000,
              name: '总数',
              itemStyle: {
                normal: {
                  color: 'rgba(208,218,238,0.59)'
                }
              }
            }
          ]
        }
      ]
    };
    this.tunTuPieChart4.setOption(tunTuPieChart4Option);
  }

  loadTunTuPieChart1() {
    this.tunTuPieChart1 = this.ec.init(document.getElementById('tunTuPieChart1'));
    const tunTuPieChart1Option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        icon: 'circle',
        itemWidth: 12, // 设置宽度
        itemHeight: 12, // 设置高度
        // 图例的位置
        bottom: 0, // 或者可以使用 'bottom'
        // 图例的其它配置
        orient: 'horizontal', // 水平排列
        left: 'center' // 居中
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '散货' },
            { value: 735, name: '杂货' }
          ]
        }
      ],
      color: ['#F59A23', '#FFD93A']
    };
    this.tunTuPieChart1.setOption(tunTuPieChart1Option);
  }

  loadTunTuPieChart2() {
    this.tunTuPieChart2 = this.ec.init(document.getElementById('tunTuPieChart2'));
    const tunTuPieChart2Option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        borderWidth: '0',
        icon: 'circle',
        itemWidth: 12, // 设置宽度
        itemHeight: 12, // 设置高度
        // 图例的位置
        bottom: 0, // 或者可以使用 'bottom'
        // 图例的其它配置
        orient: 'horizontal', // 水平排列
        left: 'center' // 居中
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '进口' },
            { value: 735, name: '出口' }
          ]
        }
      ],
      color: ['#3A7EFF', '#3ADEFF']
    };
    this.tunTuPieChart2.setOption(tunTuPieChart2Option);
  }

  loadTunTuPieChart3() {
    this.tunTuPieChart3 = this.ec.init(document.getElementById('tunTuPieChart3'));
    const tunTuPieChart3Option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        borderWidth: '0',
        icon: 'circle',
        itemWidth: 12, // 设置宽度
        itemHeight: 12, // 设置高度
        // 图例的位置
        bottom: 0, // 或者可以使用 'bottom'
        // 图例的其它配置
        orient: 'horizontal', // 水平排列
        left: 'center' // 居中
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '内贸' },
            { value: 735, name: '外贸' }
          ]
        }
      ],
      color: ['#00D680', '#A6FF11']
    };
    this.tunTuPieChart3.setOption(tunTuPieChart3Option);
  }

  ngOnInit(): void {
    this.loadTunTuPieChart1();
    this.loadTunTuPieChart2();
    this.loadTunTuPieChart3();
    this.loadTunTuPieChart4();
    this.loadTunTuBarChart1();

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
