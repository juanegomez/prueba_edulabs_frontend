import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  private apiUrl = environment.apiUrl;
  passwordVisible = false;

  constructor(private http: HttpClient, private router: Router) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      this.login(formData).subscribe(
        response => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
          }

          this.router.navigate(['/home']);
        },
        error => {
          if (error.error && error.error.errors) {
            this.setServerErrors(error.error.errors);
          }

          Swal.fire({
            title: 'Error',
            text: error.error.message || 'Hubo un problema al iniciar sesión.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#111827',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Contraseña o email invalidos.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#111827',
      });
    }
  }

  login(data: { email: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, data);
  }

  setServerErrors(errors: any) {
    for (const field in errors) {
      if (this.form.contains(field)) {
        const control = this.form.get(field);
        if (control) {
          control.setErrors({ serverError: errors[field] });
        }
      }
    }
  }
}