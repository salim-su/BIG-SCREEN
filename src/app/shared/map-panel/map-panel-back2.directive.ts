import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {
  MapService,
  TileSuperMapRest,
  Tianditu,
  ImageSuperMapRest,
  FeatureService,
  GetFeaturesBySQLParameters,
  SecurityManager
} from '@supermap/iclient-ol';
import BigNumber from 'bignumber.js';
import moment from 'moment/moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import * as olControl from 'ol/control';
import { inAndOut } from 'ol/easing';
import { click, doubleClick, singleClick } from 'ol/events/condition';
import * as olExtent from 'ol/extent';
import * as olFormat from 'ol/format';
import * as olGeom from 'ol/geom';
import { Circle, Point, Polygon } from 'ol/geom';
import DragPan from 'ol/interaction/DragPan.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import * as olLayer from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import * as olSource from 'ol/source';
import { Vector } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import * as olStyle from 'ol/style';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Observable, zip } from 'rxjs';
// import { Select } from 'ol/interaction';

// import { Draw, Modify, Snap } from 'ol/interaction';
@Directive({
  selector: '[appMapPanel3]'
})
export class MapPanelBack2Directive {
  // private url = 'http://dlxx.tpitc.cn:32636/portalproxy/iserver/services/LightGray/rest/maps/TJVMap_LightGray';
  private url = 'http://10.10.21.19:8090/iserver/services/map-mongodb-TJVMapvGDWZ2/rest/maps/TJVMap_vGDWZ';
  // private yardUrl = 'http://dlxx.tpitc.cn:32636/portalproxy/iserver/services/map-SGSZTSJ/rest/maps/SGSZTSJ';
  private yardUrl = 'http://10.10.21.19:8090/iserver/services/map-SGSZTSJVSGSGIS/rest/maps/SGSZTSJ';
  // private dataUrl = 'http://dlxx.tpitc.cn:32636/portalproxy/iserver/services/data-SGSZTSJ/rest/data';
  private dataUrl = 'http://10.10.21.19:8090/iserver/services/data-SGSZTSJVSGSGIS/rest/data';
  private key = 'QtOGjgHlhuTIf5fjaHGmL9nu';
  private yxUrl = 'http://10.10.21.19:8090/iserver/services/map-mongodb-SGSDOMV2022Q2/rest/maps/SGSDOMV2022Q2';

  private map = null;
  private baseLayers = {
    normal: [],
    earth: []
  };
  private defLayer = null;
  private videosPointLayer = null;
  private blankLayers = null;
  private features: any[] = null;
  private _videos = [];
  private _videosPoint = '';
  private _stackId: any = null;
  private _yardCode: any = null;
  private _polygonPoints: any = null;
  private _polygonPointsEdit: any = null;
  private _baseMapType: any = null; // normal earth
  /*拖拽用例*/
  private draw: any;
  private snap: any;
  private modify: any;
  private drawSource: any;
  private drawVector: any;
  private gridLayer: any;
  private highlightLayer: any;
  private _selectFlag = true;
  private activeMouseRight = false;
  interval = null;
  selPoint = 1;
  featureService: any;
  recordBulkGridLayer: any;
  selectedGridLayer: any;
  yardGridLayer: any;

  @Input('selectFlag')
  set selectFlag(v: any) {
    this._selectFlag = v;
  }

  @Input('videos')
  set videos(v: any[]) {
    this._videos = v;
  }

  @Input('videoPoint')
  set videoPoint(v: any) {
    this._videosPoint = v;
    if (this.map) {
      this.loadSelVideosPoint(this._videosPoint);
    }
  }

  @Input('yardCode')
  set yardCode(v: any) {
    console.log('yardCode', v);
    this._yardCode = v;
    if (this._yardCode) {
      setTimeout(res => {
        this.flyToYard(this._yardCode);
      }, 500);
    }
  }

  @Input('resetFlag')
  set resetFlag(v: any) {
    console.log('resetFlag', v);
    if (v.flag) {
      this.drawReset();
      this.drawInit();
      console.log(v);
    }
  }

  @Input('drawFlag')
  set drawFlag(v: any) {
    console.log('drawFlag', v);
    if (v.flag) {
      this.drawReset();
      this.drawInit();
      console.log(v);
    }
  }

  @Input('polygonPoints')
  set polygonPoints(v: any) {
    this._polygonPoints = v;
    if (this._polygonPoints.value) {
      this.loadArea(this._polygonPoints);
    }
  }

  @Input('polygonPointsEdit')
  set polygonPointsEdit(v: any) {
    this._polygonPoints = v;
    if (this._polygonPoints.value) {
      this.loadAreaEdit(this._polygonPoints);
    }
  }

  @Input('focusPoint')
  set focusPoint(v: any) {
    if (v) {
      this.map.getView().animate({
        duration: 850,
        center: [v?.longitude, v?.latitude]
      });
      this.selPoint = v?.id;
      // this.selPoint = v?.id
    }
  }

  @Input('baseMapType')
  set baseMapType(v) {
    this._baseMapType = v;
    if (this.map) {
      this.baseLayers.normal.forEach(i => {
        i.setVisible(false);
      });
    }
  }

  @Input('stackIds')
  set stackIds(v) {
    if (this.map) {
      if (this.selectedGridLayer) {
        this.map.removeLayer(this.selectedGridLayer);
      }
      if (this.recordBulkGridLayer) {
        this.map.removeLayer(this.recordBulkGridLayer);
      }
      this.loadStackIdBulk(v, true);
    }
  }

  @Input('selectStack')
  set selectStack(v) {
    if (this.map) {
      console.log(v);
      if (this.selectedGridLayer) {
        this.map.removeLayer(this.selectedGridLayer);
      }
      this.flyToSelectStack(v);
    }
  }

  @Input('tabNum')
  set tabNum(v) {
    if (this.map) {
      if (this.selectedGridLayer) {
        this.map.removeLayer(this.selectedGridLayer);
      }
      if (this.recordBulkGridLayer) {
        this.map.removeLayer(this.recordBulkGridLayer);
      }
      this.loadRecordBulk();
    }
  }

  get baseMapType() {
    return this._baseMapType;
  }

  @Input()
  popupId: any;
  @Input()
  truckType: any;
  @Output()
  readonly clickMap = new EventEmitter();
  @Output()
  readonly clickMapVideo = new EventEmitter();
  @Output()
  readonly modifyVal = new EventEmitter();
  @Output()
  readonly drawVal = new EventEmitter();
  @Output()
  readonly selectMap = new EventEmitter();

  constructor(private el: ElementRef, private msg: NzMessageService, private httpClient: _HttpClient) {
    // SecurityManager.registerKey(this.yardUrl, this.key);
    // SecurityManager.registerKey(this.dataUrl, this.key);
    // SecurityManager.registerKey(this.url, this.key);
    this.featureService = new FeatureService(this.dataUrl);
    this.initMap();
  }

  baseMapInfo(): Observable<any> {
    SecurityManager.registerKey(this.url, this.key);
    return new Observable<any>(x => {
      new MapService(this.url).getMapInfo(serviceResult => {
        // if (serviceResult.type === 'processFailed') {
        //   // return false;
        //   setTimeout(() => {
        //     this.initMap();
        //   }, 800);
        //   return;
        // }
        x.next(serviceResult.result);
      });
    });
  }

  initMap(): void {
    zip(this.baseMapInfo()).subscribe(([baseInfo]) => {
      const resolutionSet = new Set();
      baseInfo.visibleScales.forEach(i => {
        resolutionSet.add((360 * 0.0254) / (baseInfo.dpi * 2 * Math.PI * baseInfo.prjCoordSys.coordSystem.datum.spheroid.axis) / i);
      });
      const baseTI = ImageSuperMapRest.optionsFromMapJSON(this.url, baseInfo);
      // console.log(baseTI);
      const resolutions = Array.from(resolutionSet) as any[];
      /*中心点,projection*/
      //center
      // :
      // {x: 117.3839605279845, y: 39.376163000641355}
      const view = new View({
        // center: [baseInfo.center.x, baseInfo.center.y],
        // center: [ 117.75255393129281, 38.98377688218725 ],
        center: [117.75843177000665, 38.98805748458564],
        zoom: 8.7,
        resolutions,
        multiWorld: true,
        // projection: `EPSG:${baseInfo.prjCoordSys.epsgCode}`
        projection: 'EPSG:4326'
      });
      if (!this.map) {
        this.map = new Map({
          target: this.el.nativeElement,
          controls: olControl.defaults({
            zoom: false,
            rotate: false,
            attribution: false
          }),
          view
        });
      }
      let buttonElement;
      if (document.getElementById('icon-compass')) {
        buttonElement = document.getElementById('icon-compass');
      } else {
        buttonElement = document.createElement('div');
        buttonElement.setAttribute('title', 'salimsu');
        buttonElement.className = 'icon-compasss';
        this.el.nativeElement.appendChild(buttonElement);
      }

      // let buttonElement = document.createElement('div');
      // let buttonElement = document.getElementById('icon-compass');
      // buttonElement.setAttribute('title', 'salimsu');
      // buttonElement.className = 'icon-compass';
      buttonElement.onmousedown = () => {
        this.map.getView().animate({ rotation: 0 });
      };
      // this.el.nativeElement.appendChild(buttonElement);
      // console.log(this.el.nativeElement.offsetWidth);
      //
      view.on('change:rotation', e => {
        const deg = e.oldValue * (180 / Math.PI);
        buttonElement.style.transform = `rotate(${deg}deg)`;
      });
      let pan = null;
      this.map.getInteractions().forEach(function (element, index, array) {
        if (element instanceof DragPan) {
          pan = element;
        }
      });
      this.el.nativeElement.onmousedown = e => {
        if (e.which === 3) {
          this.activeMouseRight = true;
          pan.setActive(false);
        }
      };
      this.el.nativeElement.onmousemove = e => {
        if (this.activeMouseRight) {
          let mapCenter = {
              x: this.el.nativeElement.offsetWidth / 2 + this.el.nativeElement.offsetLeft,
              y: this.el.nativeElement.offsetHeight / 2 + this.el.nativeElement.offsetTop
            },
            clickPoint = {
              x: e.screenX,
              y: e.screenY
            };
          let radian = Math.atan((clickPoint.y - mapCenter.y) / (clickPoint.x - mapCenter.x));
          if (radian < Math.PI * 0.5 && radian > Math.PI * -0.5) {
            console.log(1);
            // 设置角度
            this.map.getView().setRotation(radian);
          }
        }
      };
      this.el.nativeElement.onmouseup = e => {
        console.log(e);
        if (e.which === 3) {
          this.activeMouseRight = false;
          pan.setActive(true);
        }
      };
      const baseMap = new olLayer.Tile({
        source: new TileSuperMapRest({
          url: this.url,
          prjCoordSys: { epsgCode: 4326 },
          clipRegionEnabled: true,
          format: 'webp',
          crossOrigin: 'anonymous',
          tileGrid: new TileGrid({
            extent: [baseInfo.bounds.left, baseInfo.bounds.bottom, baseInfo.bounds.right, baseInfo.bounds.top],
            resolutions
          })
        })
        // visible: false,
        // @ts-ignore
      });
      this.map.addLayer(baseMap);

      const baseMapPOI = new olLayer.Tile({
        source: new TileSuperMapRest({
          url: this.yardUrl,
          prjCoordSys: { epsgCode: 4326 },
          clipRegionEnabled: true,
          format: 'webp',
          crossOrigin: 'anonymous',
          tileGrid: new TileGrid({
            extent: [baseInfo.bounds.left, baseInfo.bounds.bottom, baseInfo.bounds.right, baseInfo.bounds.top],
            resolutions
          })
        })
      });
      this.map.addLayer(baseMapPOI);

      // const yxMapPOI = new olLayer.Tile({
      //   source: new TileSuperMapRest({
      //     url: this.yxUrl,
      //     prjCoordSys: { epsgCode: 4326 },
      //     clipRegionEnabled: true,
      //     format: 'webp',
      //     crossOrigin: 'anonymous',
      //     tileGrid: new TileGrid({
      //       extent: [baseInfo.bounds.left, baseInfo.bounds.bottom, baseInfo.bounds.right, baseInfo.bounds.top],
      //       resolutions
      //     })
      //   })
      // });
      // this.map.addLayer(yxMapPOI);

      this.map.on('singleclick', e => {
        console.log(e['coordinate']);
        const features = this.map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
        if (features.length) {
          this.clickMap.next(features[0].values_.item);
        }
        this.clickMapVideo.next(e['coordinate']);
      });
      this.loadRecordBulk();
      if (this._videosPoint) {
        this.loadSelVideosPoint(this._videosPoint);
      }
    });
  }

  loadSelVideosPoint(videosPoint) {
    if (this.videosPointLayer) {
      this.map.removeLayer(this.videosPointLayer);
    }
    let vectorSource = new VectorSource();
    let pointFeature = new Feature({
      geometry: new olGeom.Point([videosPoint?.longitude, videosPoint?.latitude]),
      item: videosPoint
    });
    console.log(pointFeature);
    vectorSource.addFeature(pointFeature);
    this.videosPointLayer = new VectorLayer({
      source: vectorSource,
      style: feature => {
        return [
          new olStyle.Style({
            image: new olStyle.Icon({
              anchor: [0.5, 1],
              opacity: 1,
              src: './assets/img/videos.svg',
              scale: 1
            })
          })
        ];
      }
    });
    this.map.addLayer(this.videosPointLayer);
  }

  fixExtent(extent) {
    const view = this.map.getView();
    view.fit(extent, {
      size: this.map.getSize(),
      padding: [100, 50, 100, 50],
      easing: inAndOut
    });

    const newExtent = view.calculateExtent();
    const projection = view.get('projection');
    const resolutions = view.get('resolutions');
    const new_view = new View({
      resolutions,
      projection,
      extent: newExtent
    });

    new_view.on('change:rotation', e => {
      const deg = e.oldValue * (180 / Math.PI);
      this.el.nativeElement.style.transform = `rotate(${deg}deg)`;
    });

    new_view.fit(extent, {
      size: this.map.getSize(),
      padding: [100, 50, 100, 50]
    });
    this.map.setView(new_view);
  }

  chooseAreaHighlight(features) {
    console.log('salim');
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
    }
    this.highlightLayer = new VectorLayer({
      zIndex: 9999,
      source: new VectorSource({
        features
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 5
        })
      })
    });
    this.map.addLayer(this.highlightLayer);
  }

  loadRecordBulk() {
    this.httpClient.get('tjpn4-bulk/tallyStack/list?status=1').subscribe(mapInfo => {
      let vectorSource = new VectorSource();
      if (mapInfo) {
        if (this._polygonPoints) {
          mapInfo = mapInfo.filter(p => p.id != this._polygonPoints.id);
        }
        mapInfo.forEach(item => {
          let polygonData = JSON.parse(item.polygonPoints);
          let polygon = new Polygon(polygonData);
          let feature = new Feature({
            type: 'polygon',
            item: item, // 传递数据，点击面展示可用
            geometry: polygon
          });
          // feature.setStyle(this.createMarkerStyle(feature));
          vectorSource.addFeature(feature);
        });
        this.recordBulkGridLayer = new VectorLayer({
          source: vectorSource,
          style: feature => {
            return [
              new Style({
                fill: new Fill({
                  color:
                    moment(new Date()).diff(moment(feature['values_']['item']['createTime']), 'months') >= 3
                      ? 'rgba(248,173,175,0.9)'
                      : 'rgba(228, 178, 92, 0.8)'
                  // color: '#4e98f444'
                }),
                stroke: new Stroke({
                  color: 'red',
                  width: 1,
                  lineDash: [20, 10, 20, 10]
                }),
                text: new Text({
                  textAlign: 'center',
                  textBaseline: 'middle',
                  font: 'bold 13px 微软雅黑',
                  // text: [`<div>${feature['values_']['item']['shipName']}</div>`, `<div>"susu"</div>`],
                  // text: `${feature['values_']['item']['shipName']}\n${feature['values_']['item']['inventoryWeight']}`,
                  text: `${feature['values_']['item']['shipName']}\n${BigNumber(feature['values_']['item']['inventoryWeight'] / 1000)
                    .toNumber()
                    .toFixed(3)}`,
                  fill: new Fill({ color: '#0c3ea6' })
                  // stroke: new Stroke({ color: '#353535', width: 1 })
                })
              }),
              feature['values_']['item']['isPass'] === 'Y'
                ? new Style({
                    image: new olStyle.Icon({
                      opacity: 1,
                      src: './assets/img/fangxing2.svg',
                      scale: 1
                    }),
                    geometry: f => {
                      var extent = f.getGeometry().getExtent();
                      var center = olExtent.getCenter(extent);
                      // console.log(center);
                      // console.log();
                      const point = JSON.parse(f['values_']['item'].polygonPoints)[0][0];
                      // var center = olExtent.getBottomRight(extent);
                      return new olGeom.Point(point);
                    }
                  })
                : new Style({
                    fill: new Fill({
                      color: 'rgba(255, 255, 255, 0)'
                    })
                  })
            ];
          }
        });
        this.map.addLayer(this.recordBulkGridLayer);

        setTimeout(() => {
          if (this._videos) {
            this.defLayer = new olLayer.Vector({
              source: new olSource.Vector(),
              style: feature => {
                return [
                  new olStyle.Style({
                    image: new olStyle.Icon({
                      anchor: [0.5, 1],
                      opacity: 1,
                      src: './assets/img/videos.svg',
                      scale: 1
                    })
                  })
                ];
              }
            });
            this.map.addLayer(this.defLayer);
            this.renderVideos();
          }
        }, 300);

        this.mapFeatureSelect();
      }
    });
  }

  loadStackIdBulk(ids, idsFlag) {
    this.recordBulkGridLayer = '';
    this.httpClient.get(`tjpn4-bulk/tallyStack/list?status=1&ids=${ids}&idsFlag=${idsFlag}`).subscribe(mapInfo => {
      let vectorSource = new VectorSource();
      if (mapInfo && JSON.stringify(mapInfo) !== '{}') {
        if (this._polygonPoints) {
          mapInfo = mapInfo.filter(p => p.id != this._polygonPoints.id);
        }
        mapInfo.forEach(item => {
          let polygonData = JSON.parse(item.polygonPoints);
          let polygon = new Polygon(polygonData);
          let feature = new Feature({
            type: 'polygon',
            item: item, // 传递数据，点击面展示可用
            geometry: polygon
          });
          // feature.setStyle(this.createMarkerStyle(feature));
          vectorSource.addFeature(feature);
        });
        this.recordBulkGridLayer = new VectorLayer({
          source: vectorSource,
          style: feature => {
            return new Style({
              fill: new Fill({
                color:
                  moment(new Date()).diff(moment(feature['values_']['item']['createTime']), 'months') >= 3
                    ? 'rgba(248,173,175,0.9)'
                    : 'rgba(228, 178, 92, 0.8)'
                // color: '#E4B25C'
              }),
              stroke: new Stroke({
                color: 'red',
                width: 1,
                lineDash: [20, 10, 20, 10]
              }),
              text: new Text({
                textAlign: 'center',
                textBaseline: 'middle',
                font: 'bold 13px 微软雅黑',
                // text: [`<div>${feature['values_']['item']['shipName']}</div>`, `<div>"susu"</div>`],
                // text: `${feature['values_']['item']['shipName']}\n${feature['values_']['item']['inventoryWeight']}`,
                text: `${feature['values_']['item']['shipName']}\n${BigNumber(feature['values_']['item']['inventoryWeight'] / 1000)
                  .toNumber()
                  .toFixed(3)}`,
                fill: new Fill({ color: '#0c3ea6' })
                // stroke: new Stroke({ color: '#353535', width: 1 })
              })
            });
          }
        });
        this.map.addLayer(this.recordBulkGridLayer);
        this.mapFeatureSelect();
        if (this.selectedGridLayer) {
          this.map.removeLayer(this.selectedGridLayer);
        }
        this.flyNotSelect(mapInfo[0]);
      }
    });
  }

  flyNotSelect(v: any) {
    let polygonData = JSON.parse(v.polygonPoints);
    const vectorSourceOld = new VectorSource();
    const polygon = new olGeom.Polygon(polygonData);
    const feature = new Feature({
      type: 'polygon',
      geometry: polygon,
      item: v
    });
    this.onFocus(feature.getGeometry().getExtent());
  }

  mapFeatureSelect() {
    const selectClick = new Select({
      condition: click,
      style: this._selectFlag
        ? function (f) {
            console.log(f);
            if (f['values_']['type'] === 'polygon' && f['values_']['item']) {
              return new Style({
                fill: new Fill({
                  color: '#7BFEAE'
                }),
                stroke: new Stroke({
                  color: 'rgba(255, 255, 255)',
                  width: 2
                }),
                text: new Text({
                  textAlign: 'center',
                  textBaseline: 'middle',
                  font: '13px 微软雅黑',
                  // text: [`<div>${feature['values_']['item']['shipName']}</div>`, `<div>"susu"</div>`],
                  // text: `${f['values_']['item']['shipName']}\n${f['values_']['item']['billNo']}`,
                  text: `${f['values_']['item']['shipName']}\n${BigNumber(f['values_']['item']['inventoryWeight'] / 1000)
                    .toNumber()
                    .toFixed(3)}`,
                  fill: new Fill({ color: '#0c3ea6' })
                  // stroke: new Stroke({ color: '#353535', width: 1 })
                })
              });
            } else {
              // return null
              return new Style({
                stroke: new olStyle.Stroke({
                  color: '#1890ff',
                  width: 2
                })
              });
            }
          }
        : null
    });
    this.map.addInteraction(selectClick);
    selectClick.on('select', e => {
      if (e.selected[0]) {
        const val = e.selected[0]['values_'].item;
        this.selectMap.next(val);
      }
    });
  }

  drawReset() {
    console.log('drawReset');
    if (this.drawVector) {
      console.log(this.drawVector.getSource());
      this.drawVector.getSource().clear();
      this.map.removeInteraction(this.draw);
      // this.map.removeLayer(this.drawVector);
      // this.drawVector = null;
    }

    if (this.gridLayer) {
      console.log('this.gridLayer');
      console.log(this.gridLayer.getSource());
      this.gridLayer.getSource().clear();
    }
  }

  loadArea(polygonPoints: any): any {
    const vectorSourceOld = new VectorSource();
    const polygon = new olGeom.Polygon(polygonPoints.value);
    const feature = new Feature({
      type: 'polygon',
      geometry: polygon
    });
    vectorSourceOld.addFeature(feature);
    this.gridLayer = new VectorLayer({
      source: vectorSourceOld,
      style: new olStyle.Style({
        fill: new olStyle.Fill({
          color: 'rgba(0, 255, 0, 0.4)'
        }),
        stroke: new olStyle.Stroke({
          color: '#0000FF',
          width: 2
        })
      })
    });
    setTimeout(res => {
      this.map.addLayer(this.gridLayer);
    }, 1000);
  }

  loadAreaEdit(polygonPoints: any): any {
    const vectorSourceOld = new VectorSource();
    const polygon = new olGeom.Polygon(polygonPoints.value);
    const feature = new Feature({
      type: 'polygon',
      geometry: polygon
    });
    vectorSourceOld.addFeature(feature);
    this.gridLayer = new VectorLayer({
      source: vectorSourceOld,
      style: new olStyle.Style({
        fill: new olStyle.Fill({
          color: 'rgba(0, 255, 0, 0.4)'
        }),
        stroke: new olStyle.Stroke({
          color: '#0000FF',
          width: 2
        })
      })
    });
    setTimeout(res => {
      this.map.addLayer(this.gridLayer);
      var select = new Select({
        condition: click,
        layers: [this.gridLayer]
      });
      var modify = new Modify({
        features: select.getFeatures()
      });
      this.map.addInteraction(select);
      this.map.addInteraction(modify);

      modify.on('modifyend', e => {
        // @ts-ignore
        const val = e.features.item(0).getGeometry().getCoordinates();
        this.modifyVal.next(val);
        // this.map.removeInteraction(modify);
        // this.map.removeInteraction(select);
      });
    }, 1000);
  }

  drawInit() {
    /*拖拽用例*/
    console.log('drawInit');
    this.drawSource = new VectorSource();
    this.drawVector = new VectorLayer({
      source: this.drawSource,
      style: new olStyle.Style({
        fill: new olStyle.Fill({
          // color: 'rgba(255, 255, 255, 0.2)'
          color: 'rgba(255, 255, 255, 0.8)'
        }),
        stroke: new olStyle.Stroke({
          color: '#1890ff',
          width: 2
        })
      })
    });
    this.map.addLayer(this.drawVector);
    this.modify = new Modify({ source: this.drawSource });
    this.map.addInteraction(this.modify);

    this.draw = new Draw({
      source: this.drawSource,
      type: 'Polygon',
      style: new olStyle.Style({
        fill: new olStyle.Fill({
          // color: 'rgba(255, 255, 255, 0.2)'
          color: 'rgba(255, 255, 255, 0.8)'
        }),
        stroke: new olStyle.Stroke({
          color: '#1890ff',
          width: 2
        })
      })
    });
    this.map.addInteraction(this.draw);
    this.snap = new Snap({ source: this.drawSource });
    this.map.addInteraction(this.snap);

    this.draw.on('drawend', e => {
      // @ts-ignore
      const val = e.feature.getGeometry().getCoordinates();
      this.drawVal.next(val);
      this.map.removeInteraction(this.draw);
      // this.map.removeInteraction(draw);
    });
    this.modify.on('modifyend', e => {
      // @ts-ignore
      // const val = e.features.item(0).getGeometry().getCoordinates()[0];
      const val = e.features.item(0).getGeometry().getCoordinates();
      this.modifyVal.next(val);
      this.map.removeInteraction(this.modify);
    });
  }

  flyToSelectStack(v: any) {
    let polygonData = JSON.parse(v.polygonPoints);
    console.log(polygonData);
    const vectorSourceOld = new VectorSource();
    const polygon = new olGeom.Polygon(polygonData);
    const feature = new Feature({
      type: 'polygon',
      geometry: polygon,
      item: v
    });
    vectorSourceOld.addFeature(feature);
    this.selectedGridLayer = new VectorLayer({
      source: vectorSourceOld,
      style: new olStyle.Style({
        fill: new olStyle.Fill({
          color: 'rgba(0, 255, 0, 0.4)'
        }),
        stroke: new olStyle.Stroke({
          color: '#0000FF',
          width: 1
        })
      })
    });
    this.map.addLayer(this.selectedGridLayer);
    this.onFocus(feature.getGeometry().getExtent());
  }

  flyToYard(yardCode: any) {
    if (this.map) {
      const queryParamsGoodsyard = new GetFeaturesBySQLParameters({
        queryParameter: {
          name: '堆场场位@SGSZTSJ',
          attributeFilter: `CKBH='${yardCode}'`
        },
        datasetNames: ['SGSZTSJ:堆场场位'],
        toIndex: -1,
        maxFeatures: -1
      });
      this.featureService.getFeaturesBySQL(queryParamsGoodsyard, res => {
        console.log(res);
        if (res.error) {
          return;
        }
        if (res.result.features) {
          // const areas = new olFormat.GeoJSON().readFeatures(res.result.features)[0]['values_'];
          const polygonData = res.result.features.features[0].geometry.coordinates[0];
          const vectorSourceOld = new VectorSource();
          const polygon = new olGeom.Polygon(polygonData);
          const feature = new Feature({
            type: 'polygon',
            geometry: polygon
          });
          vectorSourceOld.addFeature(feature);
          if (this.yardGridLayer) {
            this.map.removeLayer(this.yardGridLayer);
          }
          this.yardGridLayer = new VectorLayer({
            source: vectorSourceOld,
            style: new olStyle.Style({
              // fill: new olStyle.Fill({
              //   color: 'rgba(0, 255, 0, 0.4)'
              // }),
              stroke: new olStyle.Stroke({
                color: '#0000FF',
                width: 2,
                lineDash: [20, 27]
              })
            })
          });
          this.map.addLayer(this.yardGridLayer);

          const vectorSource = new olSource.Vector({
            features: new olFormat.GeoJSON().readFeatures(res.result.features),
            wrapX: false
          });
          this.map.getView().setZoom(9);
          this.onFocus(vectorSource.getExtent());
        }
      });
    }
  }

  onFocus(extent: any): void {
    console.log(olExtent.getCenter(extent));
    console.log(extent);
    this.map.getView().animate({
      duration: 850,
      center: olExtent.getCenter(extent)
      // center: [ 117.766945, 38.984169 ],
    });
  }

  findFeature(): void {
    if (this.features && this._stackId) {
      const selected = this.features.filter(i => {
        return i.values_.id === this._stackId;
      });

      if (selected.length > 0) {
        this.onFocus(selected[0].values_.geometry.extent_);
      }
    }
  }

  renderVideosNotTime() {
    // alert('salim');
    const features = [];
    this._videos.forEach(e => {
      features.push(
        new Feature({
          geometry: new olGeom.Point([e?.longitude, e?.latitude]),
          id: e?.id,
          videoNo: e?.videoNo
          // name: e?.name,
          // sel: e?.sel
        })
      );
    });
    this.defLayer.setSource(
      new olSource.Vector({
        features
      })
    );
  }

  renderVideos(): void {
    const features = [];
    this._videos.forEach(e => {
      const item = {
        id: e?.id,
        videoNo: e?.videoNo
      };
      features.push(
        new Feature({
          geometry: new olGeom.Point([e?.longitude, e?.latitude]),
          item
        })
      );
    });
    this.defLayer.setSource(
      new olSource.Vector({
        features
      })
    );
  }
}
