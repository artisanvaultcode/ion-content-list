import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Store } from '@ngxs/store';
import {Observable, of, Subject} from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AlertController,
  ToastController,
  ModalController,
  LoadingController, IonInfiniteScroll, IonList, InfiniteScrollCustomEvent
} from '@ionic/angular';
import { ComponentListItem } from './interfaces/component.interface';
import {
  ComponentState
} from '../core/store/component-list/component.state';
import {ComponentActions} from "../core/store/component-list/component.actions";
import {EditContentPage} from "./components/edit-content/edit-content.page";
import {ContentItem} from "./interfaces/content-item.interface";
import {CardContent} from "./interfaces/card-content.interface";
import {ColorOption} from "./components/custom-color/custom-color.component";

@Component({
  selector: 'app-component-list-manager',
  templateUrl: './component-list-manager.component.html',
  styleUrls: ['./component-list-manager.component.scss'],
  standalone: false
})
export class ComponentListManagerComponent implements OnInit, OnDestroy {
  @ViewChild(IonList) ionList: IonList | undefined;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | undefined;

  components$: Observable<CardContent[]>= of([]);
  loading$: Observable<boolean> =  of(false);
  error$: Observable<string | null> = of(null);
  componentCount$: Observable<number> = of(0);
  maxComponents$: Observable<number> = of(0);
  canAddMore$: Observable<boolean> = of(false);
  getMoreItems$: Observable<boolean> = of(false);
  showContentIcons: boolean = false;
  showGlobalColors: boolean = false;
  listHasBeenReorder: boolean = false;

  searchTerm = '';
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  index= 0;

  selectedItems: ContentItem[] = [];
  addedItems: ContentItem[] = [];
  eventLog: any[] = [];
  maxSelections = 4;
  itemsPerPage = 10;
  searchPlaceholder = 'Search content items...';
  addButtonText = 'Add Selected';
  showAddButton = true;

  constructor(
    private store: Store,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Initialize observables
    this.components$ = this.store.select(ComponentState.getComponents);
    this.loading$ = this.store.select(ComponentState.getLoading);
    this.error$ = this.store.select(ComponentState.getError);
    this.componentCount$ = this.store.select(ComponentState.getComponentCount);
    this.maxComponents$ = this.store.select(ComponentState.getMaxComponents);
    this.canAddMore$ = this.store.select(ComponentState.canAddMore);
    this.getMoreItems$ = this.store.select(ComponentState.getMoreItems);

    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.store.dispatch(new ComponentActions.SearchComponents(searchTerm));
    });

    // Initial load
    this.store.dispatch(new ComponentActions.LoadComponents());

    // Handle errors
    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.showErrorToast('OOPS! Sorry , Try Again').then(_ => console.log('--'));
      }
    });

    this.components$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      if (items) {
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.searchSubject.next(this.searchTerm);
  }

  // Slider Events
  onSelectionChange(selectedItems: ContentItem[]) {
    this.selectedItems = selectedItems;
    this.addToEventLog('SELECTION_CHANGE', `Selection changed: ${selectedItems.length} items selected`);
    console.log('Selection changed:', selectedItems);
  }

  onItemSelect(item: ContentItem) {
    this.addToEventLog('SELECT', `Selected: ${item.title}`);
    console.log('Item selected:', item);
  }

  onItemDeselect(item: ContentItem) {
    this.addToEventLog('DESELECT', `Deselected: ${item.title}`);
    console.log('Item deselected:', item);
  }

  onLoadItemMore() {
    this.addToEventLog('LOAD_MORE', 'Load more items requested');
    console.log('Load more items requested');
  }

  onAddSelectedItems(selectedItems: ContentItem[]) {
    selectedItems.forEach(item => {
      if (!this.addedItems.find(addedItem => addedItem.primaryId === item.primaryId)) {
        this.addedItems.push(item);
        const newType: ComponentListItem = this.getDefaultUserComponent();
        Object.keys(item).forEach(key => {
          if (key in newType) {
            (newType as any)[key] = (item as any)[key];
          }
        });
        newType.enabled = true;
        this.store.dispatch(new ComponentActions.AddComponent(newType))
      }
    });
    // console.log('Total added items:', this.addedItems);
  }

  // <----- Slider Events End
  onColorChange(color: ColorOption) {
    console.log('Color:', color);
    this.store.dispatch(new ComponentActions.UpdateGlobalColors(color));
  }

  onApplyColorChange(color: ColorOption) {
    this.store.dispatch(new ComponentActions.ApplyGlobalColors(color));
  }

  private addToEventLog(type: string, message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLog.unshift({ type, message, timestamp });

    // Keep only last 20 events
    if (this.eventLog.length > 20) {
      this.eventLog = this.eventLog.slice(0, 20);
    }
  }

  async onRefresh(event: any) {
    this.store.dispatch(new ComponentActions.LoadComponents(true));

    // Wait for loading to complete
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      if (!loading) {
        event.target.complete();
      }
    });
  }

  onReorder(event: any) {
    event.detail.complete();
    this.listHasBeenReorder = true;
    this.store.dispatch(new ComponentActions.ReorderComponents(event.detail.from, event.detail.to));
  }

  onSaveOrdered() {
    this.listHasBeenReorder = false;
    this.store.dispatch(new ComponentActions.SaveOrderedComponents());
  }


  async onContentComponent() {
    const canAdd = await this.store.selectOnce(ComponentState.canAddMore).toPromise();

    if (!canAdd) {
      await this.showErrorToast('Maximum component limit reached');
      return;
    }
    this.showContentIcons = !this.showContentIcons;
    this.showGlobalColors = false
  }

  async onChangeGlobalColors() {
    this.showGlobalColors = !this.showGlobalColors;
    this.showContentIcons = false;
  }


  async onEditComponent(cc: CardContent) {
    const component = cc.content;
    const baseConfig = {
      type: component.type,
      title: component.title,
      description: component.description,
      backgroundColor: component.backgroundColor,
      textColor: component.textColor,
    };

    // @ts-ignore
    const typeSpecificConfig = {
      license: { licenseNumber: component.valueOrMeta },
      email: { email: component.valueOrMeta },
      image: { imageUrl: component.valueOrMeta },
      phone: { phoneNumber: component.valueOrMeta },
      youtube: { link: component.valueOrMeta },
      whatsApp: { link: component.valueOrMeta }
    }[component.type] || { link: component.valueOrMeta };

    const baseConfigData =  { ...baseConfig, ...typeSpecificConfig };

    const modal = await this.modalController.create({
      component: EditContentPage,
      componentProps: {
        configType: baseConfigData,
        contentCard: cc
      },
      backdropDismiss: false
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data) {

      console.log('return data', data);
      // return data from dynamics
      this.store.dispatch(new ComponentActions.UpdateCardContent(data));

    }
  }

  onToggleComponent(component: CardContent) {
    this.store.dispatch(new ComponentActions.ToggleComponent(component.primaryId, { enabled: !component.enabled }));
  }

  async onDeleteComponent(component: CardContent) {
    const alert = await this.alertController.create({
      header: `Delete ${component.content.type}`,
      message: `Are you sure you want to delete "${component.content.title}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.store.dispatch(new ComponentActions.DeleteComponent(component.primaryId));
            this.showSuccessToast('Component deleted successfully');
          }
        }
      ]
    });

    await alert.present();
  }

  onLoadMore(event: InfiniteScrollCustomEvent) {
    this.store.dispatch(new ComponentActions.LoadMoreComponents());
    setTimeout(() => {
      return event.target.complete();
    }, 600);
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

  private getDefaultUserComponent(): ComponentListItem {
    return {
      backgroundColor: "",
      description: "",
      enabled: true,
      icon: "",
      id: "",
      order: 0,
      primaryId: "",
      textColor: "",
      title: "",
      type: 'linkedin',
      valueOrMeta: ""
    };
  }

}
