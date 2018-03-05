# tree-view

This library is used ...

## Installation

To install this library, run:

```bash
$ npm install ionic-tree-view --save
```

## Use library into Ionic Project

Once you have installed, you can import library in any Ionic application by doing:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import library
import { TreeViewModule } from 'tree-view';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify library as an import
    TreeViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its directives in your Ionic application:

```xml
<!-- You can now use your library component in app.component.html -->
<tree-view [items]="myItems"></tree-view>
```
## License

MIT © [Gregory Heyligen](mailto:cudderheyl@gmail.com)
