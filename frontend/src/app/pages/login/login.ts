import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'

import { AuthService } from '../../core/services/auth'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  private auth = inject(AuthService)
  private router = inject(Router)

  username = ''
  password = ''

  login() {

    this.auth.login(
      this.username,
      this.password
    ).subscribe({

      next: (res) => {

        this.auth.saveToken(res.token)

        this.router.navigate(['/'])
      },

      error: () => {
        alert('Login fehlgeschlagen')
      }
    })
  }
}