import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // URI to get code to generate access_token on server //
  streamLabsAuthUrl = environment.streamLabsAuthUrl;
  constructor() {}

  ngOnInit() {}

  scrollToSection(element: any) {
    element.scrollIntoView();
  }
}
