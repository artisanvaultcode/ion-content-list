import {CardContent} from "./card-content.interface";

export interface ContentItem {
  primaryId: string;
  order: number;
  type: ContentType;
  title: string;
  description?: string;
  link?: string;
  licenseNumber?: string;
  backgroundColor: string;
  textColor: string;
  enabled: boolean;
  icon: string;
}

export interface PageMetaSlider {
 data: ContentItem[];
 meta: any;
}

export interface PageMetaComponent{
  data: CardContent[];
  meta: any;
}

export enum ContentType {
  ARTICLE = 'article',
  VIDEO = 'video',
  PODCAST = 'podcast',
  DOCUMENT = 'document',
  LINK = 'link',
  IMAGE = 'image',
  COURSE = 'course',
  WEBINAR = 'webinar'
}

export interface ContentSliderStateModel {
  items: ContentItem[];
  meta: any;
  filteredItems: ContentItem[];
  selectedItems: ContentItem[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  maxSelections: number;
  totalItems: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}
