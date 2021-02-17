import { FilialiListComponent } from './filiali-list/filiali-list.component';
import { BaseLayerComponent } from './base-layer/base-layer.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: BaseLayerComponent,
    children: [
      // {
        // path: '', redirectTo: '/', pathMatch: 'full',
      // },
      {
        path: '',
        component: ContactsListComponent
      },
      {
        path: 'filiali',
        component: FilialiListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
