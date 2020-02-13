import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Hero} from '../../shared/hero.model';
import {HeroService} from '../../shared/hero.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UtilsHelperService} from '../../../../shared/services/utils-helper.service';
import {HeroRemoveComponent} from '../../components/hero-remove/hero-remove.component';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';
import {ROUTES_CONFIG} from '../../../../configs/routes.config';
import {CookieService} from 'ngx-cookie';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-heroes-list-page',
  templateUrl: './heroes-list-page.component.html',
  styleUrls: ['./heroes-list-page.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {
      params: {timing: 1, delay: 0}
    }))])
  ]
})

export class HeroesListPageComponent implements OnInit {

  orders: Hero[];
  newHeroForm: FormGroup;
  canVote = false;
  error: boolean;

  @ViewChild('form', {static: false}) myNgForm; // just to call resetForm method

  constructor(private heroService: HeroService,
              private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private i18n: I18n,
              private formBuilder: FormBuilder,
              private cookieService: CookieService,
              @Inject(ROUTES_CONFIG) public routesConfig: any) {
    this.canVote = this.heroService.checkIfUserCanVote();

    this.newHeroForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      order: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      alterEgo: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });

    this.onChanges();
  }

  ngOnInit() {
    this.heroService.getHeroes().subscribe((orders: Array<Hero>) => {
      this.orders = orders;
    });
  }

  async createNewOrder() {
    if (this.newHeroForm.valid) {
      this.newHeroForm.value.orderStatus = 'DRAFT';
      this.heroService.createHero(new Hero(this.newHeroForm.value)).then(() => {
        this.myNgForm.resetForm();
        this.snackBar.open(this.i18n({value: 'Order created', id: '@@heroCreated'}), '', {duration: 1000});
      }, () => {
        this.error = true;
      });
    }
  }

  like(order: Hero) {
    this.canVote = this.heroService.checkIfUserCanVote();
    if (this.canVote) {
      order.like();
      this.cookieService.put('votes', '' + (Number(this.cookieService.get('votes') || 0) + 1));
      this.heroService.updateHero(order);
    } else {
      this.snackBar.open(this.i18n({value: 'Can\'t vote anymore', id: '@@cannotVote'}), '', {duration: 1000});
    }
  }

  async send(order: Hero) {
    order.orderStatus = "SENT";
    this.heroService.updateHero(order);
    await this.userService.sendOrder(order)
    .subscribe(resposta => {
      console.log("ok");
    }, (err) => {
      console.log("Erro: ");
    });
  }

  deleteHero(order: Hero) {
    const dialogRef = this.dialog.open(HeroRemoveComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.deleteHero(order.id).then(() => {
          this.heroService.showSnackBar(this.i18n({value: 'Order removed', id: '@@heroRemoved'}));
        }, () => {
          this.error = true;
        });
      }
    });
  }

  trackByFn(index: any) {
    return index;
  }

  private onChanges() {
    this.newHeroForm.get('name').valueChanges.subscribe((value) => {
      if (value && value.length >= 3 && UtilsHelperService.isPalindrome(value)) {
        this.snackBar.open(this.i18n({value: 'Yeah that\'s a Palindrome!', id: '@@yeahPalindrome'}), '', {duration: 2000});
      } else {
        this.snackBar.dismiss();
      }
    });
  }

}
