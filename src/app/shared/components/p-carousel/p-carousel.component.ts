import { Component, ViewEncapsulation } from '@angular/core';
import Swiper from 'swiper';
import { PaginationOptions } from 'swiper/types/modules/pagination';
import { SwiperOptions } from 'swiper/types/swiper-options';
// import SwiperCore, { Navigation, Pagination, EffectCoverflow } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
// SwiperCore.use([Navigation, Pagination, EffectCoverflow]);

@Component({
  selector: 'app-p-carousel',
  templateUrl: './p-carousel.component.html',
  styleUrls: ['./p-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PCarouselComponent {
  imgIndex = 1;
  imgModalIndex = 0;
  loadingPage = true;
  coverFlowEffect = {
    rotate: 30,
    stretch: 0,
    depth: window.innerWidth < 750 ? 300 : 0,
    modifier: 1,
    slideShadows: true,
  };

  ngAfterViewInit() {
    setTimeout(() => (this.loadingPage = false), 0);
  }

  toggleImageModal(index: any = null): any {
    if (index || index == 0) {
      this.imgModalIndex = index;
      return (this.imagens[index].expanded = true);
    }
    this.imagens[this.imgModalIndex].expanded = false;
  }

  imagens = [
    {
      index: 1,
      src: '../../../../assets/img/andressa/evolutions/img (1).jpeg',
      description: '6 meses',
      expanded: false,
    },
    {
      index: 2,
      src: '../../../../assets/img/andressa/evolutions/img (2).jpeg',
      description: '2 meses',
      expanded: false,
    },
    {
      index: 3,
      src: '../../../../assets/img/andressa/evolutions/img (3).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 4,
      src: '../../../../assets/img/andressa/evolutions/img (4).jpeg',
      description: '1 mês',
      expanded: false,
    },
    {
      index: 5,
      src: '../../../../assets/img/andressa/evolutions/img (5).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 6,
      src: '../../../../assets/img/andressa/evolutions/img (6).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 7,
      src: '../../../../assets/img/andressa/evolutions/img (7).jpeg',
      description: '2 meses',
      expanded: false,
    },
    {
      index: 8,
      src: '../../../../assets/img/andressa/evolutions/img (8).jpeg',
      description: '2 meses',
      expanded: false,
    },
    {
      index: 9,
      src: '../../../../assets/img/andressa/evolutions/img (9).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 10,
      src: '../../../../assets/img/andressa/evolutions/img (10).jpeg',
      description: '4 meses',
      expanded: false,
    },
    {
      index: 11,
      src: '../../../../assets/img/andressa/evolutions/img (11).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 12,
      src: '../../../../assets/img/andressa/evolutions/img (12).jpeg',
      description: '1 mês',
      expanded: false,
    },
    {
      index: 13,
      src: '../../../../assets/img/andressa/evolutions/img (13).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 14,
      src: '../../../../assets/img/andressa/evolutions/img (14).jpeg',
      description: '5 meses',
      expanded: false,
    },
    {
      index: 15,
      src: '../../../../assets/img/andressa/evolutions/img (15).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 16,
      src: '../../../../assets/img/andressa/evolutions/img (16).jpeg',
      description: '3 meses',
      expanded: false,
    },
    {
      index: 17,
      src: '../../../../assets/img/andressa/evolutions/img (17).jpeg',
      description: '5 meses',
      expanded: false,
    },
    {
      index: 18,
      src: '../../../../assets/img/andressa/evolutions/img (18).jpeg',
      description: '1 ano',
      expanded: false,
    },
    {
      index: 19,
      src: '../../../../assets/img/andressa/evolutions/img (19).jpeg',
      description: '1 mês',
      expanded: false,
    },
    {
      index: 20,
      src: '../../../../assets/img/andressa/evolutions/img (20).jpeg',
      description: '4 meses',
      expanded: false,
    },
    {
      index: 21,
      src: '../../../../assets/img/andressa/evolutions/img (21).jpeg',
      description: '5 meses',
      expanded: false,
    },
    {
      index: 22,
      src: '../../../../assets/img/andressa/evolutions/img (22).jpeg',
      description: '8 meses',
      expanded: false,
    },
    {
      index: 23,
      src: '../../../../assets/img/andressa/evolutions/img (23).jpeg',
      description: '4 meses',
      expanded: false,
    },
    {
      index: 24,
      src: '../../../../assets/img/andressa/evolutions/img (24).jpeg',
      description: '4 meses',
      expanded: false,
    },
    {
      index: 25,
      src: '../../../../assets/img/andressa/evolutions/img (25).jpeg',
      description: '4 meses',
      expanded: false,
    },
    {
      index: 26,
      src: '../../../../assets/img/andressa/evolutions/img (26).jpeg',
      description: '4 meses',
      expanded: false,
    },
  ];

  getImgDescription(): string {
    return this.loadingPage ? '' : this.imagens[this.imgIndex].description;
  }

  onSlideChange(event: any) {
    this.imgIndex = event[0].activeIndex;
  }
}
