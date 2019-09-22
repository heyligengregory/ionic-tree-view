import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { TreeViewItemsComponent } from './tree-view-items/tree-view-items.component';
import { TreeViewItemComponent } from './tree-view-item/tree-view-item.component';

@NgModule({
    declarations: [
        TreeViewComponent,
        TreeViewItemsComponent,
        TreeViewItemComponent],
    imports: [
        IonicModule.forRoot(),
        FormsModule,
        CommonModule
    ],
    exports: [
        TreeViewComponent,
        TreeViewItemsComponent,
        TreeViewItemComponent
    ]
})
export class TreeViewModule { }
