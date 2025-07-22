import { ComponentListItem } from '../../../component-list/interfaces/component.interface';
import {CardContent} from "../../../component-list/interfaces/card-content.interface";
import {ColorOption} from "../../../component-list/components/custom-color/custom-color.component";

export namespace ComponentActions {
  export class LoadComponents {
    static readonly type = '[Component] Load Components';

    constructor(public refresh: boolean = false) {
    }
  }

  export class AddComponent {
    static readonly type = '[Component] Add Component';

    constructor(public component: Omit<ComponentListItem, 'id' | 'createdAt' | 'updatedAt' | 'user'>) {
    }
  }

  export class UpdateComponent {
    static readonly type = '[Component] Update Component';

    constructor(public primaryId: string, public updates: Partial<ComponentListItem>) {
    }
  }

  export class ToggleComponent {
    static readonly type = '[Component] Toggle Enable/Disable Component';

    constructor(public primaryId: string, public updates: Partial<ComponentListItem>) {
    }
  }

  export class UpdateCardContent {
    static readonly type = '[Component] Update Card Content';

    constructor(public updates: Partial<CardContent>) {
    }
  }

  export class UpdateGlobalColors {
    static readonly type = '[Component] Update Global Colors to Card Content';

    constructor(public updates: Partial<ColorOption>) {
    }
  }

  export class ApplyGlobalColors {
    static readonly type = '[Component] Apply Global Colors to Card Contents';

    constructor(public updates: Partial<ColorOption>) {
    }
  }


  export class DeleteComponent {
    static readonly type = '[Component] Delete Component';

    constructor(public primaryId: string) {
    }
  }

  export class ReorderComponents {
    static readonly type = '[Component] Reorder Components';

    constructor(public fromIndex: number, public toIndex: number) {
    }
  }

  export class SaveOrderedComponents {
    static readonly type = '[Component] Save Reorder Components';

    constructor() {
    }
  }

  export class SearchComponents {
    static readonly type = '[Component] Search Components';

    constructor(public searchTerm: string) {
    }
  }

  export class LoadMoreComponents {
    static readonly type = '[Component] Load More Components';
  }
}
