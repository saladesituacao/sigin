import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { ParametroService } from '../../../services/index';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  private orgao: string;
  constructor(private router: Router, private parametroService:ParametroService) {
  }

  ngOnInit() {
    this.parametroService.change.subscribe(parametros=>{
        this.orgao = parametros.company;
    });
  }


  searchMobileActive = false;

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }
}
