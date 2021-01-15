import { Component, OnInit, Input } from "@angular/core";
import { TreeViewLibService } from "../tree-view-lib.service";
import { TreeViewDataService } from "../tree-view-data.service";

@Component({
  selector: "tree-view",
  template: `
    <div class="list" *ngIf="items && items.length > 0">
      <tree-view-items
        *ngFor="let item of myTreeView"
        [treeViewName]="treeViewName"
        [persistedName]="persistedName"
        [item]="item"
      ></tree-view-items>
    </div>
  `,
  styles: [
    `
      .itemLevel-1 {
        padding-left: 0px;
      }

      @for $i from 2 through 30 {
        .itemLevel-#{$i} {
          margin-left: (($i - 1) * 20px) !important;
        }
      }

      .noElips {
        text-overflow: initial;
        white-space: normal;
      }

      ion-item,
      ion-item .label-md,
      tree-view-items .list-md {
        margin: 0 !important;
      }

      ion-item .item-inner {
        border: none !important;
      }

      tree-view-items ion-item .item-md {
        padding-left: 0 !important;
      }
    `,
  ],
})
export class TreeViewComponent implements OnInit {
  @Input()
  public items: any;
  @Input()
  public callbackFunctionCheckChanged: () => void;
  @Input()
  public persistedName: string;
  @Input()
  public treeViewName: string;
  public myTreeView: any;

  private itemLevel = 1;
  private tempArray = [];

  constructor(
    public dataService: TreeViewDataService,
    public treeViewService: TreeViewLibService
  ) {}

  ngOnInit() {
    this.dataService.setItemsByName(this.items, this.treeViewName);

    this.treeViewService.readOnLocalStorageCheckItems(
      this.persistedName,
      this.treeViewName,
      this.items
    );
    if (!this.getTreeView()) {
      this.initTreeView();
    }
    this.myTreeView = this.getTreeView();
  }

  // Init the treeView by generate the tree and set the tree in the treeViewService
  private initTreeView(): void {
    this.addTreeViewByName(this.generateTree(), this.treeViewName);
    this.treeViewService.collapseItem(this.getTreeView());
  }

  // Create the first level of the tree
  private generateTree(): any {
    let treeViewItems = [];
    this.itemLevel = 1;

    this.items
      .filter((e) => e.parentId === undefined)
      .forEach((value: any, key) => {
        treeViewItems.push(
          this.treeViewService.createNewItem(
            value,
            this.itemLevel,
            this.treeViewName
          )
        );
      });

    this.itemLevel++;
    this.createItemsLevelTwo(this.items, treeViewItems);
    return treeViewItems;
  }

  // Generate child of direct parent (level 2)
  private createItemsLevelTwo(treeData: any[], treeViewItems: any[]) {
    treeData = this.getItemsToAddInTreeView(treeData, treeViewItems);

    treeData
      .filter((e) => e.parentId !== undefined)
      .forEach((itemToAdd, ckikey) => {
        treeViewItems.forEach((item, tvikey) => {
          if (itemToAdd.parentId === item.id) {
            item.items.push(
              this.treeViewService.createNewItem(
                itemToAdd,
                this.itemLevel,
                this.treeViewName
              )
            );
          } else if (item.items && item.items.length !== 0) {
            item = this.createItemsOfLevelHigherThanTwo(
              itemToAdd,
              item,
              this.itemLevel + 1
            );
          }
        });
      });

    this.itemLevel++;

    if (treeData && treeData.length > 0) {
      this.tempArray = [];
      this.createItemsLevelTwo(this.items, treeViewItems);
    }
  }
  // Create items for level > 2
  private createItemsOfLevelHigherThanTwo(
    treeDataItemToAdd: any,
    treeViewChild: any,
    itemLevel
  ): any {
    treeViewChild.items.forEach((child, key) => {
      if (treeDataItemToAdd.parentId === child.id) {
        let itemExist = child.items.filter((e) => e.id === child.id);
        if (!itemExist || (itemExist && itemExist.length === 0)) {
          child.items.push(
            this.treeViewService.createNewItem(
              treeDataItemToAdd,
              itemLevel,
              this.treeViewName
            )
          );
        }
      } else if (child.items && child.items.length !== 0) {
        child = this.createItemsOfLevelHigherThanTwo(
          treeDataItemToAdd,
          child,
          itemLevel + 1
        );
      }
    });

    return treeViewChild;
  }

  // Get items to add in treeview
  private getItemsToAddInTreeView(
    treeData: any[],
    treeViewItems: any[]
  ): any[] {
    // Copy item
    let tempTree = Object.assign([], treeData);
    treeData = [];
    tempTree.forEach((elem, key) => {
      this.tempArray = [];
      let findElem = this.returnFlattenedArray(treeViewItems).filter(
        (e) => e.id === elem.id
      );
      if (!findElem || (findElem && findElem.length === 0)) {
        treeData.push(elem);
      }
    });

    return treeData;
  }

  // Return array of multiple level in one level
  private returnFlattenedArray(items): any[] {
    if (!this.tempArray) {
      this.tempArray = [];
    }
    this.tempArray = this.tempArray.concat(items);

    items.forEach((value, key) => {
      if (value.items !== undefined) {
        this.returnFlattenedArray(value.items);
      }
    });

    return this.tempArray;
  }

  private getTreeView(): any {
    return this.getTreeViewByName(this.treeViewName);
  }

  public getTreeViewByName(name: string): any {
    return this.dataService.getTreeViewItemsByName(name);
  }

  public addTreeViewByName(treeView: any, name: string): void {
    this.dataService.setTreeViewItemsByName(treeView, name);
  }
}
