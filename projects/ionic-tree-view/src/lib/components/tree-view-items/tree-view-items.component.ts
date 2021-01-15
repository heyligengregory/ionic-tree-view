import { Component, Input } from '@angular/core';
import { TreeItem } from '../../models/TreeItem';
import { TreeViewService } from '../../services/tree-view.service';

@Component({
    selector: 'tree-view-items',
    templateUrl: 'tree-view-items.component.html',
    styleUrls: ['tree-view-items.component.scss'],
})
export class TreeViewItemsComponent {
    @Input() public item: TreeItem;
    @Input() public persistedName: string;
    @Input() public treeViewName: string;

    constructor(private treeViewService: TreeViewService) {}

    public anyChildChecked(item: TreeItem): boolean {
        return this.treeViewService.anyChildChecked(item.items);
    }
}
