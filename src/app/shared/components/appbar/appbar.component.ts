import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})
export class AppbarComponent {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  logout(): void {
    const url = `${this.apiUrl}/logout`;
    const token = localStorage.getItem('authToken') || '';

    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(url, {}, { headers }).subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
    });
  }
}