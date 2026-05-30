import {
  Injectable,
  inject
} from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment.prod'

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private http = inject(HttpClient)

  private API =
    `${environment.apiUrl}/projects`

  // Projekte laden
  getProjects() {

    return this.http.get<any[]>(
      this.API
    )
  }

  // Datei laden
  getFile(
    project: string,
    file: string
  ) {

    return this.http.get<any>(
      `${this.API}/${project}/${file}`
    )
  }

  // Schema laden
  getSchema(
    project: string,
    file: string
  ) {

    return this.http.get<any>(
      `${this.API}/${project}/${file}/schema`
    )
  }

  // Datei speichern
  saveFile(
    project: string,
    file: string,
    data: any
  ) {

    return this.http.put(
      `${this.API}/${project}/${file}`,
      data
    )
  }

  // UPLOADS

  uploadImage(file: File) {
    const formData = new FormData()
    formData.append(
      'image',
      file
    )
    return this.http.post<any>(
      `${environment.apiUrl}/media`,
      formData
    )
  }

  deleteImage(path: string) {
    return this.http.delete(
      `${environment.apiUrl}/media`,

      {
        body: {
          path
        }
      }
    )
  }
}