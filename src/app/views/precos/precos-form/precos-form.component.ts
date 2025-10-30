import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrecoService } from '../preco.service';
import { Preco } from '../preco.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-precos-form',
  templateUrl: './precos-form.component.html',
  styleUrls: ['./precos-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class PrecosFormComponent implements OnInit {

  precoForm!: FormGroup;
  isEditMode = false;
  precoId!: number;

  constructor(
    private fb: FormBuilder,
    private precoService: PrecoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.precoForm = this.fb.group({
      id_item: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.precoId = +params['id'];
        this.precoService.getPreco(this.precoId).subscribe(preco => {
          this.precoForm.patchValue(preco);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.precoForm.valid) {
      const precoData: Preco = this.precoForm.value;
      if (this.isEditMode) {
        precoData.id = this.precoId;
        this.precoService.updatePreco(precoData).subscribe(() => {
          this.router.navigate(['/precos']);
        });
      } else {
        this.precoService.createPreco(precoData).subscribe(() => {
          this.router.navigate(['/precos']);
        });
      }
    }
  }
}
