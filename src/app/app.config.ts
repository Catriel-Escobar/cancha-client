import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizationInterceptorInterceptor } from './core/interceptors/authorization-interceptor.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptorInterceptor])),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideStoreDevtools({
      maxAge: 25, // Retiene últimos 25 estados
      logOnly: false, // Recomendado a true en producción
      autoPause: true, // Pausa la grabación de acciones cuando la ventana pierde el foco
      trace: false, // Si true, incluirá stack trace para cada acción
      traceLimit: 75, // Número máximo de frames del stack trace
      connectInZone: true, // Asegura que las actualizaciones de DevTools disparen change detection
    }),
  ],
};
