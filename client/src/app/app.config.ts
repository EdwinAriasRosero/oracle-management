import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injectable,
  InjectionToken,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withJsonpSupport,
} from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { firstValueFrom } from 'rxjs';
import { TabsConfigService } from './database/services/tabs.config.service';

@Injectable({
  providedIn: 'root',
})
export class APP_CONFIG {
  backendUrl: string = '';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(MonacoEditorModule.forRoot()),
    provideAppInitializer(async () => {
      const http = inject(HttpClient);
      const config = inject(APP_CONFIG);
      const result = await firstValueFrom(http.get<any>('./config.json'));
      config.backendUrl = result.backendUrl;
    }),
    TabsConfigService,
  ],
};
