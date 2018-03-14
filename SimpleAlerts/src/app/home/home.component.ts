import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authSuccessUrl = 'http://localhost:8000/api/v1/twitch/auth/success';
  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.http.get(this.authSuccessUrl).subscribe(data => {
          console.log(data);
      });
  }

}
