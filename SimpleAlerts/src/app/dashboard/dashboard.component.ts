import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';

// Models //
import { Follower } from '../shared/models/follower.model';
import { Donation } from '../shared/models/donation.model';
import { Subscription } from '../shared/models/subscription.model';
import { Cheer } from '../shared/models/cheer.model';

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
  ws: $WebSocket;
  streamlabsTokenRoute = 'http://localhost:8000/api/v1/streamlabs/token';
  twitchDisplayName: String;
  username: String;
  streamLabsAuthUrl = 'https://www.streamlabs.com/api/v1.0/authorize' +
    '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
    '&redirect_uri=http://localhost:4200/dashboard' +
    '&response_type=code&scope=donations.read+socket.token';
  // email: String;
  // twitchTokenRoute = 'http://localhost:8000/api/v1/twitch/token';

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

      this.getStreamlabsData(() => {
        // Setup Websocket //
        this.ws.onMessage(
          (msg: MessageEvent) => {
            let eventObj;

            try {
              eventObj = JSON.parse(msg.data);
              const eventType = this.generateEventType(eventObj);
              console.log(eventType);
            } catch (error) {
              console.log('Error parsing JSON in SimpleAlertsSocket: ' + error);
            }
          },
          {
            autoApply: false
          }
        );
      });
      /* if (this.twitchAuthComplete === '') {
        console.log('Coming from another auth redirect.');
        this.getStreamlabsData();
      } else {
        this.getTwitchData();
      } */
    });
  }

  // Helpers //
  getStreamlabsData(complete) {
    this.http
      .post(this.streamlabsTokenRoute, { code: this.code })
      .subscribe(data => {
        console.log('Received Streamlabs Data.');
        this.twitchDisplayName = data['twitchDisplayName'];
        this.username = data['username'];
        this.ws = new $WebSocket(
          `ws://127.0.0.1:8080/?user=${data['username']}`
        );

        complete();
      });
  }

  generateEventType(json: any): any {
    switch (json.type) {
      case 'new_follower':
        return new Follower(json.data);
      case 'new_donation':
        return new Donation(json.data);
      case 'new_subscription':
        return new Subscription(json.data);
      case 'new_resubscription':
        return new Subscription(json.data);
      case 'new_cheer':
        return new Cheer(json.data);
      case 'connection_open':
        return json.data;
    }
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
}
