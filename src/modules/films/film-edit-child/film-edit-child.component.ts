import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SystemJsNgModuleLoader } from '@angular/core';
import { Film } from 'src/entities/film';
import { FormGroup, FormControl, AsyncValidatorFn, ValidationErrors, Validators, FormArray } from '@angular/forms';
import { FilmsServerService } from 'src/services/films-server.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Postava } from 'src/entities/postava';
import { Clovek } from 'src/entities/clovek';

@Component({
  selector: 'app-film-edit-child',
  templateUrl: './film-edit-child.component.html',
  styleUrls: ['./film-edit-child.component.css']
})
export class FilmEditChildComponent implements OnChanges {

  @Input() film:Film
  @Output() changed = new EventEmitter<Film>()
  reziser:Clovek[]
  postava:Postava[]
  

  hide:boolean = true
  filmEditForm = new FormGroup({
    nazov: new FormControl('', [Validators.required,Validators.minLength(3)]),
    rok: new FormControl('', [Validators.required,Validators.min(1000)]),
    imdbID: new FormControl(''),
    slovenskyNazov: new FormControl(''),
    afi1998: new FormControl(''),
    afi2007: new FormControl(''),

    //reziser: new FormArray([]),
    //postava: new FormArray([])
  })

  constructor(private filmsServerService: FilmsServerService, private router: Router) { }

  ngOnChanges(): void {
    if(this.film){
      this.nazov.setValue(this.film.nazov)
      this.rok.setValue(this.film.rok)
      this.imdbID.setValue(this.film.imdbID)
      this.slovenskyNazov.setValue(this.film.slovenskyNazov)
      this.afi1998.setValue(this.film.poradieVRebricku["AFI 1998"]?this.film.poradieVRebricku["AFI 1998"]:null)
      this.afi2007.setValue(this.film.poradieVRebricku["AFI 2007"]?this.film.poradieVRebricku["AFI 2007"]:null)
    }
  }

  get nazov(){
    return this.filmEditForm.get('nazov') as FormControl
  }

  get rok(){
    return this.filmEditForm.get('rok') as FormControl
  }

  get imdbID(){
    return this.filmEditForm.get('imdbID') as FormControl
  }

  get slovenskyNazov(){
    return this.filmEditForm.get('slovenskyNazov') as FormControl
  }

  get afi1998(){
    return this.filmEditForm.get('afi1998') as FormControl
  }

  get afi2007(){
    return this.filmEditForm.get('afi2007') as FormControl
  }

  stringify(text: string){
    return JSON.stringify(text)
  }

  formSubmit(){
    //debugger;
    console.log("Zaciatok logu film edit child");
    //console.log(", Nazov: " + this.film.nazov + ", Rok: " + this.film.rok);
    let poradieVRebricku: {[title: string]: number}
    if (this.afi1998.value && this.afi2007.value) {
      poradieVRebricku = {'AFI 1998': this.afi1998.value, 'AFI 2007': this.afi2007.value}
    } else if(this.afi1998.value){
      poradieVRebricku = {'AFI 1998': this.afi1998.value}
    } else {
      poradieVRebricku = {'AFI 2007': this.afi2007.value}
    }
    const film = new Film(
      this.nazov.value,
      this.rok.value,
      //this.film.id,
      2,
      this.imdbID.value,
      this.slovenskyNazov.value,
      poradieVRebricku,
      //this.film.reziser,
      undefined,
      //this.film.postava)
      undefined)
    this.changed.next(film)
  }

}