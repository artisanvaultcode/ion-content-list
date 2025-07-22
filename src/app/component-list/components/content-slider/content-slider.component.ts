import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import {Observable, of, Subject} from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ContentItem } from '../../interfaces/content-item.interface';
import { ContentSliderState } from '../../../core/store/content-slider/content-slider.state';
import {SliderActions} from "../../../core/store/content-slider/content-slider.actions";

@Component({
  selector: 'app-content-slider',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './content-slider.component.html',
  styleUrls: ['./content-slider.component.scss']
})
export class ContentSliderComponent implements OnInit, OnDestroy {
  filteredItems$!: Observable<ContentItem[]>;
  selectedItems$!: Observable<ContentItem[]>;
  searchTerm$!: Observable<string>;
  isLoading$!: Observable<boolean>;
  hasMore$!: Observable<boolean>;
  error$!: Observable<string | null>;
  canSelectMore$!: Observable<boolean>;

  @Input() maxSelections: number = 0; // 0 means unlimited
  @Input() itemsPerPage: number = 10;
  @Input() searchPlaceholder: string = 'Search items...';
  @Input() addButtonText: string = 'Add Selected';
  @Input() showAddButton: boolean = true;

  @Output() selectionChange = new EventEmitter<ContentItem[]>();
  @Output() itemSelect = new EventEmitter<ContentItem>();
  @Output() itemDeselect = new EventEmitter<ContentItem>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() addSelectedItems = new EventEmitter<ContentItem[]>();

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  searchTerm: string = '';

  constructor(private store: Store) {}

  ngOnInit() {

    this.filteredItems$ = this.store.select(ContentSliderState.getFilteredItems);
    this.selectedItems$ = this.store.select(ContentSliderState.getSelectedItems);
    this.searchTerm$ = this.store.select(ContentSliderState.getSearchTerm);
    this.isLoading$ = this.store.select(ContentSliderState.isLoading);
    this.hasMore$ = this.store.select(ContentSliderState.hasMore);
    this.error$ = this.store.select(ContentSliderState.getError);
    this.canSelectMore$ = this.store.select(ContentSliderState.canSelectMore);

    this.store.dispatch(new SliderActions.SetMaxSelections(this.maxSelections));
    // Initialize data loading
    this.store.dispatch(new SliderActions.LoadItems({ reset: true }));

    // Subscribe to selection changes and emit to parent
    this.selectedItems$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(selectedItems => {
      this.selectionChange.emit(selectedItems);
    });

    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.store.dispatch(new SliderActions.SearchItems(searchTerm));
    });

    // Subscribe to search term changes from state
    this.searchTerm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  onClearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onItemClick(item: ContentItem) {
    if (!item.enabled) return;
    this.store.dispatch(new SliderActions.SelectItem(item));
    // this.selectedItems$.pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe(selectedItems => {
    //   const isSelected = selectedItems.some(selected => selected.id === item.id);
    //
    //   if (isSelected) {
    //     this.onItemDeselect(item);
    //   } else {
    //     this.onItemSelect(item);
    //   }
    // }).unsubscribe();
  }

  onItemSelect(item: ContentItem) {
    console.log(item);
    this.store.dispatch(new SliderActions.SelectItem(item));
    // this.itemSelect.emit(item);
  }

  onItemDeselect(item: ContentItem) {
    this.store.dispatch(new SliderActions.DeselectItem(item.primaryId));
    // this.itemDeselect.emit(item);
  }

  onLoadMore() {
    this.store.dispatch(new SliderActions.LoadMoreItems());
    // this.loadMore.emit();
  }

  isItemSelected(item: ContentItem): Observable<boolean> {
    return this.selectedItems$.pipe(
      takeUntil(this.destroy$),
      map(selectedItems => selectedItems.some(selected => selected.primaryId === item.primaryId))
    );
  }

  clearSelection() {
    this.store.dispatch(new SliderActions.ClearSelection());
  }

  onAddSelectedItems() {
    this.selectedItems$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(selectedItems => {
      if (selectedItems.length > 0) {
        this.addSelectedItems.emit([...selectedItems]);
        // Clear selection after adding
        this.clearSelection();
      }
    }).unsubscribe();
  }

  trackByFn(index: number, item: ContentItem): string {
    return item.primaryId;
  }
}
