import { Component, OnInit, Input } from '@angular/core';
import { IonTreeViewLibService } from '../ion-tree-view-lib.service';
import { IonTreeViewEventService } from '../ionc-tree-view-event.service';

@Component({
    selector: 'tree-view-item',
    template: `
    <ion-item>
        <ion-checkbox id="check-bh-{{item.id}}" [(ngModel)]="item.checked" (ngModelChange)="onCheckChanged()"></ion-checkbox>
        <span [hidden]="!item || (item.items && item.items.length == 0)">
            <ion-icon *ngIf="item.items.collapsed != undefined && item.items.collapsed === false" name="arrow-dropdown"></ion-icon>
            <ion-icon *ngIf="item.items.collapsed != undefined && item.items.collapsed === true" name="arrow-dropright"></ion-icon>
        </span>
        <ion-label class="noElips" (click)="treeViewService.collapseItem(item)">{{item.text}}</ion-label>
    </ion-item>
  `
})
export class TreeViewItemComponent {

    @Input()
    public item: any;
    @Input()
    public persistedName: string;
    @Input()
    public treeViewName: string;

    constructor(
        public treeViewService: IonTreeViewLibService,
        public eventService: IonTreeViewEventService) { }

    public ngOnInit() {
        if (this.item && this.item.checked == undefined) {
            this.item.checked = false;
        }
    }

    public onCheckChanged(): void {
        this.eventService.checkChanged(this.item, this.treeViewName, this.persistedName);
    }

    /**
     * 
     * <ion-item>
        <ion-grid>
            <ion-row>
                <ion-col size="1">
                    <div class="checkbox-icon"><div class="checkbox-inner"></div></div>
                            <input id="check-bh-{{item.id}}" type="checkbox" 
                            [(ngModel)]="item.checked" (ngModelChange)="onCheckChanged()" />
                </ion-col>
                <ion-col size="1" (click)="treeViewService.collapseItem(item)">
                    <span [hidden]="!item || (item.items && item.items.length == 0)">
                            <ion-icon *ngIf="item.items.collapsed != undefined && item.items.collapsed === false" name="arrow-dropdown"></ion-icon>
                            <ion-icon *ngIf="item.items.collapsed != undefined && item.items.collapsed === true" name="arrow-dropright"></ion-icon>
                    </span>
                </ion-col>
                <ion-col size="10" class="noElips" (click)="treeViewService.collapseItem(item)">
                        {{item.text}}
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-item>
     */
}
