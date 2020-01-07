import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  imgSrc = '../../../assets/img/banner_light.jpg';
  @Input() bannerContent: string;

  constructor() { }

  ngOnInit() {
  }
}
