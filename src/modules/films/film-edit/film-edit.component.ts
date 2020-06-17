import { Component, OnInit } from '@angular/core';
import { CanDeactivate, ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';
import { Film } from 'src/entities/film';
import { FilmsServerService } from 'src/services/films-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css']
})
export class FilmEditComponent implements OnInit, CanDeactivateComponent {

  filmToEdit: Film 
  filmSaved = false

  constructor(private route: ActivatedRoute, 
    private filmsServerService: FilmsServerService,
    private router: Router,
    private dialog: MatDialog) { }
    

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.filmSaved = false
      this.filmToEdit = data.film
    })      
  }

  saveFilm(film: Film){
    this.filmsServerService.saveFilm(film).subscribe(
      () => {
        this.router.navigateByUrl('/films')
        this.filmSaved = true
      })
  }

  canDeactivate():Observable<boolean> | boolean {
    if (this.filmSaved){
      return true 
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data: {
      title: 'Leaving?',
      message: 'Edited film is not saved, leave?'
    }})
    return dialogRef.afterClosed().pipe(map((result) => !!result))
  }

}
