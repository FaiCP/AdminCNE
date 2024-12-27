import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {
  personal = {
  cedula: '',
  nombre: '',
  cargo: ''
  };

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService
  ) { }


  Post(personal: any) {
    this.HttpService.Post(this.personal, 'Personal/Crear')
      .subscribe((resOK: any) => {
        this.toastr.success("Elemento creado");
        console.log('Success:',resOK);
        
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  onRegister() {
    console.log(this.personal);
    this.Post(this.personal);
  }

  ngOnInit(): void {

  }
}
