import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constantes } from 'src/app/shared/utils/Constantes';

@Component({
  selector: 'app-nuevoexpediente',
  templateUrl: './nuevoexpediente.component.html',
  styleUrls: ['./nuevoexpediente.component.scss']
})
export class NuevoexpedienteComponent implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }

}
