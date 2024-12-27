import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-global',
  templateUrl: './menu-global.component.html',
  styleUrls: ['./menu-global.component.scss']
})
export class MenuGlobalComponent implements OnInit {
  userName: string | null = null;
  private userNameSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router,) {}

  ngOnInit(): void {
    this.userNameSubscription = this.authService.getUserName().subscribe(userName => {
      this.userName = userName;
    });

    if (this.authService.isAuthenticated()) {
      this.userName = localStorage.getItem('userName');
    }
  }

  ngOnDestroy(): void {
    this.userNameSubscription.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout(); 
    this.userName = null; 
    this.router.navigate(['/']); 
  }

}
