import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/Http.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from'chartjs-plugin-annotation';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


import { Chart } from 'chart.js';



// Registrar plugins de Chart.js
Chart.register(ChartDataLabels);
Chart.register(annotationPlugin);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [BaseChartDirective,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
})
export class IndexComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Opciones para el gráfico de pie
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
          return '';
        },
      },
    },
  };

  // Datos del gráfico de pie
  public pieChartData: ChartData<'pie'> = {
    labels: [], // Etiquetas dinámicas (nombres de meses)
    datasets: [
      {
        data: [], // Datos dinámicos (total de préstamos)
        label: 'Prestamos por Mes',
      },
    ],
  };

  public pieChartType: ChartType = 'pie';

  // Opciones para el gráfico de barras
  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  // Datos del gráfico de barras
  public barChartData: ChartData<'bar'> = {
    labels: [], // Etiquetas dinámicas (nombres de dispositivos)
    datasets: [
      {
        data: [], // Datos dinámicos (totales por dispositivo)
        label: 'Inventario Total',
      },
    ],
  };

  public barChartType: ChartType = 'bar';

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              display: true,
              position: 'center',
              color: 'orange',
              content: 'LineAnno',
              font: {
                weight: 'bold',
              },
            },
          },
        ],
      },
    },
  };

  public lineChartType: ChartType = 'line';

  constructor(private HttpService: HttpService) {}

  ngOnInit(): void {
    this.cargarDatosPieChart();
    this.cargarDatosBarChart();
  }

  // Cargar datos para el gráfico de pie
  cargarDatosPieChart(): void {
    this.HttpService.obtenerPrestamosPorMes('Reportes/PrestamosPorMes').subscribe(
      (data: any) => {
        console.log('Datos recibidos del backend:', data);

        // Extraer etiquetas (meses) y datos (totales)
        const labels = data.map((item: any) => item.Mes); // Mapea "Mes"
        const totals = data.map((item: any) => item.TotalPrestamos); // Mapea "TotalPrestamos"

        this.pieChartData.labels = labels;
        // Actualizar datos del gráfico
        this.pieChartData.labels = labels;
        this.pieChartData.datasets[0].data = totals;

        // Forzar actualización del gráfico
        this.chart?.update();
      },
      (error) => {
        console.error('Error al cargar datos del gráfico de pie:', error);
      }
    );
  }

  // Cargar datos para el gráfico de barras
  cargarDatosBarChart(): void {
    this.HttpService.obtenerInventarioTotal('Reportes/InventarioTotal').subscribe(
      (data: any) => {
        console.log('Datos de inventario recibidos:', data);

        // Extraer etiquetas y datos
        this.barChartData.labels = data.map((item: any) => item.NombreDispositivo);
        this.barChartData.datasets[0].data = data.map((item: any) => item.Total);

        // Actualizar datos del gráfico
        this.barChartData = { ...this.barChartData };
      },
      (error) => {
        console.error('Error al cargar datos del gráfico de barras:', error);
      }
    );
  }

  // Eventos de la gráfica (opcional)
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    console.log('Evento click:', event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log('Evento hover:', event, active);
  }
}
