import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detalleexpediente',
  templateUrl: './detalleexpediente.component.html',
  styleUrls: ['./detalleexpediente.component.scss']
})
export class DetalleexpedienteComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }  

}
