import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Users } from 'src/app/data/user.data';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return of(Users);
  }
}
