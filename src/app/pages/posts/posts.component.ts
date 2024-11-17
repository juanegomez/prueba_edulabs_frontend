import { Component } from '@angular/core';
import { AppbarComponent } from '../../shared/components/appbar/appbar.component';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AppbarComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export default class PostsComponent {

}
