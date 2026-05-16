import { Routes } from '@angular/router'

import { LoginComponent } from './pages/login/login'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { EditorComponent } from './pages/editor/editor'

import { authGuard } from './core/guards/auth-guard'

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'editor/:project/:file',
    component: EditorComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }
]