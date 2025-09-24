import { inject, Injectable, signal } from '@angular/core';
import { TabConfig } from '../models/model';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ConfigDbConnection } from '../config-db-connection/config-db-connection';

Injectable();
export class TabsConfigService {
  matDialog = inject(MatDialog);

  tabs = signal<TabConfig[]>([]);

  addTab() {
    this.matDialog
      .open<void, TabConfig>(ConfigDbConnection, { width: '50%' })
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe((result) => {
        this.tabs.update((current) => [...current, result]);
      });
  }

  closeTab(tab: TabConfig) {
    this.tabs.update((current) => current.filter((c) => c !== tab));
  }
}
