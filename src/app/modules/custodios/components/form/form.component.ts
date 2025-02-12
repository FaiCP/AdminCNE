import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/Http.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements OnInit {

  cont:number = 6
  Cutodios = {
    nombre: '',
    cargo: '',
    cedula: '',
    id_departamento: '',
  }
    isDeviceLaptopOrComputer = false;

  CantidadPagina = 10;
  numerPagina = 0;
  textBusqueda = "";

  inventario: any[] = [];
departamentos: any;

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService
  ) { }

  Post(Cutodios: any ) {
    console.log("datos de custodio", this.Cutodios);
    this.HttpService.Post(this.Cutodios, 'Custodios/Crear')
      .subscribe((resOK: any) => {
        this.toastr.success("Custodio creado");
        console.log('Success:',resOK);
        
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  ObtenerDepartamentos() {
    
    this.HttpService.LeerTodo(50, this.numerPagina, this.textBusqueda, 'departamentos')
      .subscribe((resOK: any) => {
        this.departamentos = resOK.datos.elementos;
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  onCustodioChange(departamentoID: number): void {
    const selectedepartamento = this.departamentos.find((dep: { id_departamento: number; }) => dep.id_departamento === departamentoID);

  }

  onRegister(){
    this.Post(this.Cutodios);
  }
  ngOnInit(): void {
    this.ObtenerDepartamentos();
  }

}
