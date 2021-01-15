import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { TreeViewItemsComponent } from './components/tree-view-items/tree-view-items.component';
import { TreeViewItemComponent } from './components/tree-view-item/tree-view-item.component';
import { TreeViewDataService } from './services/tree-view-data.service';
import { TreeViewEventService } from './services/tree-view-event.service';
import { TreeViewService } from './services/tree-view.service';

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
                TreeViewService,
                TreeViewEventService,
            ],
        };
    }
}
