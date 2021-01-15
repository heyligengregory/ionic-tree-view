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
    "parentID": 1
  },
  {
    "id": 3,
    "name": "Chair",
    "parentID": 1
  },
  {
    "id": 4,
    "name": "Sofas",
    "parentID": 1
  },
  {
    "id": 5,
    "name": "Sofa 1",
    "parentID": 4
  },
  {
    "id": 6,
    "name": "Little table",
    "parentID": 2
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
<!-- You can now use component in home.html -->
  <tree-view [items]="items" [persistedName]="persistedName" [treeViewName]="treeViewName"></tree-view>
```

```typescript
  public items = [..];
  public persistedName = "MyItemsPersisted";
  public treeViewName = "MyItemsTreeView";
```

## Inputs

1. items
   This represents the elements that will form the treeview

2. persistedName
   This allows you to save checked items in the local storage.

3. treeViewName
   This is the name of your treeview

## License

MIT © [Gregory Heyligen](mailto:cudderheyl@gmail.com)
