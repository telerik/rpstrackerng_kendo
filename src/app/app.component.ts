import { Component } from '@angular/core';
import { Store } from './core/state/app-store';
import { PtUser } from './core/models/domain';

import { environment as env } from '../environments/environment';
import { getUserAvatarUrl } from './core/helpers';

const tempCurrentUser = {
  avatar: getUserAvatarUrl(env.apiEndpoint, 21),
  dateCreated: new Date(),
  dateModified: new Date(),
  fullName: 'Alex Ziskind',
  id: 21
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.set<PtUser>('currentUser', tempCurrentUser);
  }
}
