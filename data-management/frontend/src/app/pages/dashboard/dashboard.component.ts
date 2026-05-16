import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core'

import { CommonModule } from '@angular/common'

import { Router } from '@angular/router'

import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { ApiService } from '../../core/services/api'
import { AuthService } from '../../core/services/auth'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIcon } from '@angular/material/icon'
import { UmlautifyPipe } from '../../shared/pipes/umlautify-pipe'

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,

    UmlautifyPipe
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  private api = inject(ApiService)
  private auth = inject(AuthService)
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef)

  projects: any[] = []

  ngOnInit(): void {
    this.loadProjects()
  }

  loadProjects() {

    this.api.getProjects().subscribe({

      next: (res) => {

        console.log('SUCCESS RESPONSE:', res)

        this.projects = res
        this.cdr.detectChanges()
      },

      error: (err) => {

        console.log('ERROR RESPONSE:', err)

        console.error(err)
      }
    })
  }

  openFile(
    project: string,
    file: string
  ) {

    this.router.navigate([
      '/editor',
      project,
      file
    ])
  }

  logout() {

    this.auth.logout()
  }
}