import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TreeViewLibService {
  private hasAnyChildCheckedResult = false;
  public treeViewList: any;
  public itemsChecked: any;

  constructor() {
    this.treeViewList = {};
    this.itemsChecked = {};
  }

  // Close each item of items
  public collapseItem(item): any {
    if (item.preventCollapse) {
      item.preventCollapse = false;
    } else {
      for (let key in item) {
        if (item[key] && typeof item[key] === "object") {
          item[key].collapsed = !item[key].collapsed;
          this.collapseItem(item[key]);
        }
      }
      return item;
    }
    return item;
  }

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
  }

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
  }

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
  }

  public anyChildChecked(items, result = false): boolean {
    if (!items || (items && items.length === 0)) {
      return false;
    }
    this.hasAnyChildCheckedResult = false;

    return this.hasAnyChildChecked(items);
  }

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
  }

  public createNewItem(
    itemToAdd: any,
    itemLevel: number,
    treeViewName: string
  ): any {
    return {
      id: itemToAdd.id,
      itemLevel: itemLevel,
      text: itemToAdd.name,
      collapsed: true,
      checked: this.verifyIfItemIsChecked(itemToAdd.id, treeViewName),
      items: [],
      parentID: itemToAdd.parentID,
    };
  }

  private verifyIfItemIsChecked(itemID: number, treeViewName: string) {
    if (!this.itemsChecked[treeViewName]) {
      return false;
    }
    return (
      this.itemsChecked[treeViewName].filter((e) => e.id === itemID).length > 0
    );
  }

  public updateCheckedValueOfItem(itemToCheck: any, items: any[]): void {
    let item = items.filter((value) => value.id === itemToCheck.id)[0];
    item["checked"] = this.setCheckedValue(itemToCheck);
    if (item["checked"] !== itemToCheck["checked"]) {
      item["checked"] = itemToCheck["checked"];
      item["checkChanged"] = true;
    }
  }

  public writeOnLocalStorageCheckItems(
    persistedName: string,
    treeViewName: string
  ): void {
    window.localStorage.setItem(
      persistedName,
      JSON.stringify({
        items: this.createArrayOfIdOfItemsCheckedByTreeViewName(treeViewName),
      })
    );
  }

  public readOnLocalStorageCheckItems(
    persistedName: string,
    treeViewName: string,
    items: any[]
  ): any {
    let jsonObjectItems = window.localStorage.getItem(persistedName);
    if (!!jsonObjectItems) {
      let objectItems: any = JSON.parse(jsonObjectItems);
      this.addItemsCheckedByName(
        items.filter((e) => objectItems.items.indexOf(e.id) !== -1),
        treeViewName
      );
    }

    if (!this.getItemsCheckedByName(treeViewName)) {
      this.addItemsCheckedByName([], treeViewName);
    }
  }

  public loadAlreadyCheckedItems(
    persistedName: string,
    treeViewName: string,
    items: any
  ): number[] {
    if (
      !this.itemsChecked[treeViewName] ||
      (this.itemsChecked[treeViewName] &&
        this.itemsChecked[treeViewName].length === 0)
    ) {
      this.readOnLocalStorageCheckItems(persistedName, treeViewName, items);

      if (!this.itemsChecked[treeViewName]) {
        return [];
      }
    }

    return this.itemsChecked[treeViewName].map((e) => e.id);
  }

  public createArrayOfIdOfItemsCheckedByTreeViewName(
    treeViewName: string
  ): number[] {
    if (!this.itemsChecked[treeViewName]) {
      return [];
    }
    return this.itemsChecked[treeViewName].map((e) => e.id);
  }

  public setCheckedValue(item: any): boolean {
    return (
      item["checked"] === 1 ||
      item["checked"] === "true" ||
      item["checked"] === true
    );
  }

  public getItemsCheckedByName(name: string): any {
    return this.itemsChecked[name];
  }

  public addItemsCheckedByName(itemChecked: any, name: string): void {
    this.itemsChecked[name] = itemChecked;
  }

  public getTreeViewByName(name: string): any {
    return this.treeViewList[name];
  }

  public addTreeViewByName(treeView: any, name: string): void {
    this.treeViewList[name] = treeView;
  }
}
