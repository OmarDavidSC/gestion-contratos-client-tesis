import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../models/base/UserLogin';
import { ApiResponse } from '../utils/response';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.uriApiBack;
    this.myApiUrl = 'Login'
  }

  signIn(user: UserLogin): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, user);
  }

  login(user: UserLogin): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.myAppUrl}${this.myApiUrl}/iniciar-sesion`, user).toPromise();
  }

}