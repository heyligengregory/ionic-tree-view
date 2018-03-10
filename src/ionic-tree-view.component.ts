import { Component, Input } from '@angular/core';

import { TreeViewService } from './ionic-tree-view.service';

@Component({
    selector: 'tree-view',
    templateUrl: './ionic-tree-view.component.html',
    styleUrls: ['./ionic-tree-view.component.scss']
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


    /** Service */
    private hasAnyChildCheckedResult = false;
    public treeViewList: any;
    public itemsChecked: any;

    constructor(
        
    ) {
        this.treeViewList = {};
        this.itemsChecked = {};
        this.readOnLocalStorageCheckItems(this.persistedName, this.treeViewName, this.items);
        if (!this.getTreeView()) {
            this.initTreeView();
        };

        this.treeViewItems = this.getTreeView();
    }

    // Init the treeView by generate the tree and set the tree in the treeViewService
    private initTreeView(): void {
        this.addTreeViewByName(this.generateTree(), this.treeViewName);
        this.collapseItem(this.getTreeView());
    };

    // Create the first level of the tree
    private generateTree(): any {
        let treeViewItems = [];
        this.itemLevel = 1;

        this.items.filter(e => e.parentID === undefined).forEach((value: any, key) => {
            treeViewItems.push(this.createNewItem(value, this.itemLevel, this.treeViewName));
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
                    item.items.push(this.createNewItem(itemToAdd, this.itemLevel, this.treeViewName));
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
                    child.items.push(this.createNewItem(treeDataItemToAdd, itemLevel, this.treeViewName));
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
        this.checkAllChildItems(item).then(r => {
            // Reset the checked array & checked temp array
            this.addItemsCheckedByName([], this.treeViewName);
            this.itemsCheckedTemp = [];

            // Check or uncheck each parent of treeView
            this.checkParentItems(this.getTreeView()).then((response: any) => {
                this.addCheckedItemsToCheckItemList(this.getTreeView()).then((items: any) => {
                    this.addItemsCheckedByName(items, this.treeViewName);

                    // Launch callback function after check changed
                    if (this.callbackFunctionCheckChanged && typeof (this.callbackFunctionCheckChanged) === 'function') {
                        this.callbackFunctionCheckChanged();
                    }

                    // Persist checked items into local storage
                    if (!!this.persistedName) {
                        this.writeOnLocalStorageCheckItems(this.persistedName, this.treeViewName);
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
    private checkAllChildItems(item) {
        return new Promise((resolve, reject) => {
            this.updateCheckedValueOfItem(item, this.items);

            if (!!item.items) {
                item.items.forEach((itemChild) => {
                    itemChild.checked = item.checked;
                    return this.checkAllChildItems(itemChild).then(resolve, reject);
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
        let allChildChecked: boolean = this.allChildAreChecked(item.items);
        let anyChildChecked: boolean = this.anyChildChecked(item.items);

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
        return this.getTreeViewByName(this.treeViewName);
    };

    private getItemsChecked(): any {
        return this.getItemsCheckedByName(this.treeViewName);
    };

    /** To Add into service */

    public checkChildItems(item, items) {
        return new Promise((resolve, reject) => {
            this.updateCheckedValueOfItem(item, items);

            if (!!item.items) {
                item.items.forEach((itemChild) => {
                    itemChild.checked = item.checked;
                    return this.checkChildItems(itemChild, items).then(resolve, reject);
                });
            }
            resolve();
        });
    };

    public checkValueOfEachChild(items: any, result: boolean): boolean {
        items.forEach((itemChild, key) => {
            if (itemChild.items && itemChild.items.length > 0) {
                result = result && this.checkValueOfEachChild(itemChild.items, result);
            }
            if (itemChild.checked) {
                result = result && true;
            }
        });

        return result;
    };

    public allChildAreChecked(items: any, result = true): boolean {
        if (!items || (items && items.length === 0)) {
            return false;
        }
        items.forEach((itemChild, key) => {
            if (itemChild.items && itemChild.items.length > 0) {
                result = result && this.checkValueOfEachChild(itemChild.items, result);
            }
            result = result && itemChild.checked;
        });

        return result;
    };

    public anyChildChecked(items, result = false): boolean {
        if (!items || (items && items.length === 0)) {
            return false;
        }
        this.hasAnyChildCheckedResult = false;

        return this.hasAnyChildChecked(items);
    };

    private hasAnyChildChecked(items): boolean {

        items.forEach((itemChild, key) => {
            if (itemChild.items && itemChild.items.length > 0) {
                this.hasAnyChildChecked(itemChild.items);
            }
            if (itemChild.checked) {
                this.hasAnyChildCheckedResult = true;
            }
        });

        return this.hasAnyChildCheckedResult;
    };

    public createNewItem(itemToAdd: any, itemLevel: number, treeViewName: string): any {
        return {
            id: itemToAdd.id,
            itemLevel: itemLevel,
            text: itemToAdd.name,
            collapsed: true,
            checked: this.verifyIfItemIsChecked(itemToAdd.id, treeViewName),
            items: [],
            parentID: itemToAdd.parentID
        };
    };

    private verifyIfItemIsChecked(itemID: number, treeViewName: string) {
        if (!this.itemsChecked[treeViewName]) {
            return false;
        }
        return this.itemsChecked[treeViewName].filter(e => e.id === itemID).length > 0;
    };

    public updateCheckedValueOfItem(itemToCheck: any, items: any[]): void {
        let item = items.filter(value => value.id === itemToCheck.id)[0];
        item['checked'] = this.setCheckedValue(itemToCheck);
        if (item['checked'] !== itemToCheck['checked']) {
            item['checked'] = itemToCheck['checked'];
            item['checkChanged'] = true;
        }
    };

    public writeOnLocalStorageCheckItems(persistedName: string, treeViewName: string): void {
        window.localStorage.setItem(persistedName, JSON.stringify({ items: this.createArrayOfIdOfItemsCheckedByTreeViewName(treeViewName) }));
    };

    public readOnLocalStorageCheckItems(persistedName: string, treeViewName: string, items: any[]): any {
        let jsonObjectItems = window.localStorage.getItem(persistedName);
        if (!!jsonObjectItems) {
            let objectItems: any = JSON.parse(jsonObjectItems);
            this.addItemsCheckedByName(items.filter(e => objectItems.items.indexOf(e.id) !== -1), treeViewName);
        }

        if (!this.getItemsCheckedByName(treeViewName)) {
            this.addItemsCheckedByName([], treeViewName);
            }

    };

    public loadAlreadyCheckedItems(persistedName: string, treeViewName: string, items: any): number[] {
        if (!this.itemsChecked[treeViewName] || (this.itemsChecked[treeViewName] && this.itemsChecked[treeViewName].length === 0)) {
            this.readOnLocalStorageCheckItems(persistedName, treeViewName, items);

            if (!this.itemsChecked[treeViewName]) {
                return [];
            }
        }

        return this.itemsChecked[treeViewName].map(e => e.id);
    };

    public createArrayOfIdOfItemsCheckedByTreeViewName(treeViewName: string): number[] {
        if (!this.itemsChecked[treeViewName]) {
            return [];
        }
        return this.itemsChecked[treeViewName].map(e => e.id);
    };

    public setCheckedValue(item: any): boolean {
        return item['checked'] === 1 || item['checked'] === 'true' || item['checked'] === true;
    };

    public getItemsCheckedByName(name: string): any {
        return this.itemsChecked[name];
    };

    public addItemsCheckedByName(itemChecked: any, name: string): void {
        this.itemsChecked[name] = itemChecked;
    };

    public getTreeViewByName(name: string): any {
        return this.treeViewList[name];
    };

    public addTreeViewByName(treeView: any, name: string): void {
        this.treeViewList[name] = treeView;
    };
};
