import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

/**
 * The default pagination controls component. Actually just a default implementation of a custom template.
 */
@Component({
    selector: 'paginacao',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    template: `
        <pagination-template  #p="paginationApi"
                             [id]="id"
                             [maxSize]="maxSize"
                             (pageChange)="pageChange.emit($event)">
            <ul class="pagination" role="navigation" *ngIf="!(autoHide && p.pages.length <= 1)">
                 <li class="page-item" [class.disabled]="p.isFirstPage()" >
                    <a class="page-link" href="javascript:void(0);" (click)="p.previous()">
                      <i class="fa fa-arrow-left"></i>
                    </a>

                 </li>
                 <li class="page-item" [class.active]="p.getCurrent() === page.value" *ngFor="let page of p.pages">
                     <a (click)="p.setCurrent(page.value)" href="javascript:void(0);">{{ page.label }}</a>
                 </li>
                 <li class="page-item" [class.disabled]="p.isLastPage()" >
                     <a  (click)="p.next()" href="javascript:void(0);">
                        <i class="fa fa-arrow-right"></i>
                    </a>
                 </li>
             </ul>
          </pagination-template>
        `
})
export class PaginacaoComponent {

    @Input() id: string;
    @Input() maxSize: number = 7;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    private _autoHide: boolean = false;

    get autoHide(): boolean {
        return this._autoHide;
    }
    set autoHide(value: boolean) {
        this._autoHide = !!value && <any>value !== 'false';
    }

}
