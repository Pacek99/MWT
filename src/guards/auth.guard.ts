import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersServerService } from 'src/services/users-server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private userServerService: UsersServerService, private router: Router ){}
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.canAnything(route.path)
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.canAnything(state.url)
  }
  
  canAnything(url: string):  boolean |  Observable<boolean>{
    if(this.userServerService.token){
      return true
    }
    this.userServerService.redirectAfterLogin = url
    this.router.navigateByUrl('/login')
    return false
  }
}
  
