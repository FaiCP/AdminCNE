import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements OnInit {

  ingreso = {
    ubicacion:'',
    descripcion: '',
    nombre_dispositivo:'',
    marca: '',
    modelo: '',
    codigo_cne :'',  
    id_equipo: '',
    estado:'',  
    ram:'',
    rom:'',
    procesador:'',
    valor:''
  }
    isDeviceLaptopOrComputer = false;
    isIdKits = false;

  CantidadPagina = 10;
  numerPagina = 0;
  textBusqueda = "";

  inventario: any[] = [];

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService
  ) { }

  ObtenerInventario(){
    this.HttpService.LeerTodo(this.CantidadPagina,this.numerPagina,this.textBusqueda,'Hardware/LeerTodo')
    .subscribe((resOK: any) => {
      this.inventario = resOK.datos.elementos;
    },
    (respuestErr: any) =>{
      this.toastr.error(respuestErr?.error?.mensajes?.join(','),'Error');
    });
  }

  Post(ingreso: any ) {
    this.HttpService.Post(this.ingreso, 'Hardware/Crear')
      .subscribe((resOK: any) => {
        this.toastr.success("Elemento creado");
        console.log('Success:',resOK);
        
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
        console.log(this.ingreso);
      });
  }


  onRegister(){
    this.Post(this.ingreso);
    this.ObtenerInventario();
  }

  onDeviceChange(value: string) {
    const validDevices = ['computadora', 'laptop', 'cpu','computadora portatil']; // Lista de dispositivos válidos
    this.isDeviceLaptopOrComputer = validDevices.includes(value.toLowerCase());
  }
  

  onIdChange(value: string) {
    const regex = /^KITS\d+$/;
    this.isIdKits = regex.test(value); // Cambia el estado según la validación
  }
  

  ngOnInit(): void {

  }

}
