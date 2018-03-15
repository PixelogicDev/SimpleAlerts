import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //-- Properties --//
  // Need to save code from URI in order to generate access_tokens //
  // To get access token will need to post to server //
  code: String;
  
  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router) { }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
           this.code = params['code']);
           console.log(this.code); 
      });
  }