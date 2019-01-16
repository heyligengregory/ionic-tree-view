import { Component, Input } from '@angular/core';

@Component({
  selector: 'tree-view-items',
  template: `
    <span>
        <ion-item class="item item-checkbox {{'itemLevel-' + item.itemLevel}}">
            <tree-view-item [item]="item" [treeViewName]="treeViewName" [persistedName]="persistedName"></tree-view-item>
        </ion-item>
        <ion-list *ngFor="let loopItem of item.items" [hidden]="loopItem.collapsed">
            <tree-view-items [item]="loopItem" [treeViewName]="treeViewName" [persistedName]="persistedName"></tree-view-items>
        </ion-list>
    </span>
  `
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
