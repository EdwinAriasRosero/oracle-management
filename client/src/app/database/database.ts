import { Component, inject } from '@angular/core';
import { WorkingArea } from './working-area/working-area';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsConfigService } from './services/tabs.config.service';

@Component({
  selector: 'app-database',
  imports: [MatTabsModule, WorkingArea, MatIconModule, MatButtonModule],
  templateUrl: './database.html',
  styleUrl: './database.scss',
})
export class Database {
  tabsConfigService = inject(TabsConfigService);
}
