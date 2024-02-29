import { Component, ViewEncapsulation } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import Swiper from 'swiper';
import { PaginationOptions } from 'swiper/types/modules/pagination';
import SwiperCore, {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Navigation, Pagination, EffectCoverflow, Autoplay]);

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
    depth: 0,
    modifier: 1,
    slideShadows: true,
  };
  // swiperOptions: SwiperOptions = {
  //   effect: 'coverflow',
  //   grabCursor: true,
  //   centeredSlides: true,
  //   slidesPerView: 'auto',
  //   initialSlide: 5,
  // };

  ngAfterViewInit() {
    setTimeout(() => (this.loadingPage = false), 0);
  }

  toggleImageModal(index: any = null): any {
    console.log("terste")
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
    // {
    //   index: 2,
    //   src: '../../../../assets/img/andressa/evolutions/img (2).jpg',
    //   description: '2 meses',
    //   expanded: false,
    // },
    {
      index: 2,
      src: '../../../../assets/img/andressa/evolutions/img (2).jpg',
      description: '4 meses',
      expanded: false,
    },
    {
      index: 3,
      src: '../../../../assets/img/andressa/evolutions/img (3).jpeg',
      description: '4 meses',
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
      src: '../../../../assets/img/andressa/evolutions/img (16).jpg',
      description: '4 meses',
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
      description: '5 meses',
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
  ];

  getImgDescription(): string {
    return this.loadingPage ? '' : this.imagens[this.imgIndex].description;
  }

  onSlideChange(event: any) {
    this.imgIndex = event[0].activeIndex;
  }

  getExpandedImgUrl() {
    return this.imagens[this.imgModalIndex].src;
  }

  handleButton(prop = '') {
    if (prop == 'next') {
      if(this.imgModalIndex > 19){
        // this.disabledNextClass(true)
        // this.disabledPrevClass()
        return
      }
      // this.disabledPrevClass()
      // this.disabledNextClass()
      this.imagens[this.imgModalIndex].expanded = false
      this.imgModalIndex++;
      return (this.imagens[this.imgModalIndex].expanded = true);
    }
    if(this.imgModalIndex < 1){
      // this.disabledPrevClass(true)
      // this.disabledNextClass()
      return
    }
    // this.disabledNextClass()
    // this.disabledPrevClass()
    this.imagens[this.imgModalIndex].expanded = false
    this.imgModalIndex--;
    return (this.imagens[this.imgModalIndex].expanded = true);
  }

  prevClass = 'swiper-button-prev'
  disabledPrevClass(desabilitado = false){
    if(desabilitado){
      return this.prevClass = 'swiper-button-prev disabled'
    }
    return this.prevClass = 'swiper-button-prev'
  }

  nextClass = 'swiper-button-next'
  disabledNextClass(desabilitado = false){
    if(desabilitado){
      return this.nextClass = 'swiper-button-next disabled'
    }
    return this.nextClass = 'swiper-button-next'
  }
}
