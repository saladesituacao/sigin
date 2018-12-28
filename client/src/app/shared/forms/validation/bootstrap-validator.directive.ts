//
// FIX: Manutencao no componente efetuada em 03/02/2018
// Descricao: Fazer com que o formulario so seja submetido apos a validacao do jquery
//    parece que com o html5, mesmo com return false da funcao (submit), o formulario ainda estar
//    sendo submetido.  Agora deve-se programar um evento (onSubmit) = "funcao".  So executa se
//   validacao ok.

import {Directive, Input, ElementRef, EventEmitter, OnInit, HostBinding, HostListener, Output} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[saBootstrapValidator]'
})
export class BootstrapValidatorDirective implements OnInit {

  @Input() saBootstrapValidator:any;
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('submit')  s = ()=>{
    const bootstrapValidator = this.$form.data('bootstrapValidator');
    bootstrapValidator.validate();
    if(bootstrapValidator.isValid())
      this.onSubmit.emit(this.$form);
    else return;
  }

  constructor(private el:ElementRef) {

  }

  ngOnInit(){
    System.import('script-loader!smartadmin-plugins/bower_components/bootstrapvalidator/dist/js/bootstrapValidator.min.js').then(()=> {
      this.attach()
    })
  }

  private $form: any;


  private attach() {

    this.$form = $(this.el.nativeElement)
    this.$form.bootstrapValidator(this.saBootstrapValidator || {})

    this.$form.submit(function(ev){ev.preventDefault();});

  }

  isValid(){
    const bootstrapValidator = this.$form.data('bootstrapValidator');
    return bootstrapValidator.isValid();
  }

}
