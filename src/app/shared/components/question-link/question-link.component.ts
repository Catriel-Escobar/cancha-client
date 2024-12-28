import { Component, input } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { AppTextStyleDirective } from '../../directives/app-text-style.directive';

@Component({
  selector: 'app-question-link',
  imports: [AppTextStyleDirective,RouterModule],
  standalone:true,
  template: `
  <p [appAppTextStyle]="'caption'" >
    {{ textOne() }} <span class="pw-link" [routerLink]="link()" >  {{textTwo()}}</span></p>
  `,
  styleUrl: './question-link.component.scss'
})
export class QuestionLinkComponent {
 
  public textOne = input<string>('');
  public textTwo = input<string>('');
  public link = input<string>('');

}
