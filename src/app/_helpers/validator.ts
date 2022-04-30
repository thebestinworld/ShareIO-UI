import { AbstractControl, ValidationErrors } from "@angular/forms";

export class PasswordValidator {
    static validate = (controlName: string, matchingControlName: string) => {
        return (control: AbstractControl): ValidationErrors | null => {
            const input = control.get(controlName);
            const matchingInput = control.get(matchingControlName);

            if (input === null || matchingInput === null) {
                return null;
            }

            if (matchingInput?.errors && !matchingInput.errors["matching"]) {
                return null;
            }

            if (input.value !== matchingInput.value) {
                matchingInput.setErrors({ matching: true });
                return ({ matching: true });
            } else {
                matchingInput.setErrors(null);
                return null;
            }
        };
    }
}