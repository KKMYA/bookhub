import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { Endpoints } from '../../../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getProfile(): Observable<User> {
    return this.http.get<User>(`${Endpoints.getAccountApiEndpoint}/me`);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${Endpoints.getAccountApiEndpoint}/update`, user);
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${Endpoints.getAccountApiEndpoint}/password`, { oldPassword, newPassword });
  }
}
