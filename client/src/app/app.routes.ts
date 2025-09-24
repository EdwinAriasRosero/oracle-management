import { Routes } from '@angular/router';
import { FileSharer } from './file-sharer/file-sharer';
import { Database } from './database/database';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'database',
    pathMatch: 'full',
  },
  {
    path: 'database',
    component: Database,
  },
  {
    path: 'files',
    component: FileSharer,
  },
];
