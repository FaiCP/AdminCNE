import { Component, OnInit, ViewChild } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: false
})
export class IndexComponent implements OnInit {

  departamento = {
    id_departamento: '',
    nombre:''
  };

  displayedColumns: string[] = [];
  departamentos: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  elementoEnEdicion: any = null;

  cantidadTotal!:number ;
  CantidadPagina = 10;
  numerPagina = 0;
  tamanioPaginaOptions: number[] = [1, 5, 10, 25, 100];
  textoBusqueda = " ";

  editandoElementoId: number | null = null; 
  elementoEditado: any = {}; 

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.textoBusqueda = filterValue;
    this.numerPagina = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.ObtenerCustodios();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(FormComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data: "probando dialogo"
    });
  }

  ObtenerDepartamentos() {   
    this.HttpService.LeerTodo(50, this.numerPagina, this.textoBusqueda, 'departamentos')
      .subscribe((resOK: any) => {
        this.departamentos = resOK.datos.elementos;
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  ObtenerCustodios() {
    this.HttpService.LeerTodo(this.CantidadPagina, this.numerPagina, this.textoBusqueda, 'Custodios/LeerTodo')
      .subscribe((resOK: any) => {
        this.dataSource.data = resOK.datos.elementos;
        this.cantidadTotal = resOK.datos.cantidadTotal;
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

  guardarEdicion() {
    if (this.editandoElementoId !== null) {
      this.HttpService.Actualizar(this.editandoElementoId, this.elementoEditado, 'Custodios/Actualizar')
        .subscribe(
          (resOK: any) => {
            console.log(resOK);
            this.toastr.success("Elemento Actualizado", resOK);
            this.editandoElementoId = null; 
            this.ObtenerCustodios(); 
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

  cambiarPagina(event: any) {
    this.numerPagina = event.pageIndex;
    this.cantidadTotal = event.length;
    this.ObtenerCustodios();
  }

  eliminar(id: number) {
    if (confirm(`¿Estás seguro de que deseas eliminar el elemento con ID: ${id}?`))  
    this.HttpService.Eliminarasync([id], 'Custodios/Eliminar') 
      .subscribe(
        (resOK: any) => {
          this.toastr.success("Elemento eliminado", "Éxito");
          this.ObtenerCustodios();
        },
        (respuestErr: any) => {
          this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error al eliminar');
        }
      );
  }

  ngOnInit(): void {
    this.ObtenerCustodios();
    this.displayedColumns = ['numero','nombre','cedula','Cargo','Departamento','borrado','editar'];
  }

}
