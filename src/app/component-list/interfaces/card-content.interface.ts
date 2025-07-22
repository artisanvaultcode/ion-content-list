import {FormType} from "./form-config.interface";

export interface ICardContent {
  primaryId: string;
  order: number;
  type: FormType;
  title: string;
  description?: string;
  backgroundColor: string;
  textColor: string;
  valueOrMeta: string;
  enabled: boolean;
  icon: string;
  meta?: any;
}

export interface IAddCardContent {
  order: number;
  cardId: string;
  userId: string;
  contentTypeId: string;
  content: ICardContent;
}

export interface CardContent {
  primaryId: string;
  order: number;
  cardId: string;
  userId: string;
  contentTypeId: string;
  content: ICardContent;
  meta?: any;
  enabled: boolean;
}

export interface OrderCardContent {
  primaryId: string;
  order: number;
}
