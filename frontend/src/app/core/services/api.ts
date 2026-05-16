import {
  Injectable,
  inject
} from '@angular/core'

import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private http = inject(HttpClient)

  private API =
    'http://localhost:3000/api/projects'

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
      'http://localhost:3000/api/upload',
      formData
    )
  }

  deleteImage(path: string) {
    return this.http.delete(
      'http://localhost:3000/api/upload',

      {
        body: {
          path
        }
      }
    )
  }
}