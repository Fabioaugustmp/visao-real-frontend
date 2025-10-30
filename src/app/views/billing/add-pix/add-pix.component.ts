import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BillingService } from '../billing.service';
import { PaymentMethod } from '../payment-method.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-add-pix',
  templateUrl: './add-pix.component.html',
  styleUrls: ['./add-pix.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class AddPixComponent implements OnInit {

  pixForm!: FormGroup;
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
    this.pixForm = this.fb.group({
      pixKey: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.pixForm.valid) {
      const paymentMethod: PaymentMethod = {
        id: 0, // will be set by service
        userId: this.userId,
        type: 'pix',
        ...this.pixForm.value
      };
      this.billingService.addPaymentMethod(paymentMethod).subscribe(() => {
        this.router.navigate(['/billing']);
      });
    }
  }
}
