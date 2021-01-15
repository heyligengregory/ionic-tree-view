# Tree-view

This library is used to generate a treeview from an object list, you will find an example of a list below:

```json
[
  {
    "id": 1,
    "name": "Furniture"
  },
  {
    "id": 2,
    "name": "Tables",
    "parentId": 1
  },
  {
    "id": 3,
    "name": "Chair",
    "parentId": 1
  },
  {
    "id": 4,
    "name": "Sofas",
    "parentId": 1
  },
  {
    "id": 5,
    "name": "Sofa 1",
    "parentId": 4
  },
  {
    "id": 6,
    "name": "Little table",
    "parentId": 2
  },
  {
    "id": 7,
    "name": "Decor"
  },
  {
    "id": 8,
    "name": "Outdoor"
  }
]
```

## Rendering

![alt text](Treeview-example.PNG)

## Installation

To install this library, run:

```bash
$ npm install ionic-tree-view --save
```

## Use library into Ionic Project

Once you have installed, you can import library in any Ionic application by doing:

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

// Import library
import { TreeViewModule } from "ionic-tree-view";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,

    // Specify library as an import
    TreeViewModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Once your library is imported, you can use component in your Ionic application:

```xml
  <tree-view
      [items]="items"
      [persistedName]="'MyTreeView'"
      [treeViewName]="'MyTreeView'">
  </tree-view>
```

```typescript
  //Items that will be in be in TreeView
  public items = [..];
  //Optional - Key used to save checked items in the local storage
  public persistedName = "MyItemsPersisted";
  //Optional - Key of TreeView
  public treeViewName = "MyItemsTreeView";
```

## License

MIT © [Gregory Heyligen](mailto:cudderheyl@gmail.com)
