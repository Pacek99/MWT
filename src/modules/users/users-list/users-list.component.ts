import { Component, OnInit } from '@angular/core';
import {User} from 'src/entities/user'
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users = [new User('Peter', 'peto@peto.sk'),new User('Jozo', 'jozo@peto.sk', 2, new Date('2020-01-17'))];

  selectedUser: User;

  columnsToDisplay = ['id','name','email'];

  constructor(private usersService: UsersServerService) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => (this.users = users),error => {
      window.alert('Mame chybu.' + JSON.stringify(error));
    });
  }

  selectUser(user: User){
    this.selectedUser = user;
  }
}
