import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeViewComponent } from 'components/ionic-tree-view.component';
import { TreeViewItemsComponent } from 'components/items/tree-view-items.component';
import { TreeViewItemComponent } from 'components/item/tree-view-item.component';
import { DataService } from 'services/tree-view-data.service';
import { EventService } from 'services/tree-view-event.service';
import { TreeViewService } from 'services/tree-view.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TreeViewComponent,
		TreeViewItemsComponent,
		TreeViewItemComponent
	],
	exports: [
		TreeViewComponent,
		TreeViewItemsComponent,
		TreeViewItemComponent
	]
})
export class IonicTreeViewModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: IonicTreeViewModule,
			providers: [DataService, EventService, TreeViewService]
		};
	}
}
