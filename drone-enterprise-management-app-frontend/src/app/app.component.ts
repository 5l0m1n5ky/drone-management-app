import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { Subscription, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from './shared/toast/toast.service';
import { environment } from 'src/environments/environment';
import * as Aos from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ToastService],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) { }

  userSubscription: Subscription;

  queryParamsSubscriber: Subscription;

  isAuthenticated: boolean = false;

  title = 'drone-enterprise-management-app';

  queryParams: any = {};

  ngOnInit(): void {
    Aos.init();
    this.loginService.user.pipe(take(1)).subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.queryParams = params;

        if (
          this.queryParams['result'] &&
          this.queryParams['result'] === 'success'
        ) {
          this.toastService.generateToast(
            'success',
            'Logowanie',
            'Zalogowano pomyślnie'
          );
        }
      }
    );

    this.loginService.autoLogin();

    this.addGoogleMapsScript();
  }

  getLoginState(): boolean {
    if (this.cookieService.get('user') || this.isAuthenticated) {
      return true;
    } else {
      return false;
    }
  }

  addGoogleMapsScript() {
    const script = document.createElement('script');
    const scriptContent =
      `
      (g => {
        var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
          await (a = m.createElement("script"));
          e.set("libraries", [...r] + "");
          for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
          e.set("callback", c + ".maps." + q);
          a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
          d[q] = f;
          a.onerror = () => h = n(Error(p + " could not load."));
          a.nonce = m.querySelector("script[nonce]")?.nonce || "";
          m.head.append(a);
        }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
      })({
        v: "weekly",
        key: "` +
      environment.googleMapsApiKey +
      `"
      });
    `;

    script.type = 'text/javascript';
    script.appendChild(document.createTextNode(scriptContent));
    document.head.appendChild(script);
  }

  changeLoginState() {
    this.isAuthenticated = false;
    if (this.getLoginState()) {
      this.cookieService.delete('user');
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.queryParamsSubscriber?.unsubscribe();
  }
}
