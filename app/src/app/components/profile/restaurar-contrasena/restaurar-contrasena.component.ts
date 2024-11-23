import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurar-contrasena',
  templateUrl: './restaurar-contrasena.component.html',
  styleUrls: ['./restaurar-contrasena.component.scss']
})
export class RestaurarContrasenaComponent implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(){
    this.router.navigate(['mi-perfil']);
  }

}
