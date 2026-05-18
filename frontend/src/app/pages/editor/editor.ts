import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core'

import { CommonModule } from '@angular/common'

import {
  ActivatedRoute,
  Router
} from '@angular/router'

import { FormsModule } from '@angular/forms'

import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCardModule } from '@angular/material/card'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'

import { ApiService } from '../../core/services/api'
import { UmlautifyPipe } from '../../shared/pipes/umlautify-pipe'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-editor',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,

    UmlautifyPipe
  ],

  templateUrl: './editor.html',
  styleUrls: ['./editor.scss']
})

export class EditorComponent implements OnInit {

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private api = inject(ApiService)
  private cdr = inject(ChangeDetectorRef)

  imageCacheBuster = Date.now()

  project = ''
  file = ''

  data: any[] = []

  schema: any = {}

  validationErrors: string[] = []

  environment = environment

  ngOnInit(): void {

    this.project =
      this.route.snapshot.paramMap.get('project') || ''

    this.file =
      this.route.snapshot.paramMap.get('file') || ''

    this.loadFile()
  }

  loadFile() {

    this.api.getFile(
      this.project,
      this.file
    ).subscribe({

      next: (res) => {

        console.log('FILE DATA:', res)

        this.data = [...res]

        // IDs normalisieren

        this.normalizeIds()

        this.loadSchema()

        this.cdr.detectChanges()
      },

      error: (err) => {
        console.error(err)
      }
    })
  }

  loadSchema() {

    this.api.getSchema(
      this.project,
      this.file
    ).subscribe({

      next: (res) => {

        console.log('SCHEMA:', res)

        this.schema = res

        this.cdr.detectChanges()
      },

      error: (err) => {
        console.error(err)
      }
    })
  }

  back() {

    this.router.navigate(['/'])
  }

  save() {

    if (!this.isValid()) {

      alert(
        this.validationErrors.join('\n')
      )

      return
    }

    this.api.saveFile(
      this.project,
      this.file,
      this.data
    ).subscribe({

      next: () => {

        alert('Gespeichert')
      },

      error: (err) => {

        console.error(err)
      }
    })
  }

  addItem() {

    if (!this.schema?.item) {
      return
    }

    const newItem: any = {}

    Object.keys(this.schema.item)
      .forEach(key => {

        const field =
          this.schema.item[key]

        // =====================
        // AUTO ID
        // =====================

        if (key === 'id') {

          newItem[key] =
            this.data.length + 1

          return
        }

        // =====================
        // DEFAULTS
        // =====================

        switch (field.type) {

          case 'number':

            newItem[key] = 0
            break

          case 'boolean':

            newItem[key] = false
            break

          case 'multi-select':

            newItem[key] = []
            break

          case 'object':

            newItem[key] = {}

            Object.keys(field.fields)
              .forEach(nestedKey => {

                newItem[key][nestedKey] = ''

              })

            break

          case 'image':

            newItem[key] =
              '/media/book-covers/cover-not-available.png'

            break

          default:

            newItem[key] = ''
        }

      })

    this.data.push(newItem)

    this.cdr.detectChanges()
  }

  deleteItem(index: number) {

    this.data.splice(index, 1)

    // IDs neu vergeben

    this.normalizeIds()

    this.cdr.detectChanges()
  }

  normalizeIds(): void {

    this.data.forEach((item, i) => {

      item.id = i + 1

    })
  }

  getKeys(obj: any): string[] {

    if (!obj) {
      return []
    }

    return Object.keys(obj)
  }

  getFieldSchema(key: string): any {

    if (this.schema?.item) {
      return this.schema.item[key]
    }

    return this.schema[key]
  }

  getFieldType(key: string): string {

    return (
      this.getFieldSchema(key)?.type
      || 'text'
    )
  }

  getFieldLabel(key: string): string {

    return (
      this.getFieldSchema(key)?.label
      || key
    )
  }

  getFieldOptions(key: string): string[] {

    return (
      this.getFieldSchema(key)?.options
      || []
    )
  }

  isSelectField(key: string): boolean {

    return (
      this.getFieldType(key)
      === 'select'
    )
  }

  isMultiSelectField(key: string): boolean {

    return (
      this.getFieldType(key)
      === 'multi-select'
    )
  }

  isRequired(key: string): boolean {

    return (
      this.getFieldSchema(key)
        ?.required === true
    )
  }

  isReadonly(key: string): boolean {

    // ID IMMER READONLY

    if (key === 'id') {
      return true
    }

    return (
      this.getFieldSchema(key)
        ?.readonly === true
    )
  }

  isObjectField(key: string): boolean {

    return (
      this.getFieldType(key)
      === 'object'
    )
  }

  getObjectFields(key: string): any {

    return (
      this.getFieldSchema(key)
        ?.fields
      || {}
    )
  }

  isValid(): boolean {

    this.validationErrors = []

    if (!this.schema) {
      return true
    }

    const fields =
      this.schema.item || this.schema

    this.data.forEach((item, index) => {

      Object.keys(fields).forEach(key => {

        const field = fields[key]

        const value = item[key]

        // =====================
        // REQUIRED
        // =====================

        if (field.required) {

          const isEmpty =

            value === null
            ||
            value === undefined
            ||
            (
              typeof value === 'string'
              &&
              value.trim() === ''
            )

          if (isEmpty) {

            this.validationErrors.push(
              `Eintrag ${index + 1}: ${field.label} ist erforderlich`
            )
          }
        }

        // =====================
        // NUMBER
        // =====================

        if (
          field.type === 'number'
          &&
          value !== null
          &&
          value !== undefined
          &&
          value !== ''
        ) {

          if (isNaN(Number(value))) {

            this.validationErrors.push(
              `Eintrag ${index + 1}: ${field.label} muss eine Zahl sein`
            )
          }
        }

        // =====================
        // URL
        // =====================

        if (
          field.type === 'url'
          &&
          value
        ) {

          try {

            new URL(value)

          } catch {

            this.validationErrors.push(
              `Eintrag ${index + 1}: ${field.label} enthält keine gültige URL`
            )
          }
        }

        // =====================
        // OBJECTS
        // =====================

        if (
          field.type === 'object'
          &&
          field.fields
        ) {

          Object.keys(field.fields)
            .forEach(nestedKey => {

              const nestedField =
                field.fields[nestedKey]

              const nestedValue =
                item[key]?.[nestedKey]

              if (nestedField.required) {

                const isNestedEmpty =

                  nestedValue === null
                  ||
                  nestedValue === undefined
                  ||
                  (
                    typeof nestedValue === 'string'
                    &&
                    nestedValue.trim() === ''
                  )

                if (isNestedEmpty) {

                  this.validationErrors.push(
                    `Eintrag ${index + 1}: ${nestedField.label} ist erforderlich`
                  )
                }
              }

            })
        }

      })

    })

    console.log(
      'VALIDATION ERRORS:',
      this.validationErrors
    )

    return this.validationErrors.length === 0
  }

  isImageField(key: string): boolean {

    return (
      this.getFieldType(key)
      === 'image'
    )
  }

  onImageSelected(
    event: any,
    item: any,
    key: string
  ) {

    const file =
      event.target.files[0]

    if (!file) {
      return
    }

    console.log('image selected')
    this.api.uploadImage(file)
      .subscribe({

        next: (res) => {

          item[key] = res.path

          this.imageCacheBuster =
            Date.now()

          this.cdr.detectChanges()
        },

        error: (err) => {
          console.error(err)
        }

      })
  }

  removeImage(
    item: any,
    key: string
  ) {

    const imagePath = item[key]

    if (
      !imagePath
      ||
      imagePath.includes(
        'cover-not-available'
      )
    ) {

      item[key] =
        '/media/book-covers/cover-not-available.png'

      this.imageCacheBuster =
        Date.now()

      return
    }

    this.api.deleteImage(imagePath)
      .subscribe({

        next: () => {

          item[key] =
            '/media/book-covers/cover-not-available.png'

          this.imageCacheBuster =
            Date.now()

          this.cdr.detectChanges()
        },

        error: (err) => {

          console.error(err)
        }

      })
  }

  getImageUrl(path: string): string {

    const imagePath =
      path
      || '/media/book-covers/cover-not-available.png'

    // Supabase URL

    if (
      imagePath.startsWith('http')
    ) {

      return (
        imagePath
        + '?v='
        + this.imageCacheBuster
      )
    }

    // Lokales Backend Bild

    return (
      environment.apiUrl.replace('/api', '')
      + imagePath
      + '?v='
      + this.imageCacheBuster
    )
  }

  scrollToBottom(): void {

    const bottom =
      document.getElementById(
        'page-bottom'
      )

    bottom?.scrollIntoView({
      behavior: 'smooth'
    })

  }

  scrollToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }
}