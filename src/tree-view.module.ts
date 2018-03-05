import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeViewService } from 'tree-view.service';
import { TreeViewComponent } from 'tree-view.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TreeViewComponent
	],
	exports: [
		TreeViewComponent
	]
})
export class TreeViewModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: TreeViewModule,
			providers: [TreeViewService]
		};
	}
}
