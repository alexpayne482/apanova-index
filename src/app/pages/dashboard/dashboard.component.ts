import { Component, HostBinding, OnInit } from '@angular/core';

import { AuthService } from '@services/*';
import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-dashboard',
  // styleUrls: ['../charts/charts.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  // @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;

  public user;

  constructor(public authService: AuthService) {
    super();
  }

  public ngOnInit() {
    this.authService.userData.subscribe(user => this.user = user);
  }
}
