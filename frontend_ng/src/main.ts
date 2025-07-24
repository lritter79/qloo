import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
        provideAnimations(),
        provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // This provides HttpClient
        provideEventPlugins(),
        provideEventPlugins(),
        provideEventPlugins()
    ],
}).catch((err) => console.error(err));
