import { ContentItem } from '../../../component-list/interfaces/content-item.interface';

export class ContentSliderActions {
  static readonly LoadItems = '[ContentSlider] Load Items';
  static readonly LoadMoreItems = '[ContentSlider] Load More Items';
  static readonly SearchItems = '[ContentSlider] Search Items';
  static readonly SelectItem = '[ContentSlider] Select Item';
  static readonly DeselectItem = '[ContentSlider] Deselect Item';
  static readonly ClearSelection = '[ContentSlider] Clear Selection';
  static readonly SetLoading = '[ContentSlider] Set Loading';
  static readonly SetError = '[ContentSlider] Set Error';
  static readonly SetMaxSelections = '[ContentSlider] Set Max Selections';
}

export namespace SliderActions {
  export class LoadItems {
    static readonly type = ContentSliderActions.LoadItems;

    constructor(public payload: { reset?: boolean }) {
    }
  }

  export class LoadMoreItems {
    static readonly type = ContentSliderActions.LoadMoreItems;
  }

  export class SearchItems {
    static readonly type = ContentSliderActions.SearchItems;

    constructor(public searchTerm: string) {
    }
  }

  export class SelectItem {
    static readonly type = ContentSliderActions.SelectItem;

    constructor(public item: ContentItem) {
    }
  }

  export class DeselectItem {
    static readonly type = ContentSliderActions.DeselectItem;

    constructor(public itemId: string) {
    }
  }

  export class ClearSelection {
    static readonly type = ContentSliderActions.ClearSelection;
  }

  export class SetLoading {
    static readonly type = ContentSliderActions.SetLoading;

    constructor(public isLoading: boolean) {
    }
  }

  export class SetError {
    static readonly type = ContentSliderActions.SetError;

    constructor(public error: string | null) {
    }
  }

  export class SetMaxSelections {
    static readonly type = ContentSliderActions.SetMaxSelections;

    constructor(public maxSelections: number) {
    }
  }
}
