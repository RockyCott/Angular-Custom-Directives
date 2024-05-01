import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { FormatCaseInputDirective } from '../../directives/format-case-input/format-case-input.directive';

@Component({
  selector: 'app-format-case-input',
  templateUrl: './format-case-input.component.html',
  styleUrl: './format-case-input.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormatCaseInputDirective,
  ],
})
export class FormatCaseInputComponent {
  text = new UntypedFormControl(
    'üna fr4sé de €jempl0 p4ra l@ direc*tiva #toFörm@tCase1ñpu7!'
  );

  // this method exists because the directive had supplant the paste event
  pasteContent(event: any) {
    console.log(event.clipboardData.getData('text'));
  }
}
