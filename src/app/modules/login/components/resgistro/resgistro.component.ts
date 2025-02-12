import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-resgistro',
    templateUrl: './resgistro.component.html',
    styleUrls: ['./resgistro.component.scss'],
    standalone: false
})
export class ResgistroComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  isActive = false;
  isRegistering = false;

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
  }

  register() {
    // Aquí va la lógica para el registro
  }

}
