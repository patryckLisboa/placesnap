import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AndressaComponent } from './components/apresentacao/andressa/andressa.component';
import { BrunoComponent } from './components/apresentacao/bruno/bruno.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'andressa', component: AndressaComponent },
  { path: 'bruno', component: BrunoComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
