import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-andressa',
  templateUrl: './andressa.component.html',
  styleUrls: ['./andressa.component.scss'],
})
export class AndressaComponent {
  larguraTela = window.innerWidth;

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if(this.larguraTela < 350){
      return this.larguraTela / 350;
    }
    return 1
  }


  // animações de hidden 

  openingObserver: any = null;
  openingRightObserver: any = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.initHiddenAnimations();
  }


  initHiddenAnimations() {
    this.openingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      { threshold: [0, 1] }
    );
    this.openingRightObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-right');
        } else {
          entry.target.classList.remove('show-right');
        }
      });
    });
    const elements = this.elementRef.nativeElement.querySelectorAll('.hidden');
    const elementsRight =
      this.elementRef.nativeElement.querySelectorAll('.hidden-right');

    elements.forEach((element: any) => {
      this.openingObserver.observe(element);
    });
    elementsRight.forEach((element: any) => {
      this.openingRightObserver.observe(element);
    });
  }

  ngOnDestroy(): void {
    if (this.openingObserver) {
      this.openingObserver.disconnect();
    }
    if (this.openingRightObserver) {
      this.openingRightObserver.disconnect();
    }
  }
}
