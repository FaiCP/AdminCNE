import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { HttpService } from 'src/app/services/Http.service';
import { GlobalModule } from 'src/app/modules/global/global.module';

Chart.register(ChartDataLabels);

interface PrestamosPorMes {
  Mes?: string;
  mes?: string;
  TotalPrestamos?: number;
  totalPrestamos?: number;
}

interface InventarioItem {
  NombreDispositivo?: string;
  nombreDispositivo?: string;
  Total?: number;
  total?: number;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [BaseChartDirective, CommonModule, GlobalModule],
})
export class IndexComponent implements OnInit {
  readonly totalHardware = signal<number>(0);
  readonly totalPrestamos = signal<number>(0);
  readonly totalCustodios = signal<number>(0);
  readonly totalSuministros = signal<number>(0);
  readonly isLoading = signal<boolean>(false);

  private readonly chartPalette: string[] = [
    '#1565C0',
    '#0288D1',
    '#00897B',
    '#43A047',
    '#F9A825',
    '#EF6C00',
    '#C62828',
    '#6A1B9A',
  ];

  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: { min: 0 },
    },
    plugins: {
      legend: { display: true },
      datalabels: { anchor: 'end', align: 'end', color: '#333' },
    },
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Inventario por Tipo',
        backgroundColor: 'rgba(21, 101, 192, 0.85)',
        borderColor: '#1565C0',
        borderWidth: 1,
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      datalabels: {
        formatter: (value: number, ctx: any) => {
          return ctx.chart.data.labels?.[ctx.dataIndex] ?? '';
        },
        color: '#fff',
        font: { weight: 'bold', size: 11 },
      },
    },
  };
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Prestamos por Mes',
        backgroundColor: this.chartPalette,
      },
    ],
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.isLoading.set(true);
    this.cargarKPIs();
    this.cargarInventarioBar();
    this.cargarPrestamosDoughnut();
  }

  private normalize(res: any): { items: any[]; total: number } {
    const inner = res.datos ?? res.data ?? res;
    return {
      items: inner.elementos ?? inner.items ?? [],
      total: inner.cantidadTotal ?? inner.totalCount ?? 0,
    };
  }

  private cargarKPIs(): void {
    this.httpService.LeerTodo(1, 0, '', 'Hardware/LeerTodo').subscribe({
      next: (res: any) => this.totalHardware.set(this.normalize(res).total),
      error: () => this.totalHardware.set(0),
    });

    this.httpService.LeerTodo(1, 0, '', 'GestionActivos/LeerTodo').subscribe({
      next: (res: any) => this.totalPrestamos.set(this.normalize(res).total),
      error: () => this.totalPrestamos.set(0),
    });

    this.httpService.LeerTodo(1, 0, '', 'Custodios/LeerTodo').subscribe({
      next: (res: any) => this.totalCustodios.set(this.normalize(res).total),
      error: () => this.totalCustodios.set(0),
    });

    this.httpService.LeerTodo(1, 0, '', 'Suministros/LeerTodo').subscribe({
      next: (res: any) => {
        this.totalSuministros.set(this.normalize(res).total);
        this.isLoading.set(false);
      },
      error: () => {
        this.totalSuministros.set(0);
        this.isLoading.set(false);
      },
    });
  }

  private normalizeArray(res: any): any[] {
    if (Array.isArray(res)) return res;
    const inner = res.datos ?? res.data ?? res;
    if (Array.isArray(inner)) return inner;
    return inner.elementos ?? inner.items ?? [];
  }

  private cargarInventarioBar(): void {
    this.httpService.obtenerInventarioTotal('Reportes/InventarioTotal').subscribe({
      next: (res: any) => {
        const data: InventarioItem[] = this.normalizeArray(res);
        this.barChartData = {
          ...this.barChartData,
          labels: data.map((item) => item.NombreDispositivo ?? item.nombreDispositivo ?? ''),
          datasets: [{ ...this.barChartData.datasets[0], data: data.map((item) => item.Total ?? item.total ?? 0) }],
        };
      },
      error: (err) => console.error('Error inventario:', err),
    });
  }

  private cargarPrestamosDoughnut(): void {
    this.httpService.obtenerPrestamosPorMes('Reportes/PrestamosPorMes').subscribe({
      next: (res: any) => {
        const data: PrestamosPorMes[] = this.normalizeArray(res);
        this.doughnutChartData = {
          ...this.doughnutChartData,
          labels: data.map((item) => item.Mes ?? item.mes ?? ''),
          datasets: [{ ...this.doughnutChartData.datasets[0], data: data.map((item) => item.TotalPrestamos ?? item.totalPrestamos ?? 0) }],
        };
      },
      error: (err) => console.error('Error prestamos:', err),
    });
  }
}
