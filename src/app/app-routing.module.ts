import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './systems/dashboard/dashboard.component';
import { LoginComponent } from './systems/login/login.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'system',
    component: DashboardComponent,
    loadChildren: () => import('./systems/system.module').then((m) => m.SystemsModule),
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
