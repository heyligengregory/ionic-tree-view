import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeViewComponent } from 'ionic-tree-view.component';

export * from './ionic-tree-view.component';

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
export class IonicTreeViewModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: IonicTreeViewModule,
			providers: []
		};
	}
}
