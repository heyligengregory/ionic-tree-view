import { Component, OnInit, Input } from '@angular/core';
import { TreeViewLibService } from '../tree-view-lib.service';
import { TreeViewEventService } from '../tree-view-event.service';
import { TreeItem } from '../models/TreeItem';

@Component({
    selector: 'tree-view-item',
    templateUrl: 'tree-view-item.component.html',
    styleUrls: ['tree-view-item.component.scss'],
})
export class TreeViewItemComponent {
    @Input()
    public item: TreeItem;
    @Input()
    public persistedName: string;
    @Input()
    public treeViewName: string;
    @Input()
    public childCheked: boolean;

    constructor(
        public treeViewService: TreeViewLibService,
        public eventService: TreeViewEventService
    ) {}

    public ngOnInit() {
        if (this.item && this.item.checked == undefined) {
            this.item.checked = false;
        }
    }

    public onCheckChanged(): void {
        this.eventService.checkChanged(
            this.item,
            this.treeViewName,
            this.persistedName
        );
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
