import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  computed,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { addIcons } from 'ionicons';
import {
  logoLinkedin,
  logoPinterest,
  logoTiktok,
  logoTwitch,
  logoWhatsapp,
  chatbubbles,
  paperPlane,
  shieldCheckmark,
  documentText,
  eyeOutline,
  checkmarkCircle,
  alertCircle, logoYoutube, mail, call, link, image
} from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';

import {
  FormConfig,
  FormField,
  FormData,
  FormSubmitEvent,
  FormType,
  FORM_TYPE_CONFIG
} from '../../interfaces/form-config.interface';
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-dynamic-form',
  standalone: false,
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() config!: FormConfig;
  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formReset = new EventEmitter<void>();

  form!: FormGroup;
  private destroy$ = new Subject<void>();

  // Signals for reactive state management
  currentFormType = signal<FormType>('linkedin');
  showPreview = signal<boolean>(true);
  formValues = signal<any>({});

  // Computed values for preview
  previewData = computed(() => {
    const formValue = this.formValues();
    const typeConfig = FORM_TYPE_CONFIG[this.currentFormType()];

    return {
      title: formValue.title || 'Sample Title',
      description: formValue.description || '',
      backgroundColor: formValue.backgroundColor || typeConfig.defaultColors.background,
      textColor: formValue.textColor || typeConfig.defaultColors.text,
      icon: typeConfig.icon,
      type: this.currentFormType(),
      licenseNumber: formValue.licenseNumber || '',
      email: formValue.email || '',
      phoneNumber: formValue.phoneNumber || '',
      imageUrl: formValue.imageUrl || '',
      link: formValue.link || ''
    };
  });

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private fb: FormBuilder, private platform: Platform) {
    // Register all required icons
    addIcons({
      'logo-linkedin': logoLinkedin,
      'logo-pinterest': logoPinterest,
      'logo-tiktok': logoTiktok,
      'logo-twitch': logoTwitch,
      'logo-whatsapp': logoWhatsapp,
      'logo-youtube': logoYoutube,
      'chatbubbles': chatbubbles,
      'paper-plane': paperPlane,
      'shield-checkmark': shieldCheckmark,
      'document-text': documentText,
      'mail': mail,
      'call': call,
      'link': link,
      'image': image,
      'eye-outline': eyeOutline,
      'checkmark-circle': checkmarkCircle,
      'alert-circle': alertCircle
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.setupFormValueChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    if (!this.config) return;

    this.currentFormType.set(this.config.formType);
    const typeConfig = FORM_TYPE_CONFIG[this.config.formType];
    const formControls: any = {};

    // Create form controls based on field configuration
    typeConfig.fields.forEach(field => {
      const validators = this.getValidators(field);
      const initialValue = this.getInitialValue(field);

      formControls[field.key] = [initialValue, validators];
    });

    this.form = this.fb.group(formControls);

    // Set initial values if in edit mode
    if (this.config.mode === 'edit' && this.config.initialData) {
      this.form.patchValue(this.config.initialData);
    }

    // Initialize form values signal
    this.formValues.set(this.form.value);
  }

  private setupFormValueChanges() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        // Update the signal to trigger computed recalculation
        this.formValues.set(values);
      });

    // Also set initial values
    this.formValues.set(this.form.value);
  }

  private getValidators(field: FormField) {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'url') {
      validators.push(Validators.pattern(/^https?:\/\/.+/));
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.type === 'tel') {
      validators.push(Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/));
    }

    return validators;
  }

  private getInitialValue(field: FormField): any {
    const typeConfig = FORM_TYPE_CONFIG[this.config.formType];

    if (field.type === 'color') {
      if (field.key === 'backgroundColor') {
        return typeConfig.defaultColors.background;
      }
      if (field.key === 'textColor') {
        return typeConfig.defaultColors.text;
      }
    }

    return '';
  }

  getFieldConfig(): FormField[] {
    const typeConfig = FORM_TYPE_CONFIG[this.currentFormType()];
    // Filter out fields that shouldn't be visible for certain types
    return typeConfig.fields.filter(field => {
      // For license forms, exclude link field if somehow it exists
      if (this.currentFormType() === 'license' && field.key === 'link') {
        return false;
      }
      // For license forms, exclude description field
      if (this.currentFormType() === 'license' && field.key === 'description') {
        return false;
      }
      return true;
    });
  }

  getFieldError(fieldKey: string): string | null {
    const field = this.form.get(fieldKey);
    if (!field || !field.errors || !field.touched) return null;

    if (field.errors['required']) {
      return 'This field is required';
    }
    if (field.errors['pattern']) {
      if (fieldKey === 'phoneNumber') {
        return 'Please enter a valid phone number';
      }
      return 'Please enter a valid URL';
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }

    return null;
  }

  isFieldValid(fieldKey: string): boolean {
    const field = this.form.get(fieldKey);
    return field ? field.valid && field.touched : false;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData: FormData = {
        type: this.currentFormType(),
        ...this.form.value
      };

      const typeConfig = FORM_TYPE_CONFIG[this.currentFormType()];

      this.formSubmit.emit({
        data: {
          ...formData,
          icon: typeConfig.icon
        },
        isValid: true
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });

      this.formSubmit.emit({
        data: this.form.value,
        isValid: false
      });
    }
  }

  onReset() {
    this.form.reset();
    this.initializeForm();
    this.formReset.emit();
  }

  // Utility methods for template
  getIconName(): string {
    return FORM_TYPE_CONFIG[this.currentFormType()].icon;
  }

  openYouTubeVideo(url: string): void {
    // For hybrid apps, open in external browser or YouTube app
    if (this.platform.is('ios') || this.platform.is('android')) {
      // Use Capacitor Browser plugin or InAppBrowser
      window.open(url, '_system');
    } else {
      // For web, can use modal with iframe or external window
      window.open(url, '_blank');
    }
  }

  getYouTubeThumbnail(url: string): string {
    const videoId = this.extractYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : 'assets/default-video-thumb.jpg';
  }

  private extractYouTubeVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
