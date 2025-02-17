import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EDashEstado } from 'src/app/shared/models/entidades/EDashEstado';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { PorEstadoModalsComponent } from '../../modals/por-estado-modals/por-estado-modals.component';

@Component({
  selector: 'app-dashboard-por-estado',
  templateUrl: './dashboard-por-estado.component.html',
  styleUrls: ['./dashboard-por-estado.component.scss']
})
export class DashboardPorEstadoComponent implements OnInit {

  contratosPorEstado: EDashEstado[] = [];
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  async initialize() {
    this.loading = true;
    const response = await this.dashboardService.porEstado();
    if (response.success) {
      this.contratosPorEstado = response.data;
      this.loading = false;
    }
  }

  openContratoModal(item: any): void {
    const dialogRef = this.dialog.open(PorEstadoModalsComponent, {
      width: '1000px',
      height: '1000px',
      data: {
        estado: item.Estado,
        contratos: item.Contratos
      }
    });
  }

}
