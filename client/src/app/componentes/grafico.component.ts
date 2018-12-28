import {Component, OnInit, EventEmitter, Output, ElementRef, AfterContentInit, Input} from '@angular/core';
import {WindowRef} from './WindowRef';

declare var Morris:any;
declare var $: any;

@Component({

  selector: 'grafico',
  template: `
    <div class="row">
      <div class="col-md-12">
        <div id="grafico" style="width:1317;height:342"></div>
      </div>
     </div>
  `,
  styles: []
})
export class GraficoComponent implements AfterContentInit {

  @Input() public data:any;
  @Input() public options:any;
  @Input() public type:string;
  @Output() public onInit: EventEmitter<number> = new EventEmitter<number>();

  private graph;

  constructor(private el:ElementRef, private winRef: WindowRef,) {
  }

  ngAfterContentInit() {
    System.import('script-loader!raphael').then(()=> {
      return System.import('morris.js/morris.js')
    }).then(()=> {
      this.render();
      this.onInit.emit();
    });
  }

  render(){
    let options = this.options || {};
    //options.element = this.el.nativeElement.children[0];
    options.element = 'grafico';
    options.data = this.data || [];

    switch (this.type) {
      case 'area':
        this.graph = Morris.Area(options);
        break;
      case 'bar':
        this.graph = Morris.Bar(options);
        break;
      case 'line':
        this.graph = Morris.Line(options);
        break;
      case 'donut':
        this.graph = Morris.Donut(options);
        break;
    }

    $("#grafico svg").css('width', '100%');
    console.log('Conteudo', $("#grafico svg"));
    //$(window).on('resize', function() {
    //  this.graph.redraw()
    //});

  }

  redraw(){
    this.graph.redraw();
  }

  add(arr){
    console.log('data source:', arr);
    this.graph.setData(arr);
    this.graph.redraw();
  }

}
