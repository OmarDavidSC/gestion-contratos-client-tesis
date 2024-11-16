import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private IdInformacionUsuario: string = '3109e871-ee9c-4fd5-9a1f-bb4ced2a5ff3';

  constructor() { }

  public get UsuarioAutenticado(): any {
    const localStorageValue = localStorage.getItem(this.IdInformacionUsuario);
    if (localStorageValue && localStorageValue !== '') {
      const userInfoJson = atob(localStorageValue);
      return JSON.parse(userInfoJson) as any;
    }
    return null;
  }

  public set UsuarioAutenticado(userInfo: any) {
    if (userInfo === null) {
      localStorage.removeItem(this.IdInformacionUsuario);
      return;
    }
    const userInfoJson = JSON.stringify(userInfo);
    const userInfoBase64 = btoa(userInfoJson);
    localStorage.setItem(this.IdInformacionUsuario, userInfoBase64);
  }
}
