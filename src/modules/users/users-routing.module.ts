import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { UserResolverService } from 'src/guards/user-resolver.service';
import { AddUserComponent } from './add-user/add-user.component';


const routes: Routes = [
  { path: 'edit/:id', component: EditUserComponent, canActivate:[AuthGuard], canDeactivate:[CanDeactivateGuard],
    resolve: {
      user: UserResolverService
    }},
  { path: 'add', component: AddUserComponent, canActivate:[AuthGuard] },  
  { path: 'extended', component: ExtendedUsersComponent, canActivate:[AuthGuard]},
  { path: 'simple', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
