import {Component, LOCALE_ID, PLATFORM_ID, Inject, OnInit, Renderer2} from '@angular/core';
import {APP_CONFIG} from '../../../configs/app.config';
import {ProgressBarService} from '../../services/progress-bar.service';
import {NavigationEnd, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  selectedLanguage: string;
  progressBarMode: string;
  currentUrl: string;
  languages: any[];
  isOnline: boolean;

  constructor(@Inject(APP_CONFIG) public appConfig: any,
              private progressBarService: ProgressBarService,
              private cookieService: CookieService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) doc: Document,
              @Inject(LOCALE_ID) locale: string,              
              @Inject(PLATFORM_ID) private platformId: object,
              private router: Router) {
    this.languages = [{name: 'en', label: 'English'}, {name: 'es', label: 'Español'}];

    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = window.navigator.onLine;
      window.addEventListener('offline', function(e) { console.log('offline'); });
      renderer.setAttribute(doc.documentElement, 'lang', locale);
    } else {
      this.isOnline = true;
    }

  }

  ngOnInit() {
    this.selectedLanguage = this.cookieService.get('language') || 'en';

    this.progressBarService.getUpdateProgressBar().subscribe((mode: string) => {
      this.progressBarMode = mode;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  changeLanguage(language: string): void {
    this.cookieService.put('language', language);
    this.selectedLanguage = language;
  }

}
