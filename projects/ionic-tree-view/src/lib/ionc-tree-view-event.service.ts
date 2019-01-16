import { Injectable } from '@angular/core';
import { IonTreeViewDataService } from '../lib/ionc-tree-view-data.service';

@Injectable({
  providedIn: 'root'
})
export class IonTreeViewEventService {
    constructor(
        public dataService: IonTreeViewDataService
    ) {

    }

    private setCheckedValue(item: any): boolean {
        return item['checked'] === 1 || item['checked'] === 'true' || item['checked'] === true;
    };

    private updateCheckedValueOfItem(itemToCheck: any, items: any[]): void {
        let item = items.filter(value => value.id === itemToCheck.id)[0];
        item['checked'] = this.setCheckedValue(itemToCheck);
        if (item['checked'] !== itemToCheck['checked']) {
            item['checked'] = itemToCheck['checked'];
            item['checkChanged'] = true;
        }
    };
    // Check each child of item
    private checkAllChildItems(item, treeViewName) {
        return new Promise((resolve, reject) => {
            this.updateCheckedValueOfItem(item, this.dataService.getItemsByName(treeViewName));

            if (!!item.items) {
                item.items.forEach((itemChild) => {
                    itemChild.checked = item.checked;
                    return this.checkAllChildItems(itemChild, treeViewName).then(resolve, reject);
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

    // Add checked item into a temporary array
    private addCheckedItemsToCheckItemList(treeView: any[], treeViewName): any {
        return new Promise((resolve, reject) => {

            treeView.forEach((value, index) => {
                if (value.checked) {

                    this.dataService.getItemsCheckedTempByName(treeViewName).push(value);
                }
                if (value.items && value.items.length > 0) {
                    return this.addCheckedItemsToCheckItemList(value.items, treeViewName);
                }
            });
            resolve(this.dataService.getItemsCheckedTempByName(treeViewName));
        });
    }

    // Event when a check changed
    public checkChanged(item, treeViewName, persistedName) {
        item.preventCollapse = true;

        // Check each childs of item
        this.checkAllChildItems(item, treeViewName).then(r => {
            // Reset the checked array & checked temp array
            this.dataService.setItemsCheckedByName([], treeViewName);
            this.dataService.setItemsCheckedTempByName([], treeViewName);
            
            let treeView = this.dataService.getTreeViewItemsByName(treeViewName);
            // Check or uncheck each parent of treeView
            this.checkParentItems(treeView).then((response: any) => {
                this.addCheckedItemsToCheckItemList(treeView, treeViewName).then((items: any) => {
                    this.dataService.setItemsCheckedByName(items, treeViewName);

                    // Launch callback function after check changed
                    if (this.dataService.getCallBackByName(treeView) && typeof (this.dataService.getCallBackByName(treeView)) === 'function') {
                        this.dataService.getCallBackByName(treeView)();
                    }

                    // Persist checked items into local storage
                    if (!!persistedName) {
                        this.writeOnLocalStorageCheckItems(persistedName, treeViewName);
                    }
                });
            });
        });
    };

    private createArrayOfIdOfItemsCheckedByTreeViewName(treeViewName: string): number[] {
        if (!this.dataService.getItemsCheckedByName(treeViewName)) {
            return [];
        }
        return this.dataService.getItemsCheckedByName(treeViewName).map(e => e.id);
    };

    private writeOnLocalStorageCheckItems(persistedName: string, treeViewName: string): void {
        window.localStorage.setItem(persistedName, JSON.stringify({ items: this.createArrayOfIdOfItemsCheckedByTreeViewName(treeViewName) }));
    };
}