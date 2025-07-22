import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormConfig, FormData, FormSubmitEvent} from "../../interfaces/form-config.interface";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-edit-content',
  templateUrl: 'edit-content.page.html',
  styleUrls: ['edit-content.page.scss'],
  standalone: false
})
export class EditContentPage implements OnInit {
  @Input() configType: any;
  @Input() contentCard: any;
  currentConfig!: FormConfig;
  lastSubmission: FormData | null = null;
  private _cd: ChangeDetectorRef;

  constructor(cd: ChangeDetectorRef,
              private modalCtrl: ModalController,) {
    this._cd = cd;
  }


  ngOnInit() {
    this.currentConfig = {
      formType: this.configType.type,
      mode: 'edit',
      fields: [], // Fields will be loaded from FORM_TYPE_CONFIG
      initialData: this.configType
    };
    this._cd.detectChanges();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async onFormSubmit(event: FormSubmitEvent) {
    if (!event.isValid) {
      return;
    }
    this.lastSubmission = event.data;

    this.contentCard = {
      ...this.contentCard,
      content: { ...this.contentCard.content, ...event.data }
    };

    // console.log(':::', this.contentCard)
    // console.log('-->', event.data);

    // @ts-ignore
    const resultSpecificValue = {
      license: { valueOrMeta: this.contentCard.content.licenseNumber },
      email: { valueOrMeta: this.contentCard.content.email },
      image: { valueOrMeta: this.contentCard.content.imageUrl },
      phone: { valueOrMeta: this.contentCard.content.phoneNumber },
      youtube: { valueOrMeta: this.contentCard.content.link },
      whatsApp: { valueOrMeta: this.contentCard.content.link }
    }[this.contentCard.content.type] || { valueOrMeta: this.contentCard.content.link };

    this.contentCard.content.valueOrMeta = resultSpecificValue.valueOrMeta;
    await this.modalCtrl.dismiss(this.contentCard, 'save');
  }

  onFormReset() {
    this.lastSubmission = null;
  }

  getFormTitle(): string {
    return  this.currentConfig.formType.charAt(0).toUpperCase() +this.currentConfig.formType.slice(1);
  }
}
