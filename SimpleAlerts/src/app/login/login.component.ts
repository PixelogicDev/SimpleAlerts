import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // URI to get code to generate access_token on server //
  streamLabsAuthUrl = 'https://www.streamlabs.com/api/v1.0/authorize' +
  '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
  '&redirect_uri=http://localhost:4200/dashboard' +
  '&response_type=code&scope=donations.read+socket.token';
  constructor() {}

  ngOnInit() {}

  scrollToSection(element: any) {
    element.scrollIntoView();
  }
}
