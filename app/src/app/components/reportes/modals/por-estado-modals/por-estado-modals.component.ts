import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Constantes } from 'src/app/shared/utils/Constantes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-por-estado-modals',
  templateUrl: './por-estado-modals.component.html',
  styleUrls: ['./por-estado-modals.component.scss']
})
export class PorEstadoModalsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: ActivatedRoute,
    public router: Router,
    private dialogRef: MatDialogRef<PorEstadoModalsComponent>
  ) { }

  ngOnInit(): void {
  }


  eventoVerDetalle(element: any) {
    this.dialogRef.close();
    this.router.navigate([this.obtenerRutaDetalleContrato(element.Id)]);
  }

  eventoVerDetalle2(element: any): void {
    const urlDetalle = this.router.serializeUrl(
      this.router.createUrlTree([Constantes.ruteo.DetalleContrato + "/" + element.Id])
    );

    const url = environment.webAbsoluteUrl + "/#/" + urlDetalle;
    this.dialogRef.close();
    window.open(url, '_blank');
  }

  obtenerRutaDetalleContrato(id: any): string {
    return Constantes.ruteo.DetalleContrato + "/" + id;
  }
}
