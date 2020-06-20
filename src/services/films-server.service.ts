import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Film } from 'src/entities/film';
import { Observable, EMPTY, throwError } from 'rxjs';
import { UsersServerService } from './users-server.service';
import { tap, catchError } from 'rxjs/operators';
import { Clovek } from 'src/entities/clovek';
import { Postava } from 'src/entities/postava';

@Injectable({
  providedIn: 'root'
})
export class FilmsServerService {

  url = 'http://localhost:8080/'

  constructor(private http: HttpClient, private usersServerService: UsersServerService) { }

  get token() {
    return this.usersServerService.token
  }
  private getHeader(): {
    headers?: {'X-Auth-Token': string}
    params?: HttpParams}
    {
    return this.token ? { headers: {'X-Auth-Token': this.token}} : undefined
  }

  getFilms(
    indexFrom?:number, 
    indexTo?:number, 
    search?: string,
    orderBy?: string,
    descending?: boolean
    ): Observable<FilmsResponse>{
    let httpOptions = this.getHeader()
    if(indexFrom || indexTo || search){
      httpOptions = {...(httpOptions) || {} , params: new HttpParams()}
    }
    if(indexFrom){
      httpOptions.params = httpOptions.params.set('indexFrom', ''+indexFrom)
    }
    if(indexTo){
      httpOptions.params = httpOptions.params.set('indexTo', ''+indexTo)
    }
    if(search){
      httpOptions.params = httpOptions.params.set('search', search)
    }
    if(orderBy){
      httpOptions.params = httpOptions.params.set('orderBy', orderBy)
    }
    if(descending){
      httpOptions.params = httpOptions.params.set('descending', '' + descending)
    }
    return this.http.get<FilmsResponse>(this.url + 'films/',httpOptions)
    .pipe(tap(resp => console.log(resp)))
  }
  
  saveFilm(film: Film): Observable<Film>{
    return this.http.post<Film>(this.url + 'films/' + this.token, film)
    .pipe(catchError(error => this.processHttpError(error)))
  }
  
  private processHttpError(error){
    if (error instanceof HttpErrorResponse && error.status === 401){
      return EMPTY //zle heslo
    }
    return throwError(error) //ina chyba
  }

  getFilm(id:number): Observable<Film>{
    let httpOptions = this.getHeader()
    return this.http.get<Film>(this.url + 'films/' + id,httpOptions).pipe(catchError(error => this.processHttpError(error)))
  }

  getMockEditFilm(): Film{
    let reziser1 = new Clovek("Reziser1Priezvisko", "Reziser1KrstneMeno", "Reziser1StredneMeno",1)
    let reziser2 = new Clovek("Reziser2Priezvisko", "Reziser2KrstneMeno", "Reziser2StredneMeno",2)
    let postava1 = new Postava("Postava1", "hlavná postava", new Clovek("Herec1Priezvisko", "Herec1KrstneMeno", "Herec1StredneMeno",3))    
    let postava2 = new Postava("Postava2", "vedľajšia postava", new Clovek("Herec2Priezvisko", "Herec2KrstneMeno", "Herec2StredneMeno",4))
    return new Film("NazovFilmu", 2020, 2, "imbdID", "SlovenskyNazovFilmu",{'AFI 1998': 10, 'AFI 2007': 20},[reziser1,reziser2],[postava1,postava2])
  }
 
}

export interface FilmsResponse {
    items: Film[]
    totalCount: number
  }