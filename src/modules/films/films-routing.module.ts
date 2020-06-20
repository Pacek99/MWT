import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilmsMenuComponent } from './films-menu/films-menu.component';
import { FilmEditComponent } from './film-edit/film-edit.component';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { FilmResolverService } from 'src/guards/film-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: FilmsMenuComponent,
    children: [
      { path: 'edit/:id', component: FilmEditComponent, 
        resolve: {
          film: FilmResolverService
        } 
      },
      { path: '', 
        component: FilmsListComponent, 
        children: [
          { path: ':id', component: FilmDetailComponent }
        ]
      }
      
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
