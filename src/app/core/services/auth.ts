import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient)
  private router = inject(Router)

 private API = `${environment.apiUrl}/auth`

  login(username: string, password: string) {

    return this.http.post<any>(
      `${this.API}/login`,
      {
        username,
        password
      }
    )
  }

  saveToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isLoggedIn() {
    return !!this.getToken()
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}