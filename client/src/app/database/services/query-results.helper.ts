import { inject, Injectable } from '@angular/core';
import { QueryResults, DataRow, Config } from '../models/model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_CONFIG } from '../../app.config';
import { SocketAsyncCalls } from './socket-async-calls';
import { encrypt } from './crypto';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private _matSnackBar = inject(MatSnackBar);
  private _config = inject(APP_CONFIG);
  private sockets = new SocketAsyncCalls(this._config.backendUrl);
  private publicKey = '';

  async executeQuery(config: Config, query: string) {
    try {
      if (!this.publicKey) {
        this.publicKey = await this.sockets.call<any>('public.key');
      }

      const result = await this.sockets.call<any>('oracle.query', {
        config: encrypt(config, this.publicKey),
        query,
      });
      return this._convertToData(result);
    } catch (ex: any) {
      this._matSnackBar.open(ex.message, undefined, { duration: 5000 });
      throw ex;
    }
  }

  private _convertToData = (data: QueryResults) => {
    return data.rows.map((row: QueryResults[]) => {
      const rowObject: DataRow = {};
      data.metaData.forEach((meta, index: number) => {
        rowObject[meta.name] = row[index];
      });
      return rowObject;
    });
  };
}
