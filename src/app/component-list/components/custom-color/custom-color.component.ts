import {Component, input, OnInit, output, signal} from "@angular/core";
import {
  colorPaletteOutline,
  checkmarkCircle,
  refreshOutline,
  eyedropOutline
} from 'ionicons/icons';
import {addIcons} from "ionicons";

export interface ColorOption {
  name: string;
  value: string;
  textColor?: string;
}

@Component({
  selector: 'app-custom-color-item',
  templateUrl: './custom-color.component.html',
  styleUrls: ['./custom-color.component.scss'],
  standalone: false
})
export class CustomColorItemComponent implements OnInit {
  title = input<string>('Change Background Color');
  subtitle = input<string>('');

  // Output events
  colorChange = output<ColorOption>();
  applyColorChange  = output<ColorOption>();


  // Example predefined text colors (can reuse predefinedColors if desired)
  predefinedTextColors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    // ... add more as needed
  ];
  // Component state
  currentColor = signal<ColorOption>({name: 'Ocean Blue', value: '#2196f3', textColor: '#ffffff'});
  componentId = Math.random().toString(36).substr(2, 9);

  // Color options
  predefinedColors: ColorOption[] = [
    {name: 'Ocean Blue', value: '#667eea', textColor: '#ffffff'},
    {name: 'Sunset Orange', value: '#ff6b6b', textColor: '#ffffff'},
    {name: 'Forest Green', value: '#4caf50', textColor: '#ffffff'},
    {name: 'Royal Purple', value: '#9c27b0', textColor: '#ffffff'},
    {name: 'Fire Red', value: '#f44336', textColor: '#ffffff'},
    {name: 'Sky Blue', value: '#2196f3', textColor: '#ffffff'},
    {name: 'Emerald', value: '#00bcd4', textColor: '#ffffff'},
    {name: 'Amber', value: '#ffc107', textColor: '#000000'},
    {name: 'Deep Orange', value: '#ff5722', textColor: '#ffffff'},
    {name: 'Teal', value: '#009688', textColor: '#ffffff'},
    {name: 'Indigo', value: '#3f51b5', textColor: '#ffffff'},
    {name: 'Pink', value: '#e91e63', textColor: '#ffffff'}
  ];

  // Add these properties to your component class
  customColor: string = '#3880ff'; // Default color
  customTextColor: string = '#ffffff'; // Default text color
  currentTextColor: string = '#ffffff'; // The currently applied text color
  recentColors: Array<{name: string, value: string, textColor?: string}> = [];
  private maxRecentColors = 8;

  constructor() {
    addIcons({
      colorPaletteOutline,
      checkmarkCircle,
      refreshOutline,
      eyedropOutline
    });
  }

  ngOnInit(): void {
    // Your existing initialization code...

    // Load recent colors
    this.loadRecentColors();

    // Set initial custom color to current color
    this.customColor = this.currentColor().value;
    // @ts-ignore
    this.customTextColor = this.currentColor().textColor;
  }

  applyColor() {
    this.applyColorChange.emit({
      name: 'custom',
      value: this.getBackground(),
      textColor: this.getButtonTextColor()
    });
  }

  selectColor(color: ColorOption) {
    this.currentColor.set(color);
    this.colorChange.emit(color);
  }

  generateRandomColor() {
    const randomColor = this.getRandomHexColor();
    const textColor = this.getContrastColor(randomColor);
    const randomColorOption: ColorOption = {
      name: 'Random Color',
      value: randomColor,
      textColor: textColor
    };
    this.selectColor(randomColorOption);
  }

  private getRandomHexColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getContrastColor(backgroundColor: string): string {
    // Handle gradient backgrounds
    if (backgroundColor.includes('gradient')) {
      return '#ffffff';
    }

    // Remove # if present
    const color = backgroundColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  getButtonBackground(): string {
    const current = this.currentColor();
    if (current.value.includes('gradient')) {
      return 'rgba(255, 255, 255, 0.2)';
    }
    return 'rgba(255, 255, 255, 0.2)';
  }

  getBackground(): string {
    return this.currentColor().value;
  }

  getButtonTextColor(): string {
    return this.currentColor().textColor || '#ffffff';
  }

  onCustomColorChange(color: string): void {
    this.customColor = color;
  }

// Method to select and use the custom color
  selectCustomColor(): void {
    if (!this.customColor) return;

    const customColorObj = {
      name: 'Custom',
      value: this.customColor,
      textColor: this.customTextColor,
      // textColor: this.getContrastColor(this.customColor)
    };

    this.selectColor(customColorObj);
    this.addToRecentColors(customColorObj);
  }

  private addToRecentColors(color: {name: string, value: string, textColor?: string}): void {
    // Remove if already exists
    this.recentColors = this.recentColors.filter(c => c.value !== color.value);

    // Add to beginning
    this.recentColors.unshift(color);

    // Keep only max recent colors
    if (this.recentColors.length > this.maxRecentColors) {
      this.recentColors = this.recentColors.slice(0, this.maxRecentColors);
    }

    // Save to localStorage if available
    try {
      localStorage.setItem(`recentColors_${this.componentId}`, JSON.stringify(this.recentColors));
    } catch (e) {
      // Handle localStorage errors silently
    }
  }

  // Handler for custom text color input
  onCustomTextColorChange(hex: string) {
    this.customTextColor = hex;
    const color = this.currentColor();
    color.textColor = this.customTextColor;
    this.currentColor.set(color);
    this.colorChange.emit(color);
  }

  // Handler for selecting custom text color
  selectCustomTextColor() {
    this.currentTextColor = this.customTextColor;
    // this.popoverController.dismiss();
  }

  // Handler for selecting predefined text color
  selectTextColor(color: any) {
    this.currentTextColor = color.value;
    const currentColor = this.currentColor();
    currentColor.textColor = this.customTextColor;
    this.currentColor.set(currentColor);
    this.colorChange.emit(currentColor);
    // Optionally close the popover here
    // this.popoverController.dismiss();
  }

  // Handler for generating random text color
  generateRandomTextColor() {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.customTextColor = randomHex; // Update custom color input
    this.currentTextColor = randomHex; // Apply to text
    const currentColor = this.currentColor();
    currentColor.textColor = this.customTextColor;
    this.currentColor.set(currentColor);
    this.colorChange.emit(currentColor);
    // Optionally close the popover here
    // this.popoverController.dismiss();
  }

// Method to load recent colors from storage
  private loadRecentColors(): void {
    try {
      const saved = localStorage.getItem(`recentColors_${this.componentId}`);
      if (saved) {
        this.recentColors = JSON.parse(saved);
      }
    } catch (e) {
      // Handle localStorage errors silently
      this.recentColors = [];
    }
  }

// Utility method to convert hex to RGB
  getRgbFromHex(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'Invalid color';

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

}
