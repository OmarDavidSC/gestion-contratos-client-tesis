import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { EDashPorMes } from 'src/app/shared/models/entidades/EDashPorMes';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard-por-mes',
  templateUrl: './dashboard-por-mes.component.html',
  styleUrls: ['./dashboard-por-mes.component.scss']
})
export class DashboardPorMesComponent implements OnInit {

  loading: boolean = true;
  mostrarPorMes: boolean = false;

  detallePorMes: EDashPorMes[] = [];
  detallePorMesChartData: ChartData<'line'> = {} as ChartData<'line'>;
  detallePorMesChartOptions: ChartConfiguration['options'] = {} as ChartConfiguration['options'];

  @ViewChild('detallePorMesChart', { static: false }) detallePorMesChart!: ElementRef;

  constructor(private dashboardService: DashboardService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initialize();
  }

  async initialize() {
    await this.obtenerContratosPorMes();
  }

  async obtenerContratosPorMes(): Promise<void> {
    this.loading = true;

    const response = await this.dashboardService.porMes();
    if (response.success) {
      this.detallePorMes = response.data;

      const labels: string[] = Array.from({ length: 12 }, (_, i) => this.getMonthName(i + 1));
      const data: number[] = new Array(12).fill(0);
      this.detallePorMes.forEach(item => {
        data[item.Mes - 1] = item.CantidadContratos; 
      });
      this.detallePorMesChartData = {
        labels: labels,
        datasets: [{
          label: 'Contratos por Mes (2024)',
          data: data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.3,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointRadius: 5
        }]
      };

      this.detallePorMesChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `Cantidad: ${context.raw}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Meses'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            },
            title: {
              display: true,
              text: 'Cantidad de Contratos'
            }
          }
        }
      };
      this.mostrarPorMes = true;
      this.renderChart();
    }
    this.loading = false;
  }

  private renderChart(): void {
    if (this.mostrarPorMes && this.detallePorMesChart) {
      new Chart(this.detallePorMesChart.nativeElement, {
        type: 'line',
        data: this.detallePorMesChartData,
        options: this.detallePorMesChartOptions
      });
    }
  }

  private getMonthName(monthNumber: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1];
  }

}
