import { FormControl, ValidationErrors } from '@angular/forms';

export class ShopValidators {
  //white space vaidation
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors {
    //check if string only contains white space
    if (control.value != null && control.value.trim().length === 0) {
      //invalid, return error object
      return { notOnlyWhiteSpace: true };
    } else {
      //valid, return null
      return null;
    }
  }
}
