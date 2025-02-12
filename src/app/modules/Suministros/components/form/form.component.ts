import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { HttpService } from 'src/app/services/Http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements OnInit {

  CantidadPagina = 1000;
  opcionesFiltradas1: any[] = [];
  EquipoSeleccionado1: string = '';
  opcionesFiltradas2: any[] = [];
  EquipoSeleccionado2: string = '';

  Suministro = {
    id_equipo: '',
    id_equipoAsignado: '',
    tipo_suministro: '',
    };

    Equipos = {
      id_equipo: '',
      nombre_dispositivo: '',
      };

      Hardwares: any[] = [];

  constructor(
    private HttpService: HttpService,
    private toastr: ToastrService
  ) { }

  ObtenerHardwares() { 
    this.HttpService.LeerTodo(this.CantidadPagina, 0, '', 'Hardware/LeerTodo')
      .subscribe((resOK: any) => {
        this.Hardwares = resOK.datos.elementos;
        this.opcionesFiltradas1 = [...this.Hardwares];
        this.opcionesFiltradas2 = [...this.Hardwares];
        console.log(this.Hardwares)
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  Post(Suministro: any) {
    this.HttpService.Post(this.Suministro, 'Suministros/Crear')
      .subscribe((resOK: any) => {
        this.toastr.success("Elemento creado");
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Error');
      });
  }

  filtrarOpciones(event: Event, tipo: string): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.toLowerCase();

    if (tipo === 'primero') {
      this.opcionesFiltradas1 = this.Hardwares.filter(
        (hardware) =>
          hardware.id_equipo.toString().toLowerCase().includes(texto) ||
          hardware.nombre_dispositivo.toLowerCase().includes(texto)
      );
    } else if (tipo === 'segundo') {
      this.opcionesFiltradas2 = this.Hardwares.filter(
        (hardware) =>
          hardware.id_equipo.toString().toLowerCase().includes(texto) ||
          hardware.nombre_dispositivo.toLowerCase().includes(texto)
      );
    }
  }
  

  onRegister() {
    console.log(this.Suministro);
    this.Post(this.Suministro);
  }

  ngOnInit(): void {
    this.ObtenerHardwares();
  }

}
