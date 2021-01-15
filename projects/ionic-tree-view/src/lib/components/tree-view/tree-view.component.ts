import { Component, OnInit, Input } from '@angular/core';
import { TreeViewService } from '../../services/tree-view.service';
import { TreeViewDataService } from '../../services/tree-view-data.service';
import { TreeItem } from '../../models/TreeItem';

@Component({
    selector: 'tree-view',
    templateUrl: 'tree-view.component.html',
    styleUrls: ['tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
    @Input() public items: any;
    @Input() public persistedName: string;
    @Input() public treeViewName: string;

    public treeViewItems: TreeItem[];
    private itemLevel = 1;
    private tempArray = [];

    constructor(
        private dataService: TreeViewDataService,
        private treeViewService: TreeViewService
    ) {}

    ngOnInit() {
        this.dataService.setItemsByName(this.items, this.treeViewName);

        this.treeViewService.readOnLocalStorageCheckItems(
            this.persistedName,
            this.treeViewName,
            this.items
        );

        if (!this.getTreeView()) {
            this.initTreeView();
        }

        this.treeViewItems = this.getTreeView();
    }

    public getTreeViewByName(name: string): any {
        return this.dataService.getTreeViewItemsByName(name);
    }

    public addTreeViewByName(treeView: any, name: string): void {
        this.dataService.setTreeViewItemsByName(treeView, name);
    }

    private initTreeView(): void {
        this.addTreeViewByName(this.generateTree(), this.treeViewName);
        this.treeViewService.collapseItem(this.getTreeView());
    }

    private generateTree(): any {
        const treeViewItems = [];
        this.itemLevel = 1;

        this.items
            .filter((e) => e.parentId === undefined)
            .forEach((value: any, key) => {
                treeViewItems.push(
                    this.treeViewService.createNewItem(
                        value,
                        this.itemLevel,
                        this.treeViewName
                    )
                );
            });

        this.itemLevel++;
        this.createItemsLevelTwo(this.items, treeViewItems);
        return treeViewItems;
    }

    private createItemsLevelTwo(treeData: any[], treeViewItems: any[]) {
        treeData = this.getItemsToAddInTreeView(treeData, treeViewItems);

        treeData
            .filter((e) => e.parentId !== undefined)
            .forEach((itemToAdd, ckikey) => {
                treeViewItems.forEach((item, tvikey) => {
                    if (itemToAdd.parentId === item.id) {
                        item.items.push(
                            this.treeViewService.createNewItem(
                                itemToAdd,
                                this.itemLevel,
                                this.treeViewName
                            )
                        );
                    } else if (item.items && item.items.length !== 0) {
                        item = this.createItemsOfLevelHigherThanTwo(
                            itemToAdd,
                            item,
                            this.itemLevel + 1
                        );
                    }
                });
            });

        this.itemLevel++;

        if (treeData && treeData.length > 0) {
            this.tempArray = [];
            this.createItemsLevelTwo(this.items, treeViewItems);
        }
    }

    private createItemsOfLevelHigherThanTwo(
        treeDataItemToAdd: any,
        treeViewChild: any,
        itemLevel
    ): any {
        treeViewChild.items.forEach((child, key) => {
            if (treeDataItemToAdd.parentId === child.id) {
                const itemExist = child.items.filter((e) => e.id === child.id);
                if (!itemExist || (itemExist && itemExist.length === 0)) {
                    child.items.push(
                        this.treeViewService.createNewItem(
                            treeDataItemToAdd,
                            itemLevel,
                            this.treeViewName
                        )
                    );
                }
            } else if (child.items && child.items.length !== 0) {
                child = this.createItemsOfLevelHigherThanTwo(
                    treeDataItemToAdd,
                    child,
                    itemLevel + 1
                );
            }
        });

        return treeViewChild;
    }

    private getItemsToAddInTreeView(
        treeData: any[],
        treeViewItems: any[]
    ): any[] {
        const tempTree = Object.assign([], treeData);
        treeData = [];
        tempTree.forEach((elem, key) => {
            this.tempArray = [];
            const findElem = this.returnFlattenedArray(treeViewItems).filter(
                (e) => e.id === elem.id
            );
            if (!findElem || (findElem && findElem.length === 0)) {
                treeData.push(elem);
            }
        });

        return treeData;
    }

    private returnFlattenedArray(items): any[] {
        if (!this.tempArray) {
            this.tempArray = [];
        }
        this.tempArray = this.tempArray.concat(items);

        items.forEach((value, key) => {
            if (value.items !== undefined) {
                this.returnFlattenedArray(value.items);
            }
        });

        return this.tempArray;
    }

    private getTreeView(): any {
        return this.getTreeViewByName(this.treeViewName);
    }
}
