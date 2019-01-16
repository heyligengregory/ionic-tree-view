import { Component, Input } from '@angular/core';

@Component({
  selector: 'tree-view-items',
  template: `
        <ion-item class="item item-checkbox {{'itemLevel-' + item.itemLevel}}">
            <tree-view-item [item]="item" [treeViewName]="treeViewName" [persistedName]="persistedName"></tree-view-item>
        </ion-item>
        <ion-list *ngFor="let loopItem of item.items" [hidden]="loopItem.collapsed">
            <tree-view-items [item]="loopItem" [treeViewName]="treeViewName" [persistedName]="persistedName"></tree-view-items>
        </ion-list>
  `,
  styles: [
    `
    .itemLevel-1 {
        padding-left: 0px;
    }
    @for $i from 2 through 30 {
        .itemLevel-#{$i} {
            margin-left: (($i - 1) * 20px) !important;
        }
    }
    .noElips {
        text-overflow: initial;
        white-space: normal;
    }
    ion-item, ion-item .label-md, tree-view-items .list-md {
        margin: 0 !important;
    }
    ion-item .item-inner {
        border: none !important;
    }
    tree-view-items ion-item .item-md {
        padding-left: 0 !important;
    }
    `
  ]
})
export class TreeViewItemsComponent {
    @Input()
    public item: any;
    @Input()
    public persistedName: string;
    @Input()
    public treeViewName: string;
    constructor() {}
}
