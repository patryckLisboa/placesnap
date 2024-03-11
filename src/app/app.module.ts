import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe o FormsModule
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

// import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { AndressaModule } from './components/apresentacao/andressa/andressa.module';
import { MessagingModule } from '@angular/fire/messaging';
import { PMessageComponent } from './shared/components/p-message/p-message.component';
import { HomeModule } from './components/home/home.module';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [AppComponent, PMessageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    AndressaModule,
    HomeModule,
    MessagingModule,
    MatDialogModule
  ],
  providers: [provideAnimationsAsync(), AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
