import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TreeViewDataService {
    private _itemsHolder: any;
    private _itemsCheckedHolder: any;
    private _itemsCheckedTempHolder: any;
    private _treeViewItemsHolder: any;
    private _callBackHolder: any;

    constructor() {
        this._itemsHolder = {};
        this._itemsCheckedHolder = {};
        this._itemsCheckedTempHolder = {};
        this._treeViewItemsHolder = {};
        this._callBackHolder = {};
    }

    public getItemsByName(name: string): any {
        return this._itemsHolder[name];
    }

    public setItemsByName(items: any, name: string): void {
        this._itemsHolder[name] = items;
    }

    public getItemsCheckedByName(name: string): any {
        return this._itemsCheckedHolder[name];
    }

    public setItemsCheckedByName(items: any, name: string): void {
        this._itemsCheckedHolder[name] = items;
    }

    public getItemsCheckedTempByName(name: string): any {
        return this._itemsCheckedTempHolder[name];
    }

    public setItemsCheckedTempByName(items: any, name: string): void {
        this._itemsCheckedTempHolder[name] = items;
    }

    public getTreeViewItemsByName(name: string): any {
        return this._treeViewItemsHolder[name];
    }

    public setTreeViewItemsByName(items: any, name: string): void {
        this._treeViewItemsHolder[name] = items;
    }

    public getCallBackByName(name: string): any {
        return this._callBackHolder[name];
    }

    public setCallBackByName(callback: any, name: string): void {
        this._callBackHolder[name] = callback;
    }
}
