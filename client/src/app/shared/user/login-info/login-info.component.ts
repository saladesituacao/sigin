import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {LayoutService} from "../../layout/layout.service";
import { Subscription }   from 'rxjs/Subscription';

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  user:object;
  subscription: Subscription;

  constructor(
    private userService: UserService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
  }


  toggleShortcut() {
    this.layoutService.onShortcutToggle();
  }

}
