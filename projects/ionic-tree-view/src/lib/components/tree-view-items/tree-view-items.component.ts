import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITreeItem } from '../../models/tree-item.interfaces';
import { ITreeItemChecked } from '../../models/tree-item.interfaces';
import { TreeViewService } from '../../services/tree-view.service';

@Component({
    selector: 'tree-view-items',
    templateUrl: 'tree-view-items.component.html',
    styleUrls: ['tree-view-items.component.scss'],
})
export class TreeViewItemsComponent {
    @Input() public item: ITreeItem;
    @Input() public persistedName: string;
    @Input() public treeViewName: string;

    @Output() public itemCheckedEvent = new EventEmitter<ITreeItemChecked>();

    constructor(private treeViewService: TreeViewService) {}

    public anyChildChecked(item: ITreeItem): boolean {
        return this.treeViewService.anyChildChecked(item.items);
    }

    public itemChecked(treeItemChecked: ITreeItemChecked) {
        this.itemCheckedEvent.emit(treeItemChecked);
    }
}
