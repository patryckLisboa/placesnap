import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AndressaComponent } from './components/apresentacao/andressa/andressa.component';
import { BrunoComponent } from './components/apresentacao/bruno/bruno.component';

const routes: Routes = [
  { path: 'andressa', component: AndressaComponent },
  { path: 'bruno', component: BrunoComponent },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
