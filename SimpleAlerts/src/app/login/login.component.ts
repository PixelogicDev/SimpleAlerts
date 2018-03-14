import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  twitchAuthUrl = 'https://passport.twitch.tv/sessions/new?client_id=cj0lygivdrjkpcz4jxhwxk0xmbhpq8&oauth_request=false&redirect_path=https%3A%2F%2Fid.twitch.tv%2Foauth2%2Fauthorize%3Fclient_id%3Dcj0lygivdrjkpcz4jxhwxk0xmbhpq8%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A8000%2Fapi%2Fv1%2Ftwitch%2Fauth%2Fsuccess%26response_type%3Dtoken%2Bid_token%26scope%3Duser%3Aread%3Aemail%2Bopenid&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fv1%2Ftwitch%2Fauth%2Fsuccess&response_type=token+id_token&scope=user%3Aread%3Aemail+openid&username=';
  
  constructor() { }

  ngOnInit() {
  }

}
