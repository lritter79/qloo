import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AuthService {
  constructor() {
    super();
  }

  deleteUserAccount() {
    return this.http.delete(`${this.API_URL}/user`, this.getAuthHeaders()).pipe(
      tap(() => {
        this.handleLogout();
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
