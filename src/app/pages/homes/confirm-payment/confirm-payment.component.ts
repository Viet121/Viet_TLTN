import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent {
  hideRequiredControl = new FormControl(false);
  options = this._formBuilder.group({
    hideRequired: this.hideRequiredControl,
  });
  constructor(private _formBuilder: FormBuilder) {}
}
