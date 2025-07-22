import {FormType} from "./form-config.interface";

export interface ComponentListItem {
  id?: string;
  primaryId: string;
  order: number;
  type: FormType;
  title: string;
  description?: string;
  valueOrMeta?: string;
  backgroundColor: string;
  textColor: string;
  enabled: boolean;
  icon: string;
}

