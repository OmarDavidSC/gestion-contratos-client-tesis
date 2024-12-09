import { Component, OnInit } from '@angular/core';
import { EDashEstado } from 'src/app/shared/models/entidades/EDashEstado';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard-por-estado',
  templateUrl: './dashboard-por-estado.component.html',
  styleUrls: ['./dashboard-por-estado.component.scss']
})
export class DashboardPorEstadoComponent implements OnInit {

  contratosPorEstado: EDashEstado[] = [];
  loading = true;

  constructor(
    private dashboardService: DashboardService
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

}
