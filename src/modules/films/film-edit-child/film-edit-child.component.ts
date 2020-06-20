import { Component, OnChanges, EventEmitter, Input, Output, SystemJsNgModuleLoader } from '@angular/core';
import { Film } from 'src/entities/film';
import { FormGroup, FormControl, AsyncValidatorFn, ValidationErrors, Validators, FormArray } from '@angular/forms';
import { FilmsServerService } from 'src/services/films-server.service';
import { Router } from '@angular/router';
import { Postava } from 'src/entities/postava';
import { Clovek } from 'src/entities/clovek';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';

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

    reziser: new FormArray([]),
    postava: new FormArray([])
  })

  constructor(private filmsServerService: FilmsServerService, private router: Router, private dialog: MatDialog) { }

  ngOnChanges(): void {    
    //mock
    //this.film = this.filmsServerService.getMockEditFilm()
    if(this.film){
      this.nazov.setValue(this.film.nazov)
      this.rok.setValue(this.film.rok)
      this.imdbID.setValue(this.film.imdbID)
      this.slovenskyNazov.setValue(this.film.slovenskyNazov)
      this.afi1998.setValue(this.film.poradieVRebricku["AFI 1998"]?this.film.poradieVRebricku["AFI 1998"]:null)
      this.afi2007.setValue(this.film.poradieVRebricku["AFI 2007"]?this.film.poradieVRebricku["AFI 2007"]:null)
      //z mock filmu
      this.reziser = this.film.reziser
      this.postava = this.film.postava

      for (let entry of this.reziser) {
        this.reziserArray.push(new FormGroup({ 
          priezvisko: new FormControl(entry.priezvisko),
          krstneMeno: new FormControl(entry.krstneMeno),
          stredneMeno: new FormControl(entry.stredneMeno)
        }))
      }
      for (let entry of this.postava) {
        this.postavaArray.push(new FormGroup({ 
          postava: new FormControl(entry.postava),
          dolezitost: new FormControl(entry.dolezitost),
          priezviskoPostava: new FormControl(entry.herec.priezvisko),
          krstneMenoPostava: new FormControl(entry.herec.krstneMeno),
          stredneMenoPostava: new FormControl(entry.herec.stredneMeno)
        }))
      }
    }
  }

  setExistingReziser() {
    throw new Error("Method not implemented.");
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

  get reziserArray() {
    return <FormArray>this.filmEditForm.get('reziser');
  }

  get postavaArray() {
    return <FormArray>this.filmEditForm.get('postava');
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
/*
  deleteReziser(clovek: Clovek){
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data: {
      title: 'Deleting reziser',
      message: 'Delete reziser ' + clovek.krstneMeno + ' ' + clovek.priezvisko + '?'
    }})
    
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.filmsServerService.deleteReziser(clovek.id).subscribe(
          ok => {
            if(ok){
              this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id)
            }
          }
        )
      }
    })  
  }*/  

  addReziser() {
    const clovek = new FormGroup({ 
      priezvisko: new FormControl(''),
      krstneMeno: new FormControl(''),
      stredneMeno: new FormControl('')
    })
    this.reziserArray.push(clovek);
  }

  deleteReziser(i){
    this.reziserArray.removeAt(i)
  }

  addPostava() {
    const postava = new FormGroup({ 
      postava: new FormControl(''),
      dolezitost: new FormControl(''),
      priezviskoPostava: new FormControl(''),
      krstneMenoPostava: new FormControl(''),
      stredneMenoPostava: new FormControl('')
    })
    this.postavaArray.push(postava);
  }

  deletePostava(i){
    this.postavaArray.removeAt(i)
  }

}