import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  Self,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * @description
 * Interfaz para el patrón Memento
 */
interface Memento {
  value: string;
}
/**
 * @description
 * Clase que gestiona el historial de cambios
 * para las acciones de deshacer y rehacer
 * en un input de texto.
 */
class HistoryManager {
  /**
   * @description
   * Historial de cambios para deshacer
   */
  private historyZ: Memento[] = [];
  /**
   * @description
   * Historial de cambios para rehacer
   */
  private historyY: Memento[] = [];

  /**
   * @description
   * Historial de cambios para deshacer
   */
  saveStateForUndo(value: string) {
    const memento: Memento = { value };
    this.historyZ.push(memento);
  }

  /**
   * @description
   * Undoes the last change made to the input value.
   * Returns the previous value if there is one, otherwise returns null.
   * @returns The previous value or null.
   */
  undo(): string | null {
    const historySize = this.historyZ.length;
    if (historySize > 1) {
      const lastValueZ = this.historyZ?.pop();
      this.historyY.push(lastValueZ as Memento);
      return this.historyZ[historySize - 2].value;
    } else {
      return null;
    }
  }

  /**
   * @description
   * Reverts the last change made to the input value and returns the previous value.
   * If there are no more changes to revert, returns null.
   *
   * @returns The previous value of the input, or null if there are no more changes to revert.
   */
  redo(): string | null {
    const postState = this.historyY.pop();
    if (postState) {
      this.historyZ.push(postState);
      return postState.value;
    } else {
      return null;
    }
  }
}
/**
 * Represents the different types of formatting cases for a string.
 */
enum FormatCaseTypeAlias {
  /**
   * Leaves the text as is.
   */
  Default = 'default',

  /**
   * Converts the text to uppercase.
   */
  Upper = 'upper',

  /**
   * Converts the text to lowercase.
   */
  Lower = 'lower',

  /**
   * Converts the text to camel case.
   */
  Camel = 'camel',

  /**
   * Converts the text to pascal case.
   */
  Pascal = 'pascal',

  /**
   * Converts the text to snake case.
   */
  Snake = 'snake',

  /**
   * Removes spaces from the text.
   */
  NoSpaces = 'nospaces',

  /**
   * Removes special characters from the text.
   */
  Alphanumeric = 'alphanumeric',

  /**
   * Removes special characters from the text, leaving only letters.
   */
  OnlyLetters = 'onlyletters',

  /**
   * Removes special characters from the text, leaving only letters and spaces.
   */
  OnlyLettersAndSpaces = 'onlylettersandspaces',

  /**
   * Converts the text to kebab case.
   */
  Kebab = 'kebab',

  /**
   * Joins the text without any formatting.
   */
  Join = 'join',
}
/**
 * Represents the different formatting case types.
 */
type FormatCaseType =
  | 'default'
  | 'upper'
  | 'lower'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'nospaces'
  | 'alphanumeric'
  | 'onlyletters'
  | 'onlylettersandspaces'
  | 'kebab'
  | 'join';
/**
 * @description
 * This directive is used to convert the input field value based on the case type.
 *
 * @example <caption>Basic usage</caption>
 * ```html
 * <input type="text" toUppercase />
 * ```
 * @example <caption>With mat-form-field</caption>
 * ```html
 * <mat-form-field>
 *  <mat-label>Label</mat-label>
 *  <input matInput type="text" toUppercase />
 * </mat-form-field>
 * ```
 * @example <caption>With reactive forms</caption>
 * ```html
 * <mat-form-field>
 *  <mat-label>Label</mat-label>
 *  <input matInput type="text" formControlName="name" toUppercase />
 * </mat-form-field>
 * ```
 * @example <caption>With template driven forms</caption>
 * ```html
 * <mat-form-field>
 *  <mat-label>Label</mat-label>
 *  <input matInput type="text" [(ngModel)]="name" name="name" toUppercase />
 * </mat-form-field>
 * ```
 * @example
 * ```html
 * <input toFormatCase="upper" />
 * ```
 * @example
 * ```html
 * <input toFormatCase="lower" />
 * ```
 * @example
 * ```html
 * <input toFormatCase="camel" ignoredCharacters="!@#$%" />
 * ```
 * @example
 * ```html
 * <input toFormatCase="join" joinedFormats="upper,nospaces" />
 * ```
 * @default 'default'
 * @class FormatCaseInputDirective
 * @version 1.0.0
 */
@Directive({
  selector: 'input[toFormatCase]',
  exportAs: 'toFormatCase',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormatCaseInputDirective),
      multi: true,
    },
  ],
})
export class FormatCaseInputDirective implements ControlValueAccessor, DoCheck {
  /**
   * @description
   * This input property is used to set the format case of the input field.
   * @param value The value to be updated. The value should be one of the following values:
   * @see FormatCaseTypeAlias
   * - 'upper' - Converts the text to uppercase.
   * - 'lower' - Converts the text to lowercase.
   * - 'camel' - Converts the text to camel case.
   * - 'pascal' - Converts the text to pascal case.
   * - 'snake' - Converts the text to snake case.
   * - 'nospaces' - Removes spaces from the text.
   * - 'nospecialcharacters' - Removes special characters from the text.
   * @example
   * ```html
   * <input toFormatCase="lower" />
   * ```
   * @default 'default'
   */
  @Input('toFormatCase')
  public get formatCase(): FormatCaseType {
    return this.formatCaseValue;
  }
  public set formatCase(value: FormatCaseType) {
    this.formatCaseValue = (value?.toLowerCase()?.trim() ||
      'default') as FormatCaseType;
  }

  /**
   * @description
   * This input property is used to set the format case of the input field.
   * @example
   * ```html
   * <input joinedFormats="upper,nospaces" />
   * ```
   * @default [default]
   */
  @Input()
  public get joinedFormats(): FormatCaseType[] {
    return this.joinedFormatValue;
  }
  public set joinedFormats(value: string) {
    this.joinedFormatValue = (value
      ?.split(',')
      .map((value) => value?.toLowerCase()?.trim()) || []) as FormatCaseType[];
  }

  private joinedFormatValue: FormatCaseType[] = ['default'];

  /**
   * @description
   * This input property is used to set the characters to be ignored while formatting the text.
   * @example
   * ```html
   * <input toFormatCase="upper" ignoredCharacters="!@#$%aE" />
   * ```
   * @default ''
   */
  @Input()
  public ignoredCharacters: string = '';

  /**
   * @description
   * This output property is used to emit the paste event of the input field.
   * @example
   * ```html
   * <input (pasteContent)="myFunction($event)" />
   * ```
   */
  @Output()
  pasteContent: EventEmitter<ClipboardEvent> =
    new EventEmitter<ClipboardEvent>();

  /**
   * @description
   * This input property is used to set the format case of the input field.
   * @default
   * 'default'
   * withing modify the value of the input field.
   * @private
   */
  private formatCaseValue: FormatCaseType = FormatCaseTypeAlias.Default;

  /**
   * @description
   * This property is used to manage the active state of the blur event.
   * @private
   */
  private activeBlur: boolean = false;

  /**
   * @description
   * This property is used to manage the active state of the focus event.
   * @private
   */
  private activeFocus: boolean = false;

  /**
   * @description
   * This property is used to store the last value of the input field.
   * @private
   */
  private lastValue: string = '';

  /**
   * @description
   * This property is used to manage the history of changes for undo and redo.
   * @private
   */
  private historyManager = new HistoryManager();
  /**
   * @description
   * This method is used to update the value of the input field.
   * @param value The value to be updated.
   * implements ControlValueAccessorInterface
   */
  onChange!: (_: any) => void;
  /**
   * @description
   * onTouched method is used to update the touched state of the input field.
   * implements ControlValueAccessorInterface
   */
  onTouched!: () => void;

  constructor(
    @Self() private el: ElementRef,
    private renderer: Renderer2,
    private _cdr: ChangeDetectorRef
  ) {}
  ngDoCheck(): void {
    const currentValue = this.el.nativeElement.value;
    if (this.lastValue !== currentValue) {
      const transformedValue = this.transformAndWriteValue(
        this.el.nativeElement.value
      );
      this.lastValue = transformedValue;
    }
  }

  /**
   * @description
   * This method is used to call the onChange method with the updated value.
   * @param value The value to be updated.
   * @private
   */
  callOnChange(value: string) {
    this.onChange && this.onChange(value);
  }

  /**
   * @description
   * This method is used to update the selection of the input field.
   * It sets the selection start and end to the given start position.
   * This method is used to maintain the cursor position while typing.
   * @private
   * @param start - The start position of the selection
   */
  private updateSelection(start: number) {
    this.renderer.setProperty(this.el.nativeElement, 'selectionStart', start);
    this.renderer.setProperty(this.el.nativeElement, 'selectionEnd', start);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const start = this.el.nativeElement.selectionStart;
    const transformedValue = this.transformAndWriteValue(value);
    this.lastValue = transformedValue;
    this.updateSelection(start);
    this.callOnChange(transformedValue);
    this.historyManager.saveStateForUndo(transformedValue);
  }

  /**
   * Transforms the input value based on the specified format case and writes the transformed value.
   *
   * @param value - The input value to be transformed.
   * @returns The transformed value.
   */
  private transformAndWriteValue(value: string): string {
    const transformedValue = this.transformText(value, this.formatCase);
    this.writeValue(transformedValue);
    return transformedValue;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event?.ctrlKey) {
      const specialKeys: string[] = ['z', 'y', 'a', 'backspace', 'delete'];
      const lowerCaseKey = event.key?.toLowerCase();
      if (specialKeys.includes(lowerCaseKey)) {
        event.preventDefault();
        if (lowerCaseKey === 'z') {
          const previousState = this.historyManager.undo();
          this.writeValue(previousState);
          this.callOnChange(previousState);
        } else if (lowerCaseKey === 'y') {
          const nextState = this.historyManager.redo();
          if (nextState !== null) {
            this.writeValue(nextState);
            this.callOnChange(nextState);
          }
        } else if (lowerCaseKey === 'a') {
          this.selectAll();
        } else if (lowerCaseKey === 'backspace' || lowerCaseKey === 'delete') {
          this.handleCtrlBackspace();
        }
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.activeBlur = true;
    this.activeFocus = false;
    if (this.isMatInput) {
      this.onTouched();
    }
  }

  @HostListener('focus', ['$event'])
  onFocus() {
    this.activeBlur = false;
    this.activeFocus = true;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    const transformedText = this.transformAndWriteValue(pastedText);

    const modifiedEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed,
    });
    modifiedEvent.clipboardData.setData('text', transformedText);

    this.pasteContent.emit(modifiedEvent);
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: any): void {
    this.renderer.setProperty(this.el.nativeElement, 'value', value);
    this._cdr.markForCheck();
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

  /**
   * @description
   * This method is used to check if the input field is a mat input field.
   * @private
   * @returns boolean
   */
  get isMatInput(): boolean {
    return this.el.nativeElement.classList.contains('mat-mdc-input-element');
  }

  /**
   * Selects all text in the input field.
   * @private
   */
  private selectAll(): void {
    this.el?.nativeElement?.select();
  }

  /**
   * @description
   * This method is used to handle the ctrl + backspace key combination.
   * It deletes the word to the left of the cursor if there is no selection.
   * If there is a selection, it deletes the selected text.
   * @private
   */
  private handleCtrlBackspace(): void {
    const start = this.el.nativeElement.selectionStart;
    const end = this.el.nativeElement.selectionEnd;

    // Si hay una selección, eliminar la selección
    if (start !== end) {
      const currentValue = this.el.nativeElement.value;
      const newValue = currentValue.slice(0, start) + currentValue.slice(end);
      this.writeValue(newValue);
      this.updateSelection(start);
      this.historyManager.saveStateForUndo(newValue);
    } else {
      // Si no hay selección, eliminar la palabra a la izquierda del cursor
      const currentValue = this.el.nativeElement.value;
      const wordStart = this.findWordStart(currentValue, start);
      const newValue =
        currentValue.slice(0, wordStart) + currentValue.slice(start);
      this.writeValue(newValue);
      this.updateSelection(wordStart);
      this.historyManager.saveStateForUndo(newValue);
    }
  }

  /**
   * @description
   * This method is used to find the start of the word before the given position.
   * @param text - Text to find the word start
   * @param position - Position to find the word start
   * @returns - Start of the word
   * @private
   */
  private findWordStart(text: string, position: number): number {
    let start = position - 1;
    while (start >= 0 && /\S/.test(text[start])) {
      start--;
    }
    return start + 1;
  }

  /**
   * @description
   * This method is used to transform the text based on the case type.
   * @param text - Text to be transformed
   * @param caseType - Case type to be transformed
   * @returns - Transformed text
   * @private
   */
  private transformText(text: string, caseType: string): string {
    text = this.cleanText(text, this.ignoredCharacters);
    let textTransformed = '';
    switch (caseType) {
      case FormatCaseTypeAlias.Upper:
        textTransformed = text.toUpperCase();
        break;
      case FormatCaseTypeAlias.Lower:
        textTransformed = text.toLowerCase();
        break;
      case FormatCaseTypeAlias.Camel:
        textTransformed = this.removeDiacritics(text);
        textTransformed = this.toCamelCase(textTransformed);
        break;
      case FormatCaseTypeAlias.Pascal:
        textTransformed = this.removeDiacritics(text);
        textTransformed = this.toPascalCase(textTransformed);
        break;
      case FormatCaseTypeAlias.Snake:
        textTransformed = this.removeDiacritics(text);
        textTransformed = this.toSnakeCase(textTransformed);
        break;
      case FormatCaseTypeAlias.NoSpaces:
        textTransformed = this.toNoSpaces(text);
        break;
      case FormatCaseTypeAlias.Alphanumeric:
        textTransformed = this.toAlphanumeric(text);
        break;
      case FormatCaseTypeAlias.OnlyLetters:
        textTransformed = this.toOnlyLetters(text);
        break;
      case FormatCaseTypeAlias.OnlyLettersAndSpaces:
        textTransformed = this.toOnlyLettersAndSpaces(text);
        break;
      case FormatCaseTypeAlias.Kebab:
        textTransformed = this.removeDiacritics(text);
        textTransformed = this.toKebabCase(textTransformed);
        break;
      case FormatCaseTypeAlias.Join:
        textTransformed = text;
        this.joinedFormats.forEach((format) => {
          if (format !== FormatCaseTypeAlias.Join) {
            textTransformed = this.transformText(textTransformed, format);
          }
        });
        break;
      case FormatCaseTypeAlias.Default:
        textTransformed = text;
        break;
      default:
        textTransformed = text;
        break;
    }
    return this.cleanText(textTransformed, this.ignoredCharacters);
  }

  /**
   * @description
   * This method is used to convert text to camel case.
   * @param text - Text to be converted to camel case
   * @returns - Text in camel case
   * @private
   */
  private toCamelCase(text: string): string {
    // quitar todo caracter especial
    const newWord = text.replace(/[^a-zA-Z0-9]+/g, ' ');
    const words = newWord.trim().split(/\s+/);
    let camelCaseText = '';
    words.forEach((word, index) => {
      if (index === 0) {
        camelCaseText += word.charAt(0).toLowerCase() + word.slice(1);
      } else {
        camelCaseText +=
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });
    camelCaseText = text.endsWith(' ')
      ? camelCaseText.trim() + ' '
      : camelCaseText;

    return camelCaseText;
  }

  /**
   * @description
   * This method is used to convert text to pascal case.
   * @param text - Text to be converted to pascal case
   * @returns - Text in pascal case
   * @private
   */
  private toPascalCase(text: string): string {
    const newWord = text.replace(/[^a-zA-Z0-9]+/g, ' ');
    const words = newWord.trim().split(/\s+/);
    let PascalCaseText = '';
    words.forEach((word, index) => {
      if (index === 0) {
        PascalCaseText += word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        PascalCaseText +=
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });
    PascalCaseText = text.endsWith(' ')
      ? PascalCaseText.trim() + ' '
      : PascalCaseText;

    return PascalCaseText;
  }

  /**
   * @description
   * This method is used to convert text to snake case.
   * @param text - Text to be converted to snake case
   * @returns - Text in snake case
   * @private
   */
  private toSnakeCase(text: string): string {
    let textTransformed = text.trim();
    textTransformed += text.length > 1 && text.endsWith(' ') ? ' ' : '';

    textTransformed = textTransformed.replace(/[^a-zA-Z0-9]+/g, '_');
    // Asegurarse de que no comience ni termine con guión bajo
    if (this.activeBlur || !this.activeFocus) {
      textTransformed = textTransformed.replace(/^_+|_+$/g, '');
    }

    return textTransformed.toLowerCase().replace(/[\s_]+/g, '_');
  }

  /**
   * @description
   * This method is used to remove spaces from the text.
   * @param text - Text to be converted to snake case
   * @returns - Text without spaces
   * @private
   */
  private toNoSpaces(text: string): string {
    return text.replace(/\s+/g, '');
  }

  /**
   * @description
   * This method is used to remove special characters from the text, leaving only letters.
   * @param text = Text to be converted to only letters
   * @returns - Text with only letters
   */
  private toOnlyLetters(text: string): string {
    return text.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ]/g, '');
  }

  /**
   * @description
   * This method is used to remove special characters from the text, leaving only letters and spaces.
   * @param text - Text to be converted to only letters and spaces
   * @returns - Text with only letters and spaces
   */
  private toOnlyLettersAndSpaces(text: string): string {
    return text.replace(/[^a-zA-Z\sÀ-ÖØ-öø-ÿ]/g, '');
  }

  /**
   * @description
   * This method is used to remove special characters from the text, leaving only letters, numbers and spaces.
   * @param text - Text to be converted to only letters, numbers, acentos and spaces
   * @returns - Text with only letters, numbers and spaces
   */
  private toAlphanumeric(text: string): string {
    return text.replace(/[^a-zA-Z0-9\sÀ-ÖØ-öø-ÿ]/g, '');
  }

  /**
   * @description
   * This method is used to convert text to kebab case.
   * @param text - Text to be converted to kebab case
   * @returns - Text in kebab case
   * @private
   */
  private toKebabCase(text: string): string {
    let textTransformed = this.toSnakeCase(text);
    return textTransformed.replace(/_/g, '-');
  }

  /**
   * @description
   * This method is used to remove diacritics from the text.
   * @param text - Text to be cleaned
   * @returns - Cleaned text
   * @private
   */
  private removeDiacritics(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * @description
   * This method is used to remove the ignored characters from the text.
   * @param text - Text to be cleaned
   * @param ignoredCharacters - Characters to be ignored
   * @returns - Cleaned text
   * @private
   */
  private cleanText(text: string, ignoredCharacters: string): string {
    const regex = new RegExp(`[${ignoredCharacters}]`, 'g');
    return text.replace(regex, '');
  }
}
