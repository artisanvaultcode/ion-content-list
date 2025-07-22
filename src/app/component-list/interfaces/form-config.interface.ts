export interface FormConfig {
  fields: FormField[];
  mode: 'create' | 'edit';
  initialData?: any;
  formType: FormType;
}

export interface FormField {
  key: string;
  type: 'text' | 'textarea' | 'color' | 'url' | 'email' | 'tel' | 'file';
  label: string;
  required?: boolean;
  validation?: any;
  placeholder?: string;
  visible?: boolean;
}

export type FormType = 'linkedin'
  | 'pinterest'
  | 'tiktok'
  | 'twitch'
  | 'whatsApp'
  | 'messenger'
  | 'telegram'
  | 'signal'
  | 'license'
  | 'email'
  | 'phone'
  | 'youtube'
  | 'link'
  | 'image';

export interface FormData {
  type: FormType;
  title: string;
  description?: string;
  valueOrMeta?: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
  enabled: boolean;
  primaryId?: string;
  id?: string;
}

export interface FormSubmitEvent {
  data: FormData;
  isValid: boolean;
}

// form-type.config.ts
export const FORM_TYPE_CONFIG: Record<FormType, {
  icon: string;
  fields: FormField[];
  defaultColors: { background: string; text: string };
}> = {
  linkedin: {
    icon: 'logo-linkedin',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter LinkedIn title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'LinkedIn URL', required: true, placeholder: 'https://linkedin.com/in/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#0077B5', text: '#FFFFFF' }
  },
  pinterest: {
    icon: 'logo-pinterest',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter Pinterest title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'Pinterest URL', required: true, placeholder: 'https://pinterest.com/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#BD081C', text: '#FFFFFF' }
  },
  tiktok: {
    icon: 'logo-tiktok',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter TikTok title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'TikTok URL', required: true, placeholder: 'https://tiktok.com/@...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#000000', text: '#FFFFFF' }
  },
  twitch: {
    icon: 'logo-twitch',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter Twitch title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'Twitch URL', required: true, placeholder: 'https://twitch.tv/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#9146FF', text: '#FFFFFF' }
  },
  whatsApp: {
    icon: 'logo-whatsapp',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter WhatsApp title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'WhatsApp URL', required: true, placeholder: 'https://wa.me/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#25D366', text: '#FFFFFF' }
  },
  messenger: {
    icon: 'chatbubbles',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter Messenger title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'Messenger URL', required: true, placeholder: 'https://m.me/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#0084FF', text: '#FFFFFF' }
  },
  telegram: {
    icon: 'paper-plane',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter Telegram title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'Telegram URL', required: true, placeholder: 'https://t.me/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#0088CC', text: '#FFFFFF' }
  },
  signal: {
    icon: 'shield-checkmark',
    fields: [
      { key: 'title', type: 'text', label: 'Title', required: true, placeholder: 'Enter Signal title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'Signal URL', required: true, placeholder: 'https://signal.me/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#3A76F0', text: '#FFFFFF' }
  },
  license: {
    icon: 'document-text',
    fields: [
      { key: 'title', type: 'text', label: 'License Title', required: true, placeholder: 'Enter license title' },
      { key: 'licenseNumber', type: 'text', label: 'License Number', required: true, placeholder: 'Enter license number' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#6C757D', text: '#FFFFFF' }
  },
  email: {
    icon: 'mail',
    fields: [
      { key: 'title', type: 'text', label: 'Email Title', required: true, placeholder: 'Enter email title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'example@email.com' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#EA4335', text: '#FFFFFF' }
  },
  phone: {
    icon: 'call',
    fields: [
      { key: 'title', type: 'text', label: 'Phone Title', required: true, placeholder: 'Enter phone title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true, placeholder: '+1 (555) 123-4567' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#34A853', text: '#FFFFFF' }
  },
  youtube: {
    icon: 'logo-youtube',
    fields: [
      { key: 'title', type: 'text', label: 'YouTube Title', required: true, placeholder: 'Enter YouTube title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'YouTube URL', required: true, placeholder: 'https://youtube.com/...' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#FF0000', text: '#FFFFFF' }
  },
  link: {
    icon: 'link',
    fields: [
      { key: 'title', type: 'text', label: 'Link Title', required: true, placeholder: 'Enter link title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'link', type: 'url', label: 'URL', required: true, placeholder: 'https://example.com' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#007BFF', text: '#FFFFFF' }
  },
  image: {
    icon: 'image',
    fields: [
      { key: 'title', type: 'text', label: 'Image Title', required: true, placeholder: 'Enter image title' },
      { key: 'description', type: 'textarea', label: 'Description', required: false, placeholder: 'Enter description' },
      { key: 'imageUrl', type: 'url', label: 'Image URL', required: true, placeholder: 'https://example.com/image.jpg' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color', required: true },
      { key: 'textColor', type: 'color', label: 'Text Color', required: true }
    ],
    defaultColors: { background: '#6F42C1', text: '#FFFFFF' }
  }
};
