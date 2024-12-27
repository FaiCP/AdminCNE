import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import {FormComponent} from '../form/form.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  userName: string | null = null;
  elementoEnEdicion: any = null;
  userNameSubscription: Subscription = new Subscription();

  checked = false;
  selectedItems: any[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  cantidadTotal=0;
  CantidadPagina = 10;
  numerPagina=0;
  tamanioPaginaOptions: number[]=[1,5,10,25,100];

  textoBusqueda=" ";
  editandoElementosIds: number[] = [];

  elementosEditados: { [id: number]: any } = {};

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

  ObtenerElementos(){
    this.HttpService.LeerTodo(this.CantidadPagina,this.numerPagina,this.textoBusqueda,'GestionActivos/LeerTodo')
    .subscribe((resOK: any) => {
      this.dataSource.data = resOK.datos.elementos;
      this.cantidadTotal = resOK.datos.cantidadTotal;
      console.log(resOK)
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error');
    });
  }

  enviarActa(editandoElementoId: any) {
    this.HttpService.GenerarActaDevolucionPDF(editandoElementoId,'GestionActivos/GenerarDevolucionPDF').subscribe({
      next: (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Acta_Prestamo_${new Date().toISOString()}.pdf`;
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
    this.HttpService.Eliminar([id],'GestionActivos/Eliminar')
    .subscribe((resOK: any) => {
      this.toastr.success("Eleemento eleminado");
      this.ObtenerElementos();
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error');
    });
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

  iniciarEdicion(element: any): void {  
    if (!this.editandoElementosIds.includes(element.id)) {
      this.editandoElementosIds.push(element.id);
      // Clona el elemento para rastrear los cambios
      this.elementosEditados[element.id] = { ...element };
      console.log('Elemento editado al iniciar edición:', this.elementosEditados[element.fecha_devolucion]);
    }
  }

  guardarEdicion(): void {
    const idsEditados = [...this.editandoElementosIds];
    const actualizaciones = idsEditados.map(id => {
        const elementoEditado = this.elementosEditados[id];
        if (elementoEditado) {
            return this.HttpService.Actualizar(id, elementoEditado, 'GestionActivos/Actualizar').toPromise();
        }
        return Promise.resolve();
    });

    Promise.all(actualizaciones)
        .then(() => {
            console.log('Todos los elementos actualizados');
            this.enviarActa(idsEditados);
        })
        .catch(err => {
            console.error('Error en las actualizaciones:', err);
        })
        .finally(() => {
            this.editandoElementosIds = [];
            this.elementosEditados = {};
            this.ObtenerElementos();
        });
}
  
  cancelarEdicion(element: any): void {
    const index = this.editandoElementosIds.indexOf(element.id);
    if (index > -1) {
      // Elimina el ID de la lista de edición y los cambios realizados
      this.editandoElementosIds.splice(index, 1);
      delete this.elementosEditados[element.id];
    }
  }

  ngOnInit(): void {
    this.userNameSubscription = this.auth.getUserName().subscribe(userName => {
      this.userName = userName;
    });

    this.ObtenerElementos();    
    this.displayedColumns = ['numero','nombre_empleado','nombre_dispositivo','haedware.marca','Serie','haedware.modelo',
                              'id_equipo','fecha_asignacion', 'fecha_devolucion','editar','borrado'];
  }
  ngOnDestroy(): void {
    this.userNameSubscription.unsubscribe(); 
  }

}
