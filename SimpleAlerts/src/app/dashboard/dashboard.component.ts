import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Properties //
  // Need to save code from URI in order to generate access_tokens //
  // To get access token will need to post to server //
  code: String;
  tokenUrl = 'http://localhost:8000/api/v1/twitch/token';
  displayName: String;
  email: String;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      this.generateToken();
    });
  }

  // Helpers //
  generateToken() {
    const json = {
      code: this.code
    };

    this.http.post(this.tokenUrl, json).subscribe(data => {
      this.displayName = data['displayName'];
      this.email = data['email'];
    });
  }
}
