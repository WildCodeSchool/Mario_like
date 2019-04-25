import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService, MapTheme } from '../map.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {


  map = []



  constructor(public mapService: MapService, private mapTheme: MapTheme) {

  }



  initMap(): void {
    this.map = this.mapService.getMap();

  }

  @ViewChild('audioOption') audioPlayerRef: ElementRef;

  onAudioPlay() {
    this.audioPlayerRef.nativeElement.play();
  }



  ngOnInit() {
    this.initMap();
    this.onAudioPlay();
  }

}


