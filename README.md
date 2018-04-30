# SimpleAlerts

Never miss another shoutout again. SimpleAlerts is a streaming tool that helps organize your alerts by using meaningful filters.

### Introduction

SimpleAlerts was created to help streamers visualize their stream events in a way that is more intuitive. It offers a way to separate your events into whatever groupings makes the most sense to you.

The simplisitic UI of SimpleAlerts makes it easy to get started and understand how to apply different filters to your events. These filters can help keep you on track with shouting out your loyal viewers.

SimpleAlerts is part of the PixelogicDev 28 Day Projects stream. Visit the channel [here](https://www.twitch.tv/pixelogicdev) to see more projects like this!

### Tech

SimpleAlerts was built using all Javascript tech in a full stack soluton:<br>
**_Client_**: Angular v5.2.0<br>
**_Server_**: Node.js v8.9.4<br>
**_Storage_**: MongoDB v3.4.3<br>
**_Note: SimpleAlerts has only been tested in Google Chrome browser._**

### How to use

#### Event Lists

SimpleAlerts revolves around separating out your stream events into a way that makes sense for you. These events include donations, cheers, follows, and subscriptions. Each one of these events can be added to an event list individually or all together.

#### Event Cells

Each event list will only show cells based on the event enabled for that list. When you are done shouting out the event, click the cell to mark it as read. When you are ready to remove it, click the "REMOVE" button on the right of the cell to completely remove it from your list.

#### Filters

The key behind SimpleAlerts is its filter system. This system helps you to never miss an event again. Each event has specific filters that can be applied to them.

##### All Events

All events have one filter in common which is the "Bump By Time" filter. By enabling this filter, events that pass a minute threshold you set will be bumped to the top of its resepctive event list.

##### Donations & Cheers

Donations and Cheers have the ability to be filtered by amount. For example,by enabling the "Bump By Amount" filter, any donation at that amount or higher will be bumped to the top of its respective event list. This logic also applies for the "Bump By Bits" filter.

##### Subscriptions

Subscriptions have become a large part of Twitch and are also a large part of SimpleAlerts! With subscriptions you have the ability to enable two filters, "Bump By Months" & "Bump By Tier". "Bump By Months" will push events to the top of its respective list when a resub month threshold has occured. "Bump By Tier" has the same concept. If an event with a specific tier level is hit or passed, the event will be bumped to the top of its respective list.

### Contributing

SimpleAlerts is an open source application that is looking for contributions! If you are interested in contributing and/or found a bug, please see below to get started with contributing.

#### Github Issues

All contributing will be done through Github Issues. If you have a bug/improvement please create a Github Issue in this repository.

#### Angular Client

SimpleAlerts runs an Angular client that is simple to get up and running.

##### ENV Properties

TODO

##### Start Client

When you are ready to run the client, follow these commands:

* `cd SimpleAlerts`
* `npm install`
* `ng serve`
* Visit `localhost:4200`

This will run and build the client. At this point you are good to go with the client side.

#### Node Server

SimpleAlerts uses a Node.js server in order to handle events from Streamlabs. There are many environment properties that need to be set before running the server.

##### ENV Properties

Start by creating a `.env` file that will store these properties:

* `NODE_ENV` -> This can be set to `dev`
* `STREAMLABS_CLIENT_ID` -> This is required to get data from Streamlabs. Go [here](https://streamlabs.readme.io/docs/registering-an-application) to see how to setup up a test applcation.
* `STREAMLABS_SECRET` -> This will be given to you when registering an application from the link above.
* `STREAMLABS_REDIRECT_URI` -> This is the URL that is redirected to after Streamlabs auth occurs. Use `http://localhost:4200/dashboard` for local dev.
* `DB_URL` -> This will be the url for your local database. This path should work: `mongodb://localhost:27017`
* `DB_NAME` -> This is the name of your local database. Feel free to create whatever name you like. I used `simple-alerts`.

##### Start Server

When you are ready to run the server, follow these commands:

* `cd SimpleAlerts-Server`
* `npm install && npm start`

#### MongoDB Storage

SimpleAlerts uses a MongoDB Database that stores very basic user settings. Here is a list of everything being stored in the database:
`id` -> Streamlabs UserID<br>
`twitchDisplayName` -> Twitch Display Name<br>
`username` -> Streamlabs username<br>
`settings` -> Any event list settings such as threshold, which events are on/off, etc.

##### Install MongoDB

Make sure to have MongoDB installed before you run it by following [this doc](https://docs.mongodb.com/manual/installation/).

##### Start Database

Before starting up the database make sure to do these commands:

* Open up a terminal window and type `mongod`
* Open up another terminal window and type `mongo`
* In the `mongo` terminal use command `use MyDatabaseName`. This will create a local database (Don't forget to add the name of your db to your server `.env` file).

This setup will only happen the first time around. Every other time after do these commands:

* Open up a terminal window and type `mongod`
* Open up another terminal window and type `mongo`
* In the `mongo` terminal use command `use MyDatabaseName`.

### Thank you

I want to give a huge shoutout to Streamlabs for their awesome API docs and services. Without them, SimpleAlerts would not be alive!
Also huge shoutout to the following projects used in SimpleAlerts:<br>
[`angular2-websocket`](https://github.com/afrad/angular2-websocket)<br>
[`moment`](https://github.com/moment/moment)<br>
[`ngx-webstorage-service`](https://github.com/dscheerens/ngx-webstorage-service)<br>
[`body-parser`](https://github.com/expressjs/body-parser)<br>
[`cors`](https://github.com/expressjs/cors)<br>
[`dotenv`](https://github.com/motdotla/dotenv)<br>
[`express`](https://github.com/expressjs/express)<br>
[`mongodb`](https://github.com/mongodb/node-mongodb-native)<br>
[`streamlabs-socket-client`](https://github.com/tehkhop/streamlabs-socket-client)<br>
[`ws`](https://github.com/websockets/ws)
