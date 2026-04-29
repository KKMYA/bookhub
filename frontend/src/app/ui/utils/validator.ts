import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const stockValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const total = control.get('nbExemplaires')?.value;
  const dispo = control.get('nbExemplairesDisponibles')?.value;

  return total !== null && dispo !== null && dispo > total
    ? { stockInconsistent: true }
    : null;
};
