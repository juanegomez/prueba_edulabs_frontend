import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../shared/components/appbar/appbar.component';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AppbarComponent, HttpClientModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export default class PostsComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  posts: any[] = [];
  loading: boolean = true;
  selectedCategory: number = 1;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getPosts(this.selectedCategory);
  }

  getPosts(categoryId: number): void {
    const url = `${this.apiUrl}/posts/${categoryId.toString()}`;

    const token = (typeof window !== 'undefined' && localStorage.getItem('authToken')) || '';

    const headers = { Authorization: `Bearer ${token}` };

    this.loading = true;

    this.http.get(url, { headers }).subscribe({
      next: (data: any) => {
        this.posts = data.data;
        console.log(this.posts);
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = parseInt(selectElement.value, 10);
    this.getPosts(this.selectedCategory);
  }
}