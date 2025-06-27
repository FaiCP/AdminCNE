import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements OnInit {

  prestamo = {
    id_equipo: '',
    id_custodio: '',
  };

  Activo = {
    id: '',
    id_equipo: '',
    nombre_dispositivo: '',
  };

  custodio = {
    id: '',
    cedula_empleado: '',
    cargo_empleado: '',
    nombre_empleado: '',
    departamento: '',
  };

  dataSource = new MatTableDataSource<any>([]); 
  dataSource1 = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  tamanioPaginaOptions: number[]=[1,5];
  filterText: string = ''; 
  cantidadTotalE = 0;
  cantidadTotal = 0;
  CantidadPagina = 5;
  numerPagina = 0;
  id_departamento = '';

  displayedColumns1: string[] = [];
  displayedColumns: string[] = [];
  selectedItems: any[] = [];
  selecteIds: number[] = [];
  departamentos: any[] = [];
  activos: any[] = [];
  filteredActivos: any[] = [];
  custodios: any[] = [];
  textBusqueda = '';
  searchActivo: string = ''; 

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = ['nombre_dispositivo','haedware.marca','haedware.modelo',
      'haedware.codigo_cne', 'id_equipo','select'];
    this.displayedColumns1 = ['numero','INSUMO','MODELO','MARCA', 'SERIE','ESTADO', 'CANTIDAD','OBSERVACION','select'];
    this.ObtenerDepartamentos();
    this.ObtenerHardwares();
    this.ObtenerCustodios();
    this.ObtenerKits();
    this.ObtenerElementos();
  }

  ObtenerCustodios() {
    this.HttpService.LeerTodo(50, this.numerPagina, this.textBusqueda, 'Custodios/LeerTodo')
      .subscribe((resOK: any) => {
        this.custodios = resOK.datos.elementos;
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  onCustodioChange(custodioId: number): void {
    const selectedCustodio = this.custodios.find(custodio => custodio.id === custodioId);

    if (selectedCustodio) {
      this.id_departamento = this.departamentos.find(dep => dep.nombre === selectedCustodio.departamento)?.id;
    }
  }

  ObtenerDepartamentos() {   
    this.HttpService.LeerTodo(50, this.numerPagina, this.textBusqueda, 'departamentos/LeerTodo')
      .subscribe((resOK: any) => {
        this.departamentos = resOK.elementos;
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  ObtenerKits() {
    this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textBusqueda, 'Kits/LeerTodo')
      .subscribe((resOK: any) => {
        this.dataSource1.data = resOK.datos.elementos;
        this.cantidadTotalE = resOK.datos.cantidadTotal;
        console.log(resOK)
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  ObtenerHardwares() {
    this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textBusqueda, 'Hardware/LeerTodo')
      .subscribe((resOK: any) => {
        this.dataSource.data = resOK.datos.elementos;
        this.cantidadTotal = resOK.datos.cantidadTotal;     
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }
ObtenerElementos() {
  this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textBusqueda, 'GestionActivos/LeerTodo')
    .subscribe((resOK: any) => {
      this.dataSource2.data = resOK.datos.elementos;
    },
    (respuestErr: any) => {
      this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
    });
}

 onCheckboxChange(element: any, isChecked: boolean): void {
  const id_equipo = element.id_equipo;
  const equipo = this.dataSource.data.find((e: any) => e.id_equipo === id_equipo);

  let estaPrestado = !!equipo?.nombreCustodio1?.trim();
  
  console.log(`Custodio actual: "${equipo?.nombreCustodio1}"`);
  console.log('Checkbox:', isChecked, 'Equipo:', equipo);
  console.log('¿Está prestado?', estaPrestado);

  if (isChecked) {
    if (estaPrestado) {
      this.toastr.warning(`El equipo con ID ${id_equipo} ya se encuentra prestado.`, 'Advertencia');
      return;
    }

    if (!this.selectedItems.includes(id_equipo)) {
      this.selectedItems.push(id_equipo);
    }
  } else {
    this.selectedItems = this.selectedItems.filter(id => id !== id_equipo);
  }

  console.log('IDs seleccionados:', this.selectedItems);
}

  cambiarPagina(event:any)
  {
    this.numerPagina = event.pageIndex;
    this.cantidadTotal = event.length;
    this.ObtenerHardwares();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.textBusqueda = filterValue;
    this.numerPagina = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.ObtenerHardwares();
  }
  
  

  Post(prestamo: any) {
    const registros = this.selectedItems.map(idEquipo => ({
      IdEquipo: idEquipo,
      IdCustodio: prestamo.id_custodio
    }));
    console.log(prestamo);
    if (registros.length === 0) {
      this.toastr.warning("No se puede crear elementos: la lista de registros está vacía");
      return; 
  }
    this.HttpService.Post(registros, 'GestionActivos/Crear')
      .subscribe({
        next: (res: any) => {
          if (res.datos) {
            this.selecteIds = res.datos; // Almacena los IDs creados
            console.log(this.selecteIds);
            this.toastr.success("Elementos creados exitosamente");
            this.enviarActa();
            
          } else {
            this.toastr.warning("No se recibieron IDs de los elementos creados");
          }
        },
        error: (error) => {
          const mensaje = error?.error?.mensajesErrors?.[0] || 'Ocurrió un error inesperado.';
          this.toastr.error(mensaje, 'Error en creacion del Prestamo:');
        }
      });
  }

  enviarActa(): void {
    console.log("IDs seleccionados:", this.selecteIds);

    this.HttpService.GenerarActaPDF(this.selecteIds, 'GestionActivos/acta').subscribe({
        next: (response: Blob) => {
            // Crear un enlace para descargar el PDF
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Acta_Prestamo_${new Date().toISOString()}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            window.location.reload();
        },
        error: (err) => {
            console.error('Error al generar el PDF:', err);
            this.toastr.error('Error al generar el acta');
        }
    });
}
onRegister() {
  this.prestamo.id_equipo = this.selectedItems.join(',');
  this.Post(this.prestamo);
}
}


