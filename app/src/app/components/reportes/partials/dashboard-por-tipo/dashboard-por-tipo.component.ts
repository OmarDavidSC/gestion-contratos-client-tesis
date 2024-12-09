import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EDashTipoContrato } from 'src/app/shared/models/entidades/EDashTipoContrato';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard-por-tipo',
  templateUrl: './dashboard-por-tipo.component.html',
  styleUrls: ['./dashboard-por-tipo.component.scss']
})
export class DashboardPorTipoComponent implements OnInit {

  loading = true;
  mostrarPorTipo: boolean = false;

  detallePorTipo: EDashTipoContrato[] = [];
  detallePorTipoLeyenda: { idTipo: number, nombre: string, color: string, total: number }[] = [];
  detallePorTipoChartData: ChartData<'radar'> = {} as ChartData<'radar'>;
  detallePorTipoChartOptions: ChartConfiguration['options'] = {} as ChartConfiguration['options'];

  @ViewChild('detallePorTipoChart', { static: false }) detallePorTipoChart: ElementRef;

  constructor(
    private dashboardService: DashboardService
  ) {
    Chart.register(...registerables, ChartDataLabels);
  }

  ngOnInit(): void {
    this.initialize();
  }

  async initialize() {
    await this.obtenerTramitesPorArea();
  }

  async obtenerTramitesPorArea(): Promise<void> {
    this.loading = true;
    const respuesta = await this.dashboardService.porTipoContrato();
    if (respuesta.success) {
      this.detallePorTipo = respuesta.data;

      const labels: string[] = [];
      const data: number[] = [];
      const backgroundColors: string[] = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 205, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(201, 203, 207, 0.5)',
        'rgba(54, 203, 207, 0.5)',
        'rgba(201, 203, 64, 0.5)',
        'rgba(201, 99, 207, 0.5)',
      ];

      this.detallePorTipoLeyenda = [];
      let totalCantidad = 0;

      for (let i = 0; i < this.detallePorTipo.length; i++) {
        const tipoContrato = this.detallePorTipo[i];
        labels.push(tipoContrato.TipoContraro);
        data.push(tipoContrato.Cantidad);
        totalCantidad += tipoContrato.Cantidad;

        this.detallePorTipoLeyenda.push({
          idTipo: i,
          nombre: tipoContrato.TipoContraro,
          color: backgroundColors[i % backgroundColors.length],
          total: tipoContrato.Cantidad
        });
      }

      this.detallePorTipoChartData = {
        labels,
        datasets: [{
          label: 'Cantidad de Contratos por Tipo',
          data,
          backgroundColor: backgroundColors
        }]
      };

      this.detallePorTipoChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw || 0;
                return `Cantidad: ${value}`;
              }
            }
          },
          datalabels: {
            formatter: (value) => {
              const percentage = ((value / totalCantidad) * 100).toFixed(2);
              return `${percentage}%`;
            },
            color: '#000',
            font: {
              weight: 'bold',
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      };

      this.mostrarPorTipo = true;
      this.renderChart('tipo');
      this.loading = false;
    }
  }
  
  private renderChart(type: 'tipo') {
    if (type === 'tipo' && this.detallePorTipoChart) {
      new Chart(this.detallePorTipoChart.nativeElement, {
        type: 'radar',
        data: this.detallePorTipoChartData,
        options: this.detallePorTipoChartOptions
      });
    }
  }
}
