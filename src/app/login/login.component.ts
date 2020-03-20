import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/entities/auth';
import { UsersServerService } from 'src/services/users-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  auth: Auth = new Auth()
  hide: boolean = true

  constructor(
    private usersServerService: UsersServerService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  get vypisAuth(): string {
    return JSON.stringify(this.auth)
  }

  formSubmit() {
    this.usersServerService.login(this.auth).subscribe(
      ok => {
        this.router.navigateByUrl(this.usersServerService.redirectAfterLogin);
        this.usersServerService.redirectAfterLogin = "/users/extended"
      });
  }

}