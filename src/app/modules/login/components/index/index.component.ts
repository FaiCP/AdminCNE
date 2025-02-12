import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: false
})
export class IndexComponent implements OnInit {
  loginForm: FormGroup; // Formulario Reactivo
  errorMessage: string = ''; // Mensaje de error para el usuario
  isLoading: boolean = false; 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, 
    private toastr: ToastrService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]], 
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false; // Desactiva el mat-progress-bar al terminar
        this.toastr.success('Inicio de sesión exitoso!')
        
      }, 5000); // Simula un retraso de 3 segundos
    } 
    else 
    {
      alert('Por favor complete el formulario correctamente.');
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (response) => {
        this.router.navigate(['/'])
      },
      (respuestErr: any) => {
        this.toastr.error(respuestErr?.error?.mensajes?.join(','), 'Credenciales incorrectas');
      }
    );
    
  }
}
