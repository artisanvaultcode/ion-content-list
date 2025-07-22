import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentListManagerComponent } from './component-list-manager.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentListManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentListManagerRoutingModule {}
