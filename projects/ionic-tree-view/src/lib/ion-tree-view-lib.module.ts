import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonTreeViewComponent } from './ion-tree-view/ion-tree-view.component';
import { TreeViewItemsComponent } from './tree-view-items/tree-view-items.component';
import { TreeViewItemComponent } from './tree-view-item/tree-view-item.component';

@NgModule({
    declarations: [
        IonTreeViewComponent,
        TreeViewItemsComponent,
        TreeViewItemComponent],
    imports: [
        IonicModule.forRoot(),
        FormsModule,
        CommonModule
    ],
    exports: [
        IonTreeViewComponent,
        TreeViewItemsComponent,
        TreeViewItemComponent
    ]
})
export class IonTreeViewModule { }
