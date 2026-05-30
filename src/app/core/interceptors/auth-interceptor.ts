import { HttpInterceptorFn } from '@angular/common/http'

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const token = localStorage.getItem('token')

  if (
    token &&
    ['POST', 'PUT', 'DELETE']
      .includes(req.method)
  ) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(req)
}