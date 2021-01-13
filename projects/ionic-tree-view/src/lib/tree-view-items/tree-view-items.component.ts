import { Component, Input } from "@angular/core";
import { TreeViewLibService } from "../tree-view-lib.service";

@Component({
  selector: "tree-view-items",
  templateUrl: "tree-view-items.component.html",
  styleUrls: ["tree-view-items.component.scss"],
})
export class TreeViewItemsComponent {
  @Input()
  public item: any;
  @Input()
  public persistedName: string;
  @Input()
  public treeViewName: string;
  constructor(public treeViewLibService: TreeViewLibService) {}
}
