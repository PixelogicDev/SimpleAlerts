import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RootComponent } from './root/root.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventListComponent } from './event-list/event-list.component';

import { MessageService } from './services/message.service';
import { Filter } from './shared/models/filters/filter.model';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { SessionStorageService } from './services/session-storage.service';

// Material Design //
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FollowerEventCellComponent } from './event-cells/follower-event-cell/follower-event-cell.component';
import { SubscriberEventCellComponent } from './event-cells/subscriber-event-cell/subscriber-event-cell.component';
import { AmountEventCellComponent } from './event-cells/amount-event-cell/amount-event-cell.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RemoveEventListModalComponent } from './common/remove-event-list-modal/remove-event-list-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    LoginComponent,
    DashboardComponent,
    EventListComponent,
    FollowerEventCellComponent,
    SubscriberEventCellComponent,
    AmountEventCellComponent,
    RemoveEventListModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    }),
    MatSlideToggleModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    StorageServiceModule,
    MatGridListModule
  ],
  entryComponents: [RemoveEventListModalComponent],
  providers: [MessageService, SessionStorageService, Filter],
  bootstrap: [RootComponent]
})
export class AppModule {}
