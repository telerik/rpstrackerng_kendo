import { Component } from '@angular/core';
import { Store } from './core/state/app-store';
import { PtUser } from './core/models/domain';

import { environment as env } from '../environments/environment';
import { getUserAvatarUrl } from './core/helpers';
import { RouterOutlet } from '@angular/router';
import { MainMenuComponent } from './shared/components/main-menu/main-menu.component';
import { AppBarComponent } from './shared/components/app-bar/app-bar.component';

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
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet, MainMenuComponent, AppBarComponent]
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.set<PtUser>('currentUser', tempCurrentUser);
  }
}
