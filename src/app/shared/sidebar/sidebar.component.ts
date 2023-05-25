import { Component, OnDestroy } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnDestroy {
  authUserName = '';
  authuserSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.authuserSubs = this.store
      .select('auth', 'user')
      .pipe(filter((user) => user != null))
      .subscribe((user) => (this.authUserName = user!.name));
  }

  ngOnDestroy(): void {
    this.authuserSubs.unsubscribe();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['login']);
      })
      .catch((error: FirebaseError) => {
        console.log('ERROR', error.message);
      });
  }
}
