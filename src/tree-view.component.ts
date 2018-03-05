import { Component, Input } from '@angular/core';

import { TreeViewService } from 'tree-view.service';

@Component({
    selector: 'tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent {
    @Input()
    public items: any[];
    @Input()
    public callbackFunctionCheckChanged: () => void;
    @Input()
    public persistedName: string;
    @Input()
    public treeViewName: string;

    private itemLevel = 1;
    private tempArray = [];
    private treeViewItems = [];
    private itemsCheckedTemp = [];

    constructor(
        private treeViewService: TreeViewService
    ) {
        this.treeViewService.readOnLocalStorageCheckItems(this.persistedName, this.treeViewName, this.items);
        if (!this.getTreeView()) {
            this.initTreeView();
        };

        this.treeViewItems = this.getTreeView();
    }

    // Init the treeView by generate the tree and set the tree in the treeViewService
    private initTreeView(): void {
        this.treeViewService.addTreeViewByName(this.generateTree(), this.treeViewName);
        this.collapseItem(this.getTreeView());
    };

    // Create the first level of the tree
    private generateTree(): any {
        let treeViewItems = [];
        this.itemLevel = 1;

        this.items.filter(e => e.parentID === undefined).forEach((value: any, key) => {
            treeViewItems.push(this.treeViewService.createNewItem(value, this.itemLevel, this.treeViewName));
        });

        this.itemLevel++;
        this.createItemsLevelTwo(this.items, treeViewItems);
        return treeViewItems;
    };

    // Generate child of direct parent (level 2)
    private createItemsLevelTwo(treeData: any[], treeViewItems: any[]) {
        treeData = this.getItemsToAddInTreeView(treeData, treeViewItems);

        treeData.filter(e => e.parentID !== undefined).forEach((itemToAdd, ckikey) => {
            treeViewItems.forEach((item, tvikey) => {
                if (itemToAdd.parentID === item.id) {
                    item.items.push(this.treeViewService.createNewItem(itemToAdd, this.itemLevel, this.treeViewName));
                } else if (item.items && item.items.length !== 0) {
                    item = this.createItemsOfLevelHigherThanTwo(itemToAdd, item, this.itemLevel + 1);
                }
            });
        });

        this.itemLevel++;

        if (treeData && treeData.length > 0) {
            this.tempArray = [];
            this.createItemsLevelTwo(this.items, treeViewItems);
        }
    };
    // Create items for level > 2
    private createItemsOfLevelHigherThanTwo(treeDataItemToAdd: any, treeViewChild: any, itemLevel): any {
        treeViewChild.items.forEach((child, key) => {

            if (treeDataItemToAdd.parentID === child.id) {
                let itemExist = child.items.filter(e => e.id === child.id);
                if (!itemExist || (itemExist && itemExist.length === 0)) {
                    child.items.push(this.treeViewService.createNewItem(treeDataItemToAdd, itemLevel, this.treeViewName));
                }
            } else if (child.items && child.items.length !== 0) {
                child = this.createItemsOfLevelHigherThanTwo(treeDataItemToAdd, child, itemLevel + 1);
            }
        });

        return treeViewChild;
    };

    // Get items to add in treeview
    private getItemsToAddInTreeView(treeData: any[], treeViewItems: any[]): any[] {
        // Copy item
        let tempTree = Object.assign({}, treeData);
        treeData = [];
        tempTree.forEach((elem, key) => {
            this.tempArray = [];
            let findElem = this.returnFlattenedArray(treeViewItems).filter(e => e.id === elem.id);
            if (!findElem || (findElem && findElem.length === 0)) {
                treeData.push(elem);
            }
        });

        return treeData
    };

    // Return array of multiple level in one level
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
    };
    // Event when a check changed
    private checkChanged(item) {
        item.preventCollapse = true;

        // Check each childs of item
        this.checkChildItems(item).then(r => {
            // Reset the checked array & checked temp array
            this.treeViewService.addItemsCheckedByName([], this.treeViewName);
            this.itemsCheckedTemp = [];

            // Check or uncheck each parent of treeView
            this.checkParentItems(this.getTreeView()).then((response: any) => {
                this.addCheckedItemsToCheckItemList(this.getTreeView()).then((items: any) => {
                    this.treeViewService.addItemsCheckedByName(items, this.treeViewName);

                    // Launch callback function after check changed
                    if (this.callbackFunctionCheckChanged && typeof (this.callbackFunctionCheckChanged) === 'function') {
                        this.callbackFunctionCheckChanged();
                    }

                    // Persist checked items into local storage
                    if (!!this.persistedName) {
                        this.treeViewService.writeOnLocalStorageCheckItems(this.persistedName, this.treeViewName);
                    }
                });
            });
        });
    };

    // Add checked item into a temporary array
    private addCheckedItemsToCheckItemList(treeView: any[]): any {
        return new Promise((resolve, reject) => {

            treeView.forEach((value, index) => {
                if (value.checked) {
                    this.itemsCheckedTemp.push(value);
                }
                if (value.items && value.items.length > 0) {
                    return this.addCheckedItemsToCheckItemList(value.items);
                }
            });
            resolve(this.itemsCheckedTemp);
        });
    }

    // Check each child of item
    private checkChildItems(item) {
        return new Promise((resolve, reject) => {
            this.treeViewService.updateCheckedValueOfItem(item, this.items);

            if (!!item.items) {
                item.items.forEach((itemChild) => {
                    itemChild.checked = item.checked;
                    return this.checkChildItems(itemChild).then(resolve, reject);
                });
            }
            resolve();
        });
    };

    // Check each parent of items if all items are checked
    private checkParentItems(items: any[]) {
        return new Promise((resolve, reject) => {

            items.forEach((itemChild) => {
                if (itemChild.items && itemChild.items.length > 0) {
                    this.checkParentItems(itemChild.items);

                    // One or more childs are unchecked
                    if (itemChild.items.filter(e => !e.checked).length !== 0) {
                        itemChild.checked = false;
                    }
                    // Each childs are checked
                    if (itemChild.items.filter(e => !e.checked).length === 0) {
                        itemChild.checked = true;
                    }
                }
            });
            resolve();
        });
    };

    // Display or not the class which show if there is any childs checked
    private checkCheckedChilds(item): boolean {
        if (!item.items || (item.items && item.items.length === 0)) {
            return false;
        }
        let allChildChecked: boolean = this.treeViewService.allChildAreChecked(item.items);
        let anyChildChecked: boolean = this.treeViewService.anyChildChecked(item.items);

        if (allChildChecked || (!allChildChecked && !anyChildChecked)) {
            return false;
        }
        // Child and parent not checked
        if (!item.checked && !allChildChecked) {
            return true;
        }

        return allChildChecked;
        // if (!item.checked)
        //    return result;
    };

    // Close each item of items
    private collapseItem(item): any {
        if (item.preventCollapse) {
            item.preventCollapse = false;
        } else {
            for (let key in item) {
                if (item[key] && typeof (item[key]) === 'object') {
                    item[key].collapsed = !item[key].collapsed;
                    this.collapseItem(item[key]);
                }
            }
            return item;
        }
        return item;
    };

    private getTreeView(): any {
        return this.treeViewService.getTreeViewByName(this.treeViewName);
    };

    private getItemsChecked(): any {
        return this.treeViewService.getItemsCheckedByName(this.treeViewName);
    };
};
