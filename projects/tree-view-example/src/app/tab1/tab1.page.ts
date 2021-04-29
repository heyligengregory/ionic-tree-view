import { Component } from '@angular/core';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
    public treeviewItems = [
        { id: 1, name: 'Furniture' },
        { id: 2, name: 'Tables', parentId: 1 },
        { id: 3, name: 'Chair', parentId: 1 },
        { id: 4, name: 'Sofas', parentId: 1 },
        { id: 5, name: 'Sofa 1', parentId: 4 },
        { id: 6, name: 'Little table', parentId: 2 },
        { id: 11, name: 'Little table 2', parentId: 2 },
        { id: 9, name: 'Little little table', parentId: 6 },
        { id: 7, name: 'Decor' },
        { id: 8, name: 'Outdoor' },
    ];

    constructor() {}

    itemChecked(e) {
        console.log(e);
    }
}
