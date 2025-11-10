import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormaPagamentoService } from '../forma-pagamento.service';
import { FormaPagamento, NomeFormaPagamento } from '../forma-pagamento.model';
import { Parcelamento } from '../../parcelamentos/parcelamento.model';
import { ParcelamentoService } from '../../parcelamentos/parcelamento.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-formas-pagamento-form',
  templateUrl: './formas-pagamento-form.component.html',
  styleUrls: ['./formas-pagamento-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule
  ]
})
export class FormasPagamentoFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  formaPagamentoId: number | null = null;
  nomeFormaPagamentoKeys: (keyof typeof NomeFormaPagamento)[];
  NomeFormaPagamento = NomeFormaPagamento; // Make enum available in template
  parcelamentos: Parcelamento[] = [];

  constructor(
    private fb: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private parcelamentoService: ParcelamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nomeFormaPagamentoKeys = Object.keys(NomeFormaPagamento) as (keyof typeof NomeFormaPagamento)[];
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required], // New field
      descricao: ['', Validators.required],
      idParcelamento: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadParcelamentos();
    this.formaPagamentoId = this.route.snapshot.params['id'];
    if (this.formaPagamentoId) {
      this.isEditMode = true;
      this.formaPagamentoService.getFormaPagamento(this.formaPagamentoId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  loadParcelamentos(): void {
    this.parcelamentoService.getParcelamentos().subscribe(data => {
      this.parcelamentos = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formaPagamento: FormaPagamento = this.form.value;
      if (this.isEditMode) {
        this.formaPagamentoService.updateFormaPagamento(formaPagamento).subscribe(() => {
          this.router.navigate(['/formas-pagamento']);
        });
      } else {
        this.formaPagamentoService.createFormaPagamento(formaPagamento).subscribe(() => {
          this.router.navigate(['/formas-pagamento']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/formas-pagamento']);
  }
}
