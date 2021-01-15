import { Component, Input, OnInit } from '@angular/core';
import { TreeViewService } from '../../services/tree-view.service';
import { TreeViewEventService } from '../../services/tree-view-event.service';
import { TreeItem } from '../../models/TreeItem';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'tree-view-item',
    templateUrl: 'tree-view-item.component.html',
    styleUrls: ['tree-view-item.component.scss'],
})
export class TreeViewItemComponent implements OnInit {
    @Input() public item: TreeItem;
    @Input() public persistedName: string;
    @Input() public treeViewName: string;
    @Input() public childCheked: boolean;

    constructor(
        private treeViewService: TreeViewService,
        private eventService: TreeViewEventService
    ) {}

    public ngOnInit() {
        if (!!this.item && isNullOrUndefined(this.item?.checked)) {
            this.item.checked = false;
        }
    }

    public collapseItem(treeItem: TreeItem) {
        this.treeViewService.collapseItem(treeItem);
    }

    public checkChanged(): void {
        this.eventService.checkChanged(
            this.item,
            this.treeViewName,
            this.persistedName
        );
    }

    public couldBeCollapse = (treeItem: TreeItem): boolean =>
        treeItem.items?.length !== 0 &&
        !isNullOrUndefined(treeItem.items.collapsed);

    public hasCheckedChild = (treeItem: TreeItem): boolean =>
        this.childCheked && !treeItem.checked;
}
