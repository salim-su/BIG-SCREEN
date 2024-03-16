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
import { NzMessageService } from 'ng-zorro-antd/message';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import * as olControl from 'ol/control';
import { click } from 'ol/events/condition';
import * as olExtent from 'ol/extent';
import * as olFormat from 'ol/format';
import * as olGeom from 'ol/geom';
import { Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import * as olLayer from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import * as olSource from 'ol/source';
import VectorSource from 'ol/source/Vector';
import * as olStyle from 'ol/style';
import { Fill, Stroke, Style } from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Observable, zip } from 'rxjs';
// import { Select } from 'ol/interaction';

// import { Draw, Modify, Snap } from 'ol/interaction';

@Directive({
  selector: '[appMapPanel2]'
})
export class MapPanelBack1Directive {
  private url = 'http://dlxx.tpitc.cn:32636/portalproxy/iserver/services/LightGray/rest/maps/TJVMap_LightGray';
  private yardUrl = 'http://dlxx.tpitc.cn:32636/portalproxy/iserver/services/map-SGSZTSJ/rest/maps/SGSZTSJ';
  private dataUrl = 'http://dlxx.tpitc.cn:32636/portalproxy/iserver/services/data-SGSZTSJ/rest/data';
  private key = 'QtOGjgHlhuTIf5fjaHGmL9nu';

  private map = null;
  private baseLayers = {
    normal: [],
    earth: []
  };
  private defLayer = null;
  private blankLayers = null;
  private features: any[] = null;
  private _videos = [];
  private _stackId: any = null;
  private _yardCode: any = null;
  private _polygonPoints: any = null;
  private _baseMapType: any = null; // normal earth
  /*拖拽用例*/
  private draw: any;
  private snap: any;
  private modify: any;
  private drawSource: any;
  private drawVector: any;
  private gridLayer: any;
  private highlightLayer: any;

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
  readonly modifyVal = new EventEmitter();
  @Output()
  readonly drawVal = new EventEmitter();
  @Output()
  readonly selectMap = new EventEmitter();
  interval = null;
  selPoint = 1;
  featureService: any;

  constructor(private el: ElementRef, private msg: NzMessageService, private httpClient: _HttpClient) {
    SecurityManager.registerKey(this.yardUrl, this.key);
    SecurityManager.registerKey(this.dataUrl, this.key);
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
        center: [117.76043177000665, 38.98405748458564],
        zoom: 7.5,
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
        // projection: 'EPSG:4326'
      });
      this.map.addLayer(baseMapPOI);
      //
      // let overlay = null;
      // if (this.popupId) {
      //   const ele = document.getElementById(this.popupId);
      //   overlay = new Overlay({
      //     element: ele,
      //     autoPan: true
      //     // autoPanAnimation: {
      //     //   duration: 250
      //     // }
      //   });
      //   this.map.addOverlay(overlay);
      // }
      //
      // this.blankLayers = new olLayer.Vector({
      //   source: new olSource.Vector(),
      //   zIndex: 999,
      //   style: (v: any) => {
      //     console.log(v);
      //   }
      // });
      // this.map.addLayer(this.blankLayers);
      this.map.on('singleclick', e => {
        // let pixel = this.map.getEventPixel(e.originalEvent);
        // let hit = this.map.hasFeatureAtPixel(pixel, {
        //   layerFilter: function (layer) {
        //     return layer.get('type') === 'LabelsLayer';
        //   }
        // });

        const features = this.map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
        console.log(features);

        // if (features.length === 1) {

        // }

        // if (features.length) {
        //   this.selPoint = features[0].values_.id;
        //   this.clickMap.next(features[0].values_);
        // }
      });
      this.loadRecordBulk();
    });
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
      console.log(mapInfo);
      console.log(this._polygonPoints);
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
          vectorSource.addFeature(feature);
        });
        let gridLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            fill: new Fill({
              color: 'rgba(228, 178, 92, 0.8)'
              // color: '#E4B25C'
            }),
            stroke: new Stroke({
              color: 'red',
              width: 1,
              lineDash: [20, 10, 20, 10]
            })
          })
        });
        this.map.addLayer(gridLayer);
        this.mapFeatureSelect();
      }
    });
  }

  mapFeatureSelect() {
    // const selected = new Style({
    //   fill: new Fill({
    //     color: '#eeeeee'
    //   }),
    //   stroke: new Stroke({
    //     color: 'rgba(255, 255, 255, 0.7)',
    //     width: 2
    //   })
    // });
    //
    // function selectStyle(feature) {
    //   const color = feature.get('COLOR') || '#eeeeee';
    //   selected.getFill().setColor(color);
    //   return selected;
    // }

    const selectClick = new Select({
      condition: click
      // style: selectStyle
    });
    this.map.addInteraction(selectClick);
    selectClick.on('select', e => {
      // console.log(e);
      if (e.selected[0]) {
        const val = e.selected[0]['values_'].item;
        this.selectMap.next(val);
      }
    });
  }

  drawReset() {
    if (this.drawVector) {
      this.drawVector.getSource().clear();
    }
    if (this.gridLayer) {
      this.gridLayer.getSource().clear();
    }
    // this.draw = new Draw({
    //   source: this.drawSource,
    //   type: 'Polygon'
    // });
    // this.map.addInteraction(this.draw);
    // this.snap = new Snap({ source: this.drawSource });
    // this.map.addInteraction(this.snap);
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
          width: 1
        })
      })
    });
    setTimeout(res => {
      this.map.addLayer(this.gridLayer);
    }, 1000);
  }

  drawInit() {
    /*拖拽用例*/
    this.drawSource = new VectorSource();
    this.drawVector = new VectorLayer({
      source: this.drawSource,
      style: new olStyle.Style({
        fill: new olStyle.Fill({
          // color: 'rgba(255, 255, 255, 0.2)'
          color: 'rgba(255, 255, 255, 0.8)'
        }),
        stroke: new olStyle.Stroke({
          color: '#ffcc33',
          width: 3
        })
      })
    });
    this.map.addLayer(this.drawVector);
    this.modify = new Modify({ source: this.drawSource });
    this.map.addInteraction(this.modify);

    this.draw = new Draw({
      source: this.drawSource,
      type: 'Polygon'
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
    });
  }

  createLabelStyle(feature: any): any {
    return new olStyle.Style({
      image: new olStyle.Icon({
        anchor: [40, 42],
        scale: 0.5, // 图标缩小显示
        anchorOrigin: 'top-right', // 标注样式的起点位置
        anchorXUnits: 'pixels', // X方向单位：分数
        anchorYUnits: 'pixels', // Y方向单位：像素
        offsetOrigin: 'bottom-left', // 偏移起点位置的方向
        opacity: 1, // 透明度
        src: './assets/img/map-person.svg' // 图标的URL
      }),
      text: new olStyle.Text({
        textAlign: 'center', // 位置
        textBaseline: 'middle', // 基准线
        font: 'normal 14px 微软雅黑', // 文字样式
        fill: new olStyle.Fill({
          // 文本填充样式(即文字颜色)
          color: '#000'
        }),
        stroke: new olStyle.Stroke({
          color: '#F00',
          width: 2
        })
      })
    });
  }

  flyToYard(yardCode: any) {
    console.log(yardCode);
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
          const areas = new olFormat.GeoJSON().readFeatures(res.result.features)[0]['values_'];
          const vectorSource = new olSource.Vector({
            features: new olFormat.GeoJSON().readFeatures(res.result.features),
            wrapX: false
          });
          this.onFocus(vectorSource.getExtent());
        }
      });
    }
  }

  onFocus(extent: any): void {
    console.log(olExtent.getCenter(extent));
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
    // console.log(this._videos);
    // console.log(this.defLayer);

    setTimeout(res => {
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
    }, 1000);
  }
}
