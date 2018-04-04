import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // URI to get code to generate access_token on server //
  // tslint:disable-next-line
  // twitchAuthUrl = 'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=cj0lygivdrjkpcz4jxhwxk0xmbhpq8&redirect_uri=http://localhost:4200/dashboard&scope=user:read:email+channel_read+channel_subscriptions';
  streamLabsAuthUrl = 'https://www.streamlabs.com/api/v1.0/authorize' +
    '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
    '&redirect_uri=http://localhost:4200/dashboard' +
    '&response_type=code&scope=donations.read+socket.token';
  constructor() {}

  ngOnInit() {}
}
