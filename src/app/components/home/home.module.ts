import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe o FormsModule
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { UserpageComponent } from './userpage/userpage.component';
import { ContentlocationComponent } from './userpage/contentlocation/contentlocation.component';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ContentcreatedComponent } from './userpage/contentcreated/contentcreated.component';
import { PerfileditComponent } from './userpage/perfiledit/perfiledit.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    UserpageComponent,
    ContentlocationComponent,
    ContentcreatedComponent,
    PerfileditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatMenuModule,
    MatIconModule
  ],
})
export class HomeModule {}
