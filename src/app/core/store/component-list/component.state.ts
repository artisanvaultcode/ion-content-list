import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {ComponentList} from "./component.model";
import {ComponentActions } from "./component.actions";
import {EMPTY, switchMap, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ComponentListService} from "../../../component-list/services/component-list.service";
import {PageMetaComponent} from "../../../component-list/interfaces/content-item.interface";
import {CardContent} from "../../../component-list/interfaces/card-content.interface";
import {catchError} from "rxjs/operators";

@State<ComponentList>({
  name: 'componentList',
  defaults: {
    components: [],
    meta: null,
    data: null,
    loading: false,
    error: null,
    maxComponents: 20,
    searchTerm: '',
    hasMore: true,
    currentPage: 1,
    validationErrors: null,
    itemsPerPage: 10,
    totalItems: 20
  }
})
@Injectable()
export class ComponentState {

  constructor(
    private service: ComponentListService,
  ) {}

  @Selector()
  static getComponents(state: ComponentList): CardContent[] {
    return state.components.filter(comp =>
      comp.content.type.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

  @Selector()
  static getLoading(state: ComponentList): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: ComponentList): string | null {
    return state.error;
  }

  @Selector()
  static getMoreItems(state: ComponentList): boolean {
    return state.hasMore;
  }

  @Selector()
  static getComponentCount(state: ComponentList): number {
    return state.components.length;
  }

  @Selector()
  static getMaxComponents(state: ComponentList): number {
    return state.maxComponents;
  }

  @Selector()
  static canAddMore(state: ComponentList): boolean {
    return state.components.length < state.maxComponents;
  }

  @Action(ComponentActions.LoadComponents)
  loadComponents(ctx: StateContext<ComponentList>, action: ComponentActions.LoadComponents) {
    const state = ctx.getState();
    if (action.refresh) {
      ctx.patchState({ loading: true, error: null, currentPage: 1 });
    }

    const cardId = "68784c5e56322e9d4254735f";
    return this.service.findAll(cardId, {} ).pipe(
      tap((items: PageMetaComponent) => {
        const totalItems = items.meta.itemCount;
        ctx.patchState({
          components: items.data,
          meta: items.meta,
          loading: false,
          hasMore: items.data.length === state.itemsPerPage && items.data.length < totalItems,
          error: null
        });
      }),
      catchError(this.handleErrorPublicFailure(ctx))
    );
  }

  @Action(ComponentActions.AddComponent)
  addComponent(ctx: StateContext<ComponentList>, action: ComponentActions.AddComponent) {
    const state = ctx.getState();

    if (state.components.length >= state.maxComponents) {
      ctx.patchState({ error: 'Maximum component limit reached' });
      return;
    }
    const cardId = "68784c5e56322e9d4254735f";

    return this.service.add(cardId, action.component ).pipe(
      tap((result) => {
        const newComponent: CardContent = {
          ...result,
          order: state.components.length + 1
        };
        ctx.patchState({
          components: [...state.components, newComponent],
          error: null
        });
      }),
      catchError(this.handleErrorPublicFailure(ctx))
    );
  }

  @Action(ComponentActions.UpdateComponent)
  updateComponent(ctx: StateContext<ComponentList>, action: ComponentActions.UpdateComponent) {
    const state = ctx.getState();
    const components = state.components.map(comp =>
      comp.content.primaryId === action.primaryId
        ? { ...comp, ...action.updates, updatedAt: new Date() }
        : comp
    );

    ctx.patchState({ components });
  }


  @Action(ComponentActions.ToggleComponent)
  toggleComponent(ctx: StateContext<ComponentList>, action: ComponentActions.ToggleComponent) {
    ctx.patchState({  error: null });
    const state = ctx.getState();
    return this.service.enable(action.primaryId, action.updates ).pipe(
      tap((item: any) => {
        console.log(item);
        const components = state.components.map(comp =>
          comp.primaryId === action.updates.primaryId
            ? { ...comp, ...action.updates, updatedAt: new Date() }
            : comp
        );
        ctx.patchState({ components, error: null });
      }),
      catchError((error) => {
        console.error('Toggle failed:', error);
        // Revert optimistic update or handle error state
        ctx.patchState({ components: [], error: error.message });
        const components = state.components.map(comp =>
          comp.primaryId === action.updates.primaryId
            ? { ...comp, updatedAt: new Date() }
            : comp
        );
        ctx.patchState({ components, error: error.message });
        return EMPTY;
      })
    );
  }

  @Action(ComponentActions.UpdateCardContent)
  updateCardContent(ctx: StateContext<ComponentList>, action: ComponentActions.UpdateCardContent) {
    const state = ctx.getState();
    const { primaryId } =  action.updates;
    if (!primaryId) {
      return EMPTY;
    }
    return this.service.update(primaryId, action.updates ).pipe(
      tap((item: any) => {
        console.log(item);
        const components = state.components.map(comp =>
          comp.primaryId === action.updates.primaryId
            ? { ...comp, ...action.updates, updatedAt: new Date() }
            : comp
        );
        ctx.patchState({ components, error: null });
      }),
      catchError((error) => {
        console.error('Toggle failed:', error);
        // Revert optimistic update or handle error state
        ctx.patchState({ components: [], error: error.message });
        const components = state.components.map(comp =>
          comp.primaryId === action.updates.primaryId
            ? { ...comp, updatedAt: new Date() }
            : comp
        );
        ctx.patchState({ components, error: error.message });
        return EMPTY;
      })
    );
  }

  @Action(ComponentActions.UpdateGlobalColors)
  updateGlobalColors(ctx: StateContext<ComponentList>, action: ComponentActions.UpdateGlobalColors) {
    const state = ctx.getState();
    const components = state.components.map(comp => ({
      ...comp,
      content: {
        ...comp.content,
        backgroundColor: action.updates.value || comp.content.backgroundColor,
        textColor: action.updates?.textColor || comp.content.textColor
      },
      updatedAt: new Date()
    }));

    ctx.patchState({ components });
  }

  @Action(ComponentActions.ApplyGlobalColors)
  applyGlobalColors(ctx: StateContext<ComponentList>, action: ComponentActions.ApplyGlobalColors) {
    const state = ctx.getState();
    const components = state.components.map(comp => ({
      ...comp,
      content: {
        ...comp.content,
        backgroundColor: action.updates.value || comp.content.backgroundColor,
        textColor: action.updates?.textColor || comp.content.textColor
      },
      updatedAt: new Date()
    }));
    const cardId = "68784c5e56322e9d4254735f";
    return this.service.updateGlobalColors(cardId, {
      backgroundColor: action.updates.value,
      textColor: action.updates?.textColor
    }).pipe(tap((items: PageMetaComponent) => {
        ctx.patchState({ components });
      }),
      catchError(this.handleErrorPublicFailure(ctx))
    );
  }

  @Action(ComponentActions.DeleteComponent)
  deleteComponent(ctx: StateContext<ComponentList>, action: ComponentActions.DeleteComponent) {
    const state = ctx.getState();
    const cardId = "68784c5e56322e9d4254735f";
    return this.service.del(action.primaryId).pipe(
      switchMap(() => this.service.findAll(cardId, {})),
      tap((items: PageMetaComponent) => {
        ctx.patchState({
          components: items.data,
          meta: items.meta,
          loading: false,
          hasMore: false,
          error: null
        });
      }),
      catchError(this.handleErrorPublicFailure(ctx))
    );
  }

  @Action(ComponentActions.SaveOrderedComponents)
  saveOrderedComponents(ctx: StateContext<ComponentList>) {
    const state = ctx.getState();
    const components = [...state.components]; // Create a shallow copy of the array
    const extractedOrderData = components.map(comp => ({
      primaryId: comp.primaryId,
      order: comp.order
    }));
    ctx.patchState({ loading: true, error: null });
    const cardId = "68784c5e56322e9d4254735f";
    return this.service.reorder(cardId, extractedOrderData ).pipe(
      switchMap(() => this.service.findAll(cardId, {} )),
      tap((items: PageMetaComponent) => {
        const totalItems = items.meta.itemCount;
        ctx.patchState({
          components: items.data,
          meta: items.meta,
          loading: false,
          hasMore: items.data.length === state.itemsPerPage && items.data.length < totalItems,
          error: null
        });
      }),
      catchError((error) => {
        console.error('Save Reordering failed:', error);
        ctx.patchState({ components, error: error.message });
        return EMPTY;
      })
    );

  }

  @Action(ComponentActions.ReorderComponents)
  reorderComponents(ctx: StateContext<ComponentList>, action: ComponentActions.ReorderComponents) {
    const state = ctx.getState();
    const components = [...state.components]; // Create a shallow copy of the array
    if (action.fromIndex < 0 || action.fromIndex >= components.length ||
      action.toIndex < 0 || action.toIndex >= components.length) {
      ctx.patchState({ loading: false, error: 'ReorderComponents: Invalid fromIndex or toIndex'});
      return ;
    }

    const [removedItem] = components.splice(action.fromIndex, 1); // Removes item and gets it
    components.splice(action.toIndex, 0, removedItem); // Inserts item at new position
    // Use map for immutability and clarity
    const updatedComponents = components.map((comp, index) => {
      const newOrder = index * 10;
      if (comp.order !== newOrder) {
        return {
          ...comp, // Shallow copy existing properties
          order: newOrder, // Update the order property
        };
      }
      return comp; // No change needed for this component, return the original reference
    });

    ctx.patchState({
      components: updatedComponents,
    });
  }

  @Action(ComponentActions.SearchComponents)
  searchComponents(ctx: StateContext<ComponentList>, action: ComponentActions.SearchComponents) {
    ctx.patchState({ searchTerm: action.searchTerm });
  }

  @Action(ComponentActions.LoadMoreComponents)
  loadMoreComponents(ctx: StateContext<ComponentList>) {
    const state = ctx.getState();
    if (!state.hasMore || state.loading) return;
    ctx.patchState({ loading: true });
    let paging = {};
    if (state.meta && (state.meta.hasNextPage || state.meta.hasPreviousPage)) {
      if ( parseInt(state.meta.page) + 1 > state.meta.pageCount) {
        ctx.patchState({ loading: false });
        return EMPTY;
      }
      paging = { page: parseInt(state.meta.page) + 1, size: state.itemsPerPage };
    }
    const cardId = "68784c5e56322e9d4254735f";
    return this.service.findAll(cardId, paging).pipe(
      tap((newItems: PageMetaComponent) => {
        const updatedItems = [...state.components, ...newItems.data];
        ctx.patchState({
          components: updatedItems,
          meta: newItems.meta,
          currentPage: state.currentPage + 1,
          loading: false,
          hasMore: updatedItems.length < state.meta.itemCount
        });
      }),
      catchError((error) => {
        ctx.patchState({ loading: false, error: error.message });
        return EMPTY;
      })
    );
  }

  private handleErrorPublicFailure(ctx: StateContext<ComponentList>) {
    return (errorResponse: HttpErrorResponse) => {
      console.error('Error:', errorResponse);
      const error = this.extractError(errorResponse);
      ctx.patchState({
        validationErrors: error,
      });
      return EMPTY;
    };
  }

  private extractError(errorResponse: HttpErrorResponse): any {
    let error: any = null;
    if (errorResponse.error) {
      error = errorResponse;
    } else {
      error = errorResponse.error;
    }
    return error;
  }
}
