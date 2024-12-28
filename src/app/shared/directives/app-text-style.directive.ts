import { Directive, ElementRef, input, Input, OnInit } from '@angular/core';


type textKey = 'title-large' | 'title' | 'subtitle' | 'body' | 'caption';
interface TextStyles {
  [key:string]: {
    fontSize: string;
    fontWeight: string;
    color: string;
    marginBottom?: string;
    lineHeight?: string;
  }
}

@Directive({
  selector: '[appAppTextStyle]',
  standalone: true,
  inputs: ['appTextStyle', 'customColor']
})
export class AppTextStyleDirective implements OnInit {
  @Input('appAppTextStyle') textType: textKey = 'body'; 
  @Input() customColor?: string;

  private readonly styles: TextStyles = {
    'title-large': {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2C3E50',
      marginBottom: '24px'
    },
    'title': {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#FFF',
    },
    'subtitle': {
      fontSize: '0.938rem',
      fontWeight: '500',
      color: '#FFF',
    },
    'body': {
      fontSize: '16px',
      fontWeight: '400',
      color: '#2C3E50',
      lineHeight: '1.5'
    },
    'caption': {
      fontSize: '0.75rem',
      fontWeight: '400',
      color: '#D6DDE6',
      lineHeight: '1.4'
    }
  };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyStyle();
  }

  private applyStyle() {
    const element = this.el.nativeElement;
    const styleConfig = this.styles[this.textType];

    Object.entries(styleConfig).forEach(([property, value]) => {
      element.style[property] = value;
    });

    if (this.customColor) {
      element.style.color = this.customColor;
    }

    // Estilos base
    element.style.fontFamily = "'Roboto', sans-serif";
    element.style.margin = '0';
  }
}
