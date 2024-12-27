import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormComponent } from 'src/app/modules/Prestamos/components/form/form.component';
import { HttpService } from 'src/app/services/Http.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  checked = false;
  selectedItems: any[] = [];
  displayedColumns: string[] = [];
  departamentos: any[] = [];
  custodios: any[] = [];
  dataSource = new MatTableDataSource<any>([]);

  cantidadTotal=0;
  CantidadPagina = 10;
  numerPagina=0;
  tamanioPaginaOptions: number[]=[1,5,10,25,100];

  textBusqueda="";

  prestamo = {
    id_departamento: '',
    id_equipo: '',
    id_custodio: '',
  };

  custodio = {
    id: '',
    cedula_empleado: '',
    cargo_empleado: '',
    nombre_empleado: '',
    departamento: '',
  };

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private auth:AuthService,
    

  ){}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(FormComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data:"probando dialogos"
    });
  }

  onCustodioChange(custodioId: number): void {
    const selectedCustodio = this.custodios.find(custodio => custodio.id === custodioId);
    console.log(custodioId);
    this.ObtenerHistorial(custodioId);

    if (selectedCustodio) {
      this.prestamo.id_departamento = this.departamentos.find(dep => dep.nombre === selectedCustodio.departamento)?.id;
    }
  }

  ObtenerDepartamentos() {
    
    this.HttpService.LeerTodo(50, this.numerPagina, this.textBusqueda, 'departamentos')
      .subscribe((resOK: any) => {
        this.departamentos = resOK.datos.elementos;
        this.cantidadTotal = resOK.datos.cantidadTotal;
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  ObtenerHistorial(custodioId: number){
    this.HttpService.LeerHistorial(
      this.CantidadPagina,
      this.numerPagina,
      this.textBusqueda,
      custodioId,
      `HistorialPrestamos/LeerTodo`
    ).subscribe(
      (resOK: any) => {
        this.dataSource.data = resOK.datos.elementos;
        this.cantidadTotal = resOK.datos.cantidadTotal;
        console.log("Historiales", resOK);
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      }
    );
  }

  ObtenerCustodios() {
    this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textBusqueda, 'Custodios/LeerTodo')
      .subscribe((resOK: any) => {
        this.custodios = resOK.datos.elementos;
        console.log(resOK)
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }
  
  enviarActa(): void {
    const ids = this.dataSource.data.map((element: any) => element.id);
    console.log("IDs seleccionados:", ids);
    this.HttpService.GenerarActaPDF(ids, 'HistorialPrestamos/GenerarActa').subscribe({
        next: (response: Blob) => {
            // Crear un enlace para descargar el PDF
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Acta_Prestamo_${new Date().toISOString()}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        error: (err) => {
            console.error('Error al generar el PDF:', err);
            this.toastr.error('Error al generar el acta');
        }
    });
}

  cambiarPagina(event:any)
  {
    this.CantidadPagina = event.pageSize;
    this.numerPagina = event.pageIndex;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.ObtenerDepartamentos();
    this.ObtenerCustodios();  
    this.displayedColumns = ['Nº','CÓDIGO_ACTUAL','nombre_dispositivo','SERIE',
                              'MODELO', 'MARCA','fecha_asignacion','fecha_devolucion','VALOR','ESTADO'];
  }

}
