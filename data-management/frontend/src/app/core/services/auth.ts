import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient)
  private router = inject(Router)

  private API = 'http://localhost:3000/api/auth'

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