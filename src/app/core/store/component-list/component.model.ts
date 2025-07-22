import {CardContent} from "../../../component-list/interfaces/card-content.interface";

export interface ComponentList {
  components: CardContent[];
  meta: any;
  data: any;
  loading: boolean;
  error: any;
  maxComponents: number;
  searchTerm: string;
  hasMore: boolean;
  currentPage: number;
  validationErrors: any;
  itemsPerPage: number;
  totalItems: number;
}
