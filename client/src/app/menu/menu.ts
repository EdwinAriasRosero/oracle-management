import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TabsConfigService } from '../database/services/tabs.config.service';

@Component({
  selector: 'app-menu',
  imports: [RouterModule, MatMenuModule, MatButtonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  tabsConfigService = inject(TabsConfigService);
}
