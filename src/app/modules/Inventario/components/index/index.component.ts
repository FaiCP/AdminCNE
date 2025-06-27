import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { FormkitsComponent } from '../formkits/formkits.component';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: false
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = [];
  displayedColumns1: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  dataSource1 = new MatTableDataSource<any>([]);
  elementoEnEdicion: any = null;
  

  cantidadTotal!:number ;
  cantidadTotalE!:number ;
  CantidadPagina=10;
  numerPagina = 0;
  tamanioPaginaOptions: number[] = [1, 5, 10, 25, 100];

  textoBusqueda = "";
  editandoElementoId: number | null = null; 
  elementoEditado: any = {}; 

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(FormComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data: "genral dialogo"
    });
  }

  openDialogKits(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(FormkitsComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data: "kits dialogo"
    });
  }

  enviarActaKits(): void {
    this.HttpService.GenerarActaHardPDF('Kits/GenerarActa').subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Acta_Kists_${new Date().toISOString()}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
      }
    });
  }

  enviarActa(): void {
    this.HttpService.GenerarActaHardPDF('Hardware/GenerarActa').subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Acta_Inventario_${new Date().toISOString()}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
      }
    });
  }

  enviarActaEXEL(): void {
    this.HttpService.GenerarActaHardEXEL('Hardware/GenerarActaExcel').subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Acta_Inventario_${new Date().toISOString()}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el EXEL:', err);
      }
    });
  }

  ObtenerElementos() {
    this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textoBusqueda, 'Hardware/LeerTodo')
      .subscribe((resOK: any) => {
        this.dataSource.data = resOK.datos.elementos;
        this.cantidadTotal = resOK.datos.cantidadTotal;
        console.log(resOK)
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  ObtenerKits() {
    this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textoBusqueda, 'Kits/LeerTodo')
      .subscribe((resOK: any) => {
        this.dataSource1.data = resOK.datos.elementos;
        this.cantidadTotalE = resOK.datos.cantidadTotal;
        console.log(resOK)
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  iniciarEdicion(element: any) {
    this.editandoElementoId = element.id; // Guardar ID del elemento en edición
    this.elementoEditado = { ...element }; // Clonar el objeto para edición
  }

  guardarEdicionKits() {
    if (this.editandoElementoId !== null) {
      this.HttpService.Actualizar(this.editandoElementoId, this.elementoEditado, 'Kits/Actualizar')
        .subscribe(
          (resOK: any) => {
            console.log(resOK);
            this.toastr.success("Elemento Actualizado", resOK);
            this.editandoElementoId = null; 
            this.ObtenerKits(); 
          },
          (respuestErr: any) => {
            this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
          }
        );
    }
  }

  guardarEdicion() {
    if (this.editandoElementoId !== null) {
      this.HttpService.Actualizar(this.editandoElementoId, this.elementoEditado, 'Hardware/Actualizar')
        .subscribe(
          (resOK: any) => {
            console.log(resOK);
            this.toastr.success("Elemento Actualizado", resOK);
            this.editandoElementoId = null; 
            this.ObtenerElementos(); 
          },
          (respuestErr: any) => {
            this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
          }
        );
    }
  }
  cancelarEdicion() {
    this.editandoElementoId = null;
  }

  cambiarPagina(event:any)
  {
    this.CantidadPagina = event.pageSize;
    this.numerPagina = event.pageIndex;
    this.ObtenerElementos();
  }


  eliminar(id: number) {
    if (confirm(`¿Estás seguro de que deseas eliminar el elemento con ID: ${id}?`))  
    this.HttpService.Eliminarasync([id], 'Hardware/Eliminar') 
      .subscribe(
        (resOK: any) => {
          this.toastr.success("Elemento eliminado", "Éxito");
          this.ObtenerElementos();
        },  
        (respuestErr: any) => {
          this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error al eliminar');
        }
      );
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.textoBusqueda = filterValue;
    this.numerPagina = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.ObtenerElementos();
  }

  ngOnInit(): void {
    this.guardarEdicion();
    this.guardarEdicionKits();
    this.ObtenerElementos();
    this.ObtenerKits();

    this.displayedColumns = ['numero','Custodio','Serie','id_equipo', 'marca', 'modelo', 'Descripcion', 'estado','descripcion','valor' , 'borrado', 'editar'];
    this.displayedColumns1 = ['numero','INSUMO','MODELO','MARCA', 'SERIE','ESTADO', 'CANTIDAD','OBSERVACION','borrado', 'editar'];
  }
}
