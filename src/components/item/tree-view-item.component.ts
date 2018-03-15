import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TreeViewService } from 'services/tree-view.service';
import { EventService } from 'services/tree-view-event.service';


@Component({
	selector: 'tree-view-item',
	templateUrl: './tree-view-item.component.html'
})
export class TreeViewItemComponent {
	@Input()
	public item: any;
	@Input()
	public persistedName: string;
	@Input()
	public treeViewName: string;

	constructor(
		public treeViewService: TreeViewService,
		public eventService: EventService) { }

	public ngOnInit() {
		if (this.item && this.item.checked == undefined)
			this.item.checked = false;
	}
	
	public onCheckChanged(): void {
		this.eventService.checkChanged(this.item, this.treeViewName, this.persistedName);
	}
}
