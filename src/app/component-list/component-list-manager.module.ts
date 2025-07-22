import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';

import { ComponentListManagerComponent } from './component-list-manager.component';
import {ComponentState} from '../core/store/component-list/component.state';
import {ComponentListManagerRoutingModule} from "./component-list-manager.routes";
import {EditContentPage} from "./components/edit-content/edit-content.page";
import {DynamicFormComponent} from "./components/dynamic-form/dynamic-form.component";
import {ContentSliderComponent} from "./components/content-slider/content-slider.component";
import {ContentSliderState} from "../core/store/content-slider/content-slider.state";
import {CustomColorItemComponent} from "./components/custom-color/custom-color.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([ComponentState, ContentSliderState]),
    ComponentListManagerRoutingModule,
    ContentSliderComponent,
    NgOptimizedImage,
  ],
  declarations: [ComponentListManagerComponent,CustomColorItemComponent, EditContentPage, DynamicFormComponent],
})
export class ComponentListManagerModule{}
