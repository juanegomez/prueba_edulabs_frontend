import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../shared/components/appbar/appbar.component';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AppbarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export default class PostsComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  posts: any[] = [];
  loading: boolean = true;
  selectedCategory: number = 1;
  showModal: boolean = false;
  newPost: any = {
    title: '',
    content: '',
    category_id: this.selectedCategory
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getPosts(this.selectedCategory);
  }

  // Función para obtener los posts por categoría
  getPosts(categoryId: number): void {
    const url = `${this.apiUrl}/posts/${categoryId.toString()}`;
    const token = (typeof window !== 'undefined' && localStorage.getItem('authToken')) || '';
    const headers = { Authorization: `Bearer ${token}` };

    this.loading = true;
    this.http.get(url, { headers }).subscribe({
      next: (data: any) => {
        this.posts = data.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Función para manejar el cambio de categoría
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = parseInt(selectElement.value, 10);
    this.getPosts(this.selectedCategory);
  }

  // Función para abrir el modal
  openModal(): void {
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para crear un post
  onSubmit(): void {
    const url = `${this.apiUrl}/posts`;
    const token = (typeof window !== 'undefined' && localStorage.getItem('authToken')) || '';
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(url, this.newPost, { headers }).subscribe({
      next: (data: any) => {
        // Agregar el nuevo post al principio de la lista
        this.posts.unshift(data.data);

        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Post creado con éxito',
          text: 'El nuevo post ha sido creado correctamente.',
          confirmButtonColor: '#111827',
        });

        // Cerrar el modal y resetear el formulario
        this.closeModal();
        this.newPost = { title: '', content: '', category_id: this.selectedCategory };
      },
      error: (err) => {
        // Mostrar SweetAlert de error
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el post',
          text: 'Hubo un problema al intentar crear el post. Inténtalo nuevamente.',
          confirmButtonColor: '#111827',
        });
        console.error(err);
      }
    });
  }
}