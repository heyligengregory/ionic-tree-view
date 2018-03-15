import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'tree-view-items',
    templateUrl: './tree-view-items.component.html'
})
export class TreeViewItemsComponent {
    @Input()
    public item: any;
    @Input()
    public persistedName: string;
    @Input()
    public treeViewName: string;
    
    constructor() {}
}
