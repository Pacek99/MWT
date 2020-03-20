import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UsersServerService } from 'src/services/users-server.service';
import { User } from 'src/entities/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  
  users: User[] = []
  dataSource = new MatTableDataSource<User>() 
  columnsToDisplay = ['id','name','email','lastLogin','groups', 'permissions', 'action']
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  
  constructor(private usersService: UsersServerService, private dialog: MatDialog) {}

  deleteUser(user: User){
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data: {
      title: 'Deleting user',
      message: 'Delete user ' + user.name + '?'
    }})
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.usersService.deleteUser(user.id).subscribe(
          ok => {
            if(ok){
              this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id)
            }
          }
        )
      }
    })    
  }

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(users => (
      this.users = users
    ))
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.usersService.getExtendedUsers().subscribe(users => {
      this.dataSource.data = users
      this.paginator.length = users.length
    })
    this.dataSource.sortingDataAccessor = (user: User, headerName:string) => {
      switch (headerName) {
        case 'groups':
          return user.groups[0] ? user.groups[0].name : ''      
        default:
          return user[headerName]
      }
    }
    this.dataSource.filterPredicate = (user:User, filter:string) => {
      if(user.name.toLowerCase().includes(filter)){
        return true
      }
      for(let group of user.groups){
        if(group.permissions.some(perm => perm.toLowerCase().includes(filter))){
          return true
        }
        if(group.name.toLowerCase().includes(filter)){
          return true
        }
      }
      return false
    }
    
  }

  applyFilter(value:string){
    this.dataSource.filter = value.trim().toLowerCase()
    this.paginator.firstPage()
  }
}
