import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BillingService } from '../billing.service';
import { PaymentMethod } from '../payment-method.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-add-credit-card',
  templateUrl: './add-credit-card.component.html',
  styleUrls: ['./add-credit-card.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule, IconModule]
})
export class AddCreditCardComponent implements OnInit {

  cardForm!: FormGroup;
  userId = 1; // Hardcoded user ID for now

  constructor(
    private fb: FormBuilder,
    private billingService: BillingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.cardForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const paymentMethod: PaymentMethod = {
        id: 0, // will be set by service
        userId: this.userId,
        type: 'credit-card',
        ...this.cardForm.value
      };
      this.billingService.addPaymentMethod(paymentMethod).subscribe(() => {
        this.router.navigate(['/billing']);
      });
    }
  }
}
