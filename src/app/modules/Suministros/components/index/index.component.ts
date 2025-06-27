import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import {FormComponent} from '../form/form.component';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: false
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = [];
  editandoElementoId: number | null = null; 
  dataSource = new MatTableDataSource<any>([]);
  elementoEditado: any = {}; 

  cantidadTotal=0;
  CantidadPagina=10;
  numerPagina=0;
  tamanioPaginaOptions: number[]=[1,5,10,25,100];

  textBusqueda="";

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ){}


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(FormComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data:"probando dialos"
    });
  }
  ObtenerElementos(){
    this.HttpService.LeerTodo(this.CantidadPagina,this.numerPagina,this.textBusqueda,'Suministros/LeerTodo')
    .subscribe((resOK: any) => {
      this.dataSource.data = resOK.datos.elementos;
      this.cantidadTotal = resOK.datos.cantidadTotal;
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error');
    });
  }
  cambiarPagina(event:any)
  {
    this.CantidadPagina = event.pageSize;
    this.numerPagina = event.pageIndex;
    this.ObtenerElementos();
  }

  iniciarEdicion(element: any) {
    this.editandoElementoId = element.id; // Guardar ID del elemento en edición
    this.elementoEditado = { ...element }; // Clonar el objeto para edición
  }

  guardarEdicion() {
    if (this.editandoElementoId !== null) {
      console.log('Datos a actualizar:', this.elementoEditado);
      this.HttpService.Actualizar(this.editandoElementoId, this.elementoEditado, 'Suministros/Actualizar')
        .subscribe(
          (resOK: any) => {
            console.log(resOK);
            this.toastr.success("Elemento Actualizado", resOK);
            this.editandoElementoId = null; 
            this.ObtenerElementos(); 
            console.log(resOK)
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


  eliminar(id:number){
    if (confirm(`¿Estás seguro de que deseas eliminar el elemento con ID: ${id}?`)) 
    this.HttpService.Eliminarasync([id],'Suministros/Eliminar')
    .subscribe((resOK: any) => {
      this.toastr.success("Eleemento eleminado");
      this.ObtenerElementos();
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error');
    });;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.textBusqueda = filterValue;
    this.numerPagina = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.ObtenerElementos();
  }

  ngOnInit(): void {
    this.ObtenerElementos();
    this.guardarEdicion();
    this.displayedColumns = ['id_equipo', 'tipo_suministro', 'fecha_retiro','id_equipoAsignado','Action','editar']
  }

}
