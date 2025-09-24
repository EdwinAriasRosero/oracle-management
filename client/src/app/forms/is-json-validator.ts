import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isJsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    try {
      JSON.parse(value);
    } catch (e) {
      return { invalidJson: { value: control.value } };
    }

    return null;
  };
}
