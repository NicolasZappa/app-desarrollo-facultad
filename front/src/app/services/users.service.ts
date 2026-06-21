import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser, UpdateUserRoleDto, ChangePasswordDto, UpdateEmailDto } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(`${this.api}/users`);
  }

  updateRole(id: string, dto: UpdateUserRoleDto): Observable<SafeUser> {
    return this.http.patch<SafeUser>(`${this.api}/users/${id}/role`, dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/users/me/password`, dto);
  }

  updateEmail(dto: UpdateEmailDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/users/me/email`, dto);
  }
}
