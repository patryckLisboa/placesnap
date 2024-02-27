import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe o FormsModule
import { MatButtonModule } from '@angular/material/button';
import { AndressaComponent } from './andressa.component';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { PCarouselComponent } from '../../../shared/components/p-carousel/p-carousel.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [AndressaComponent, FirstComponent, SecondComponent, PCarouselComponent],
  imports: [
    BrowserModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    SwiperModule
  ],
})
export class AndressaModule {}
