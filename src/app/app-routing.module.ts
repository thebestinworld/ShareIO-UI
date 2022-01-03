import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDataUploadComponent } from './file-data-upload/file-data-upload.component';
import { FileComponent } from './file/file.component';
import { FileViewComponent } from './file-view/file-view.component';
import { FileUpdateComponent } from './file-update/file-update.component';
import { ShareFileComponent } from './share-file/share-file.component';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { ReminderCreateComponent } from './reminder-create/reminder-create.component';
import { ReminderComponent } from './reminder/reminder.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'file/upload', component: FileUploadComponent },
  { path: 'file/upload/data', component: FileDataUploadComponent },
  { path: 'file', component: FileComponent },
  { path: 'file/:id', component: FileViewComponent },
  { path: 'file/:id/update', component: FileUpdateComponent },
  { path: 'file/:id/share', component: ShareFileComponent },
  { path: 'notification', component: NotificationViewComponent },
  { path: 'reminder/create', component: ReminderCreateComponent },
  { path: 'reminder', component: ReminderComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }