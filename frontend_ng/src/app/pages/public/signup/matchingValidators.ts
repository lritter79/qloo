import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.confirmPassword
    ? null
    : { PasswordNoMatch: true };
};

export const confirmEmailValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.email === control.value.confirmEmail
    ? null
    : { EmailNoMatch: true };
};
