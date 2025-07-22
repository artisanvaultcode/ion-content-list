import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {ContentItem, ContentSliderStateModel, PageMetaSlider} from '../../../component-list/interfaces/content-item.interface';
import {ContentTypesService} from "../../../component-list/services/content-types.service";
import {SliderActions} from "./content-slider.actions";

@State<ContentSliderStateModel>({
  name: 'contentSlider',
  defaults: {
    items: [],
    meta: null,
    filteredItems: [],
    selectedItems: [],
    searchTerm: '',
    currentPage: 0,
    itemsPerPage: 10,
    maxSelections: 0, // 0 means unlimited
    totalItems: 14,
    isLoading: false,
    hasMore: true,
    error: null
  }
})
@Injectable()
export class ContentSliderState {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private contentService: ContentTypesService) {}

  @Selector()
  static getItems(state: ContentSliderStateModel): ContentItem[] {
    return state.items;
  }

  @Selector()
  static getFilteredItems(state: ContentSliderStateModel): ContentItem[] {
    return state.filteredItems;
  }

  @Selector()
  static getSelectedItems(state: ContentSliderStateModel): ContentItem[] {
    return state.selectedItems;
  }

  @Selector()
  static getSearchTerm(state: ContentSliderStateModel): string {
    return state.searchTerm;
  }

  @Selector()
  static isLoading(state: ContentSliderStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static hasMore(state: ContentSliderStateModel): boolean {
    return state.hasMore;
  }

  @Selector()
  static getError(state: ContentSliderStateModel): string | null {
    return state.error;
  }

  @Selector()
  static getCurrentPage(state: ContentSliderStateModel): number {
    return state.currentPage;
  }

  @Selector()
  static getTotalItems(state: ContentSliderStateModel): number {
    return state.totalItems;
  }

  @Selector()
  static canSelectMore(state: ContentSliderStateModel): boolean {
    // If maxSelections is 0, unlimited selections are allowed
    return state.maxSelections === 0 || state.selectedItems.length < state.maxSelections;
  }

  @Action(SliderActions.LoadItems)
  loadItems(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.LoadItems) {
    const state = ctx.getState();
    ctx.patchState({ isLoading: true, error: null });

    return this.contentService.findAvailable({}).pipe(
      tap((items: PageMetaSlider) => {
        const totalItems = items.meta.itemCount;
        ctx.patchState({
          items: items.data,
          meta: items.meta,
          filteredItems: state.searchTerm.trim().length ===0  ? items.data : this.filterItems(items.data, state.searchTerm) ,
          currentPage: 1,
          totalItems: items.meta.itemCount,
          isLoading: false,
          hasMore: items.data.length === state.itemsPerPage && items.data.length < totalItems,
          error: null
        });
      }),
      catchError((error) => {
        ctx.patchState({ isLoading: false, error: error.message });
        return EMPTY;
      })
    );
  }

  @Action(SliderActions.LoadMoreItems)
  loadMoreItems(ctx: StateContext<ContentSliderStateModel>) {
    const state = ctx.getState();
    if (!state.hasMore || state.isLoading) return EMPTY;
    ctx.patchState({ isLoading: true });
    let paging = {};
    if (state.meta && state.meta.hasNextPage) {
      if ( parseInt(state.meta.page) + 1 > state.meta.pageCount) {
        return ;
      }
      paging = { page: parseInt(state.meta.page) + 1, size: state.itemsPerPage };
    }
    return this.contentService.findAvailable(paging).pipe(
      tap((newItems: PageMetaSlider) => {
        const updatedItems = [...state.items, ...newItems.data];
        ctx.patchState({
          items: updatedItems,
          meta: newItems.meta,
          filteredItems: state.searchTerm.trim().length ===0  ? updatedItems : this.filterItems(updatedItems, state.searchTerm) ,
          currentPage: state.currentPage + 1,
          isLoading: false,
          hasMore: updatedItems.length < state.totalItems
        });
      }),
      catchError((error) => {
        ctx.patchState({ isLoading: false, error: error.message });
        return EMPTY;
      })
    );
  }

  @Action(SliderActions.SearchItems)
  searchItems(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.SearchItems) {
    const state = ctx.getState();
    const filteredItems = this.filterItems(state.items, action.searchTerm);

    ctx.patchState({
      searchTerm: action.searchTerm,
      filteredItems: filteredItems
    });
  }

  @Action(SliderActions.SelectItem)
  selectItem(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.SelectItem) {
    const state = ctx.getState();

    // Check if item is already selected
    if (state.selectedItems.find(item => item.primaryId === action.item.primaryId)) {
      ctx.patchState({
        selectedItems: state.selectedItems.filter(item => item.primaryId !== action.item.primaryId)
      });
      return ;
    }

    // Check if item is enabled
    if (!action.item.enabled) {
      return;
    }

    // Check if maximum selections reached (0 means unlimited)
    if (state.maxSelections > 0 && state.selectedItems.length >= state.maxSelections) {
      return;
    }

    ctx.patchState({
      selectedItems: [...state.selectedItems, action.item]
    });
  }

  @Action(SliderActions.DeselectItem)
  deselectItem(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.DeselectItem) {
    const state = ctx.getState();

    ctx.patchState({
      selectedItems: state.selectedItems.filter(item => item.primaryId !== action.itemId)
    });
  }

  @Action(SliderActions.ClearSelection)
  clearSelection(ctx: StateContext<ContentSliderStateModel>) {
    ctx.patchState({
      selectedItems: []
    });
  }

  @Action(SliderActions.SetLoading)
  setLoading(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.SetLoading) {
    ctx.patchState({
      isLoading: action.isLoading
    });
  }

  @Action(SliderActions.SetError)
  setError(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.SetError) {
    ctx.patchState({
      error: action.error
    });
  }

  @Action(SliderActions.SetMaxSelections)
  setMaxSelections(ctx: StateContext<ContentSliderStateModel>, action: SliderActions.SetMaxSelections) {
    ctx.patchState({
      maxSelections: action.maxSelections
    });
  }

  private filterItems(items: ContentItem[], searchTerm: string): ContentItem[] {
    if (!searchTerm.trim()) {
      return items.filter(item => item.enabled);
    }

    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) && item.enabled
    );
  }
}
