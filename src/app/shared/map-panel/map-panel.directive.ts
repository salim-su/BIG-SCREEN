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
  selector: '[appMapPanel]'
})
export class MapPanelDirective {
  private url = 'http://10.10.21.19:8090/iserver/services/map-mongodb-TJVMapvGDWZ2/rest/maps/TJVMap_vGDWZ';
  private yardUrl = 'http://10.10.21.19:8090/iserver/services/map-SGSZTSJVSGSGIS/rest/maps/SGSZTSJ';
  private dataUrl = 'http://10.10.21.19:8090/iserver/services/data-SGSZTSJVSGSGIS/rest/data';
  private key = 'QtOGjgHlhuTIf5fjaHGmL9nu';

  private map = null;


  @Output()
  readonly clickMap = new EventEmitter();

  constructor(private el: ElementRef, private msg: NzMessageService, private httpClient: _HttpClient) {
    this.initMap();
  }

  baseMapInfo(): Observable<any> {
    SecurityManager.registerKey(this.url, this.key);
    return new Observable<any>(x => {
      new MapService(this.url).getMapInfo(serviceResult => {
        x.next(serviceResult.result);
      });
    });
  }

  initMap(): void {
    zip(this.baseMapInfo()).subscribe(([ baseInfo ]) => {
      const resolutionSet = new Set();
      baseInfo.visibleScales.forEach(i => {
        resolutionSet.add((360 * 0.0254) / (baseInfo.dpi * 2 * Math.PI * baseInfo.prjCoordSys.coordSystem.datum.spheroid.axis) / i);
      });
      const resolutions = Array.from(resolutionSet) as any[];
      const view = new View({
        center: [ 117.7597638239499, 38.98271455834296 ],
        zoom: 8,
        resolutions,
        multiWorld: true,
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
            extent: [ baseInfo.bounds.left, baseInfo.bounds.bottom, baseInfo.bounds.right, baseInfo.bounds.top ],
            resolutions
          })
        })
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
            extent: [ baseInfo.bounds.left, baseInfo.bounds.bottom, baseInfo.bounds.right, baseInfo.bounds.top ],
            resolutions
          })
        })
      });
      this.map.addLayer(baseMapPOI);
      this.map.on('singleclick', e => {
        console.log(e['coordinate']);
        this.clickMap.next(e['coordinate']);
        const features = this.map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
        if (features.length) {
          this.clickMap.next(features[0].values_.item);
        }
        // this.clickMapVideo.next(e['coordinate']);
      });
    });
  }
}
