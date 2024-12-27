import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import {FormComponent} from '../form/form.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  cantidadTotal=0;
  CantidadPagina=10;
  numerPagina=0;
  selectedItems: any[] = [];
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
      data:"probando dialogos"
    });
  }

  ObtenerElementos(){
    this.HttpService.LeerTodo(this.CantidadPagina,this.numerPagina,this.textBusqueda,'Personal/LeerTodo')
    .subscribe((resOK: any) => {
      this.dataSource.data = resOK.datos.elementos;
      this.cantidadTotal = resOK.datos.cantidadTotal;
      console.log(this.dataSource.data)
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error');
    });
  }

  onCheckboxChange(element: any, isChecked: boolean): void {
    const id = element.Id;
    if (isChecked) {
      this.selectedItems.push(id); 
    } else {
      this.selectedItems = this.selectedItems.filter(id => id !== element.id);  
    }
    console.log('IDs seleccionados:', this.selectedItems); 
  }

  enviarActa(): void {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Seleccione al menos un equipo para generar el acta');
      return;
    }
    this.HttpService.GenerarActaPerdPDF(this.selectedItems,'Personal/GenerarActa').subscribe({
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

  cambiarPagina(event:any)
  {
    this.CantidadPagina = event.pageSize;
    this.numerPagina = event.pageIndex;
    this.ObtenerElementos();
  }

  eliminar(id:number){
    if (confirm(`¿Estás seguro de que deseas eliminar el elemento con ID: ${id}?`)) 
    this.HttpService.Eliminar([id],'Personal/Eliminar')
    .subscribe((resOK: any) => {
      this.toastr.success("Elemento eleminado");
      this.ObtenerElementos();
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error al eliminar');
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

    this.displayedColumns = ['cedula', 'nombre', 'cargo', 'correo','pass','Action','select']
  }

}
