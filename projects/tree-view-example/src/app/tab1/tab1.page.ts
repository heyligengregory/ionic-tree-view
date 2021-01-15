import { Component } from "@angular/core";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  public treeviewItems = [
    { id: 1, name: "Furniture" },
    { id: 2, name: "Tables", parentID: 1 },
    { id: 3, name: "Chair", parentID: 1 },
    { id: 4, name: "Sofas", parentID: 1 },
    { id: 5, name: "Sofa 1", parentID: 4 },
    { id: 6, name: "Little table", parentID: 2 },
    { id: 7, name: "Decor" },
    { id: 8, name: "Outdoor" },
  ];

  constructor() {}
}
