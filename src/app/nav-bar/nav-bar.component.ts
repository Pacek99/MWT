import { Component, OnInit } from '@angular/core';
import { UsersServerService } from 'src/services/users-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  username:string = ''

  constructor(private userSereverService: UsersServerService, private router: Router) { }

  ngOnInit(): void {
    this.userSereverService.getCurrentUser().subscribe(username =>{
      this.username = username
    })
  }

  logout(){
    this.userSereverService.logout()
    this.router.navigateByUrl('/login')
  }

}
