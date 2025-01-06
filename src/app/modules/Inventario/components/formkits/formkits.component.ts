import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formkits',
  templateUrl: './formkits.component.html',
  styleUrls: ['./formkits.component.scss']
})
export class FormkitsComponent implements OnInit {

  kits = {
    id:'',
    INSUMO: '',
    MODELO: '',
    MARCA: '',
    Serie:'',
    ESTADO: '',
    CANTIDAD :'',
    OBSERVACION:''
  }
  CantidadPagina = 10;
  numerPagina = 0;
  textBusqueda = "";

  inventario: any[] = [];

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService
  ) { }


  Post(Kits: any ) {
    this.HttpService.Post(this.kits, 'Kits/Crear')
      .subscribe((resOK: any) => {
        this.toastr.success("Elemento creado");
        console.log('Success:',resOK);
        
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }


  onRegister(){
    this.Post(this.kits);
  }  

  ngOnInit(): void {

  }

}
