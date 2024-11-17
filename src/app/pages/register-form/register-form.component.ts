import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export default class RegisterFormComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*[a-zA-Z0-9]).{8,}$')
    ]),    
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  private apiUrl = environment.apiUrl;
  passwordVisible = false;
  confirmPasswordVisible = false;


  constructor(private http: HttpClient, private router: Router) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Función para registrar a un usuario
  onSubmit(): void {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Por favor, asegúrese de que las contraseñas coincidan.',
        confirmButtonColor: '#111827',
      });
      return;
    }

    const url = `${this.apiUrl}/register`;
    const user = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.http.post(url, user).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado con éxito',
          text: 'Ahora puede iniciar sesión con su cuenta.',
          confirmButtonColor: '#111827',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el usuario',
          text: 'Hubo un problema al intentar crear su cuenta. Intente nuevamente.',
          confirmButtonColor: '#111827',
        });
        console.error(err);
      }
    });
  }
}