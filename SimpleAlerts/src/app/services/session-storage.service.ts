import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'simple-alerts-session';

@Injectable()
export class SessionStorageService {
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {}

  public setSessionData(userSession: any) {
    this.storage.set(STORAGE_KEY, userSession);
  }

  public getSessionData(): any {
    return this.storage.get(STORAGE_KEY);
  }
}
