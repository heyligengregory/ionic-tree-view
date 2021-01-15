import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { TreeViewComponent } from './tree-view/tree-view.component';
import { TreeViewItemsComponent } from './tree-view-items/tree-view-items.component';
import { TreeViewItemComponent } from './tree-view-item/tree-view-item.component';
import { TreeViewDataService } from './tree-view-data.service';
import { TreeViewEventService } from './tree-view-event.service';
import { TreeViewLibService } from './tree-view-lib.service';

@NgModule({
    declarations: [
        TreeViewComponent,
        TreeViewItemsComponent,
        TreeViewItemComponent,
    ],
    imports: [IonicModule.forRoot(), FormsModule, CommonModule],
    exports: [TreeViewComponent],
})
export class TreeViewModule {
    static forRoot(): ModuleWithProviders<TreeViewModule> {
        return {
            ngModule: TreeViewModule,
            providers: [
                TreeViewDataService,
                TreeViewLibService,
                TreeViewEventService,
            ],
        };
    }
}
