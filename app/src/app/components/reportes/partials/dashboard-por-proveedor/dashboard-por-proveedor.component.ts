import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EDashPorProveedor } from 'src/app/shared/models/entidades/EDashPorProveedor';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard-por-proveedor',
  templateUrl: './dashboard-por-proveedor.component.html',
  styleUrls: ['./dashboard-por-proveedor.component.scss']
})
export class DashboardPorProveedorComponent implements OnInit {

  loading = true;
  mostrarPorProveedor: boolean = false;

  detallePorProveedor: EDashPorProveedor[] = [];
  detallePorProveedorLeyenda: { idProveedor: number, nombre: string, color: string, total: number }[] = [];
  detallePorProveedorChartData: ChartData<'pie'> = {} as ChartData<'pie'>;
  detallePorProveedorChartOptions: ChartConfiguration['options'] = {} as ChartConfiguration['options'];

  @ViewChild('detallePorProveedorChart', { static: false }) detallePorProveedorChart: ElementRef;

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

  ngAfterViewInit() {
    if (this.mostrarPorProveedor) {
      this.renderChart('proveedor');
    }
  }

  async obtenerTramitesPorArea(): Promise<void> {
    /*const colors = [];
    for (let i = 0; i < 100; i++) {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(randomColor);
    }*/
    this.loading = true;
    const respuesta = await this.dashboardService.porProveedor();
    if (respuesta.success) {
      this.detallePorProveedor = respuesta.data;

      let cantidadTotal: number = 0;
      const labelsArea: string[] = [];
      const coloresArea: string[] = [
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

      const dataArea: number[] = [];
      this.detallePorProveedorLeyenda = [];

      for (let i = 0; i < this.detallePorProveedor.length; i++) {
        const areaDoc = this.detallePorProveedor[i];
        labelsArea.push(areaDoc.NombreProveedor);
        //coloresArea.push(colors[i]);
        dataArea.push(areaDoc.CantidadContratos);
        cantidadTotal += areaDoc.CantidadContratos;
        this.detallePorProveedorLeyenda.push({
          idProveedor: i,
          nombre: areaDoc.NombreProveedor,
          color: coloresArea[i],
          total: areaDoc.CantidadContratos
        });
      }

      this.detallePorProveedorChartData = {
        labels: dataArea.map(String),
        // labels: labelsArea,
        datasets: [{
          label: 'Cantidad de Contratos',
          data: dataArea,
          backgroundColor: coloresArea
        }]
      };

      this.detallePorProveedorChartOptions = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
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
              const percentage = ((value / cantidadTotal) * 100).toFixed(2);
              return `${percentage}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          },
          y: {
            ticks: {
              callback: (value, index) => {
                return this.detallePorProveedor[index]?.CantidadContratos || value;
              },
              align: 'start'
            }
          }
        }
      };
      this.mostrarPorProveedor = true;
      this.renderChart('proveedor');
      this.loading = false;
    }
  }

  private renderChart(type: 'proveedor') {
    if (type === 'proveedor' && this.detallePorProveedorChart) {
      new Chart(this.detallePorProveedorChart.nativeElement, {
        type: 'bar',
        data: this.detallePorProveedorChartData,
        options: this.detallePorProveedorChartOptions
      });
    }
  }

}
