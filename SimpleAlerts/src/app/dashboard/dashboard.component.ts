import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';

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
  // twitchTokenRoute = 'http://localhost:8000/api/v1/twitch/token';
  streamlabsTokenRoute = 'http://localhost:8000/api/v1/streamlabs/token';
  twitchDisplayName: String;
  // email: String;
  streamLabsAuthUrl = 'https://www.streamlabs.com/api/v1.0/authorize' +
    '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
    '&redirect_uri=http://localhost:4200/dashboard' +
    '&response_type=code&scope=donations.read+socket.token';
  ws = new $WebSocket('ws://127.0.0.1:8080');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      // -- MAD PROPS Sliomere -- //
      // this.twitchAuthComplete = window.document.referrer;

      this.getStreamlabsData();

      // Setup Websocket //
      this.ws.onMessage(
        (msg: MessageEvent) => {
          let messageObj;

          try {
            messageObj = JSON.parse(msg.data);

            if (messageObj.type === 'new_follower') {
              console.log(messageObj.data);
            } else {
              console.log(messageObj.data);
            }
          } catch (error) {
            console.log('Error parsing JSON in SimpleAlertsSocket: ' + error);
          }
        },
        { autoApply: false }
      );

      /* if (this.twitchAuthComplete === '') {
        console.log('Coming from another auth redirect.');
        this.getStreamlabsData();
      } else {
        this.getTwitchData();
      } */
    });
  }

  // Helpers //
  generateToken() {
    return {
      code: this.code
    };
  }

  /* getTwitchData() {
    this.http
      .post(this.twitchTokenRoute, this.generateToken())
      .subscribe(data => {
        console.log('Received Twitch Data.');
        this.displayName = data['twitchDisplayName'];
        this.email = data['twitchEmail'];
      });
  } */

  getStreamlabsData() {
    this.http
      .post(this.streamlabsTokenRoute, this.generateToken())
      .subscribe(data => {
        console.log('Received Streamlabs Data.');
        this.twitchDisplayName = data['twitchDisplayName'];
      });
  }
}
