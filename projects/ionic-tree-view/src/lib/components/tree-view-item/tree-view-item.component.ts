import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeViewService } from '../../services/tree-view.service';
import { TreeViewEventService } from '../../services/tree-view-event.service';
import { isNullOrUndefined } from 'util';
import { ITreeItemChecked, ITreeItem } from '../../models/tree-item.interfaces';

@Component({
    selector: 'tree-view-item',
    templateUrl: 'tree-view-item.component.html',
    styleUrls: ['tree-view-item.component.scss'],
})
export class TreeViewItemComponent implements OnInit {
    @Input() public item: ITreeItem;
    @Input() public persistedName: string;
    @Input() public treeViewName: string;
    @Input() public childCheked: boolean;

    @Output() itemCheckedEvent = new EventEmitter<ITreeItemChecked>();

    constructor(
        private treeViewService: TreeViewService,
        private eventService: TreeViewEventService
    ) {}

    public ngOnInit() {
        if (!!this.item && isNullOrUndefined(this.item?.checked)) {
            this.item.checked = false;
        }
    }

    public collapseItem(treeItem: ITreeItem) {
        this.treeViewService.collapseItem(treeItem);
    }

    public checkChanged(): void {
        this.eventService.checkChanged(
            this.item,
            this.treeViewName,
            this.persistedName
        );

        this.itemCheckedEvent.emit(<ITreeItemChecked>{
            checked: this.item.checked,
            id: this.item.id,
        });
    }

    public couldBeCollapse = (treeItem: ITreeItem): boolean =>
        treeItem.items?.length !== 0 &&
        !isNullOrUndefined(treeItem.items.collapsed);

    public hasCheckedChild = (treeItem: ITreeItem): boolean =>
        this.childCheked && !treeItem.checked;
}
