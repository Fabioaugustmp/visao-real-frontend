import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FinanceiroService } from '../financeiro.service';
import { Financeiro } from '../financeiro.model';
import { Ticket } from '../../tickets/ticket.model';
import { TicketService } from '../../tickets/ticket.service';
import { Medico } from '../../medicos/medico.model';
import { MedicoService } from '../../medicos/medico.service';
import { TarifarioMedicoHistorico } from '../tarifario-medico-historico.model';
import { TarifarioMedicoHistoricoService } from '../tarifario-medico-historico.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-financeiros-form',
  templateUrl: './financeiros-form.component.html',
  styleUrls: ['./financeiros-form.component.scss'],
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
export class FinanceirosFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  financeiroId: number | null = null;
  tickets: Ticket[] = [];
  medicos: Medico[] = [];
  tarifarios: TarifarioMedicoHistorico[] = [];

  constructor(
    private fb: FormBuilder,
    private financeiroService: FinanceiroService,
    private ticketService: TicketService,
    private medicoService: MedicoService,
    private tarifarioService: TarifarioMedicoHistoricoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      ticket: [null, Validators.required],
      medico: [null, Validators.required],
      totalParcelas: [null, Validators.required],
      parcela: [null, Validators.required],
      vencimentoData: [null, Validators.required],
      recebido: [false],
      recebidoData: [null],
      valor: [null, Validators.required],
      tarifarioMedicoHistorico: [null, Validators.required],
      percentualTarifaAplicado: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTickets();
    this.loadMedicos();
    this.loadTarifarios();
    this.financeiroId = this.route.snapshot.params['id'];
    if (this.financeiroId) {
      this.isEditMode = true;
      this.financeiroService.getFinanceiro(this.financeiroId).subscribe(data => {
        this.form.patchValue({
          ...data,
          ticket: data.ticket?.id,
          medico: data.medico.id,
          tarifarioMedicoHistorico: data.tarifarioMedicoHistorico.id
        });
      });
    }
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe(data => {
      this.tickets = data;
    });
  }

  loadMedicos(): void {
    this.medicoService.getMedicos().subscribe(data => {
      this.medicos = data;
    });
  }

  loadTarifarios(): void {
    this.tarifarioService.getTarifarios().subscribe(data => {
      this.tarifarios = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedTicket = this.tickets.find(t => t.id === formValue.ticket);
      const selectedMedico = this.medicos.find(m => m.id === +formValue.medico);
      const selectedTarifario = this.tarifarios.find(t => t.id === +formValue.tarifarioMedicoHistorico);

      const financeiro: Financeiro = {
        id: formValue.id,
        ticket: selectedTicket!,
        medico: selectedMedico!,
        totalParcelas: formValue.totalParcelas,
        parcela: formValue.parcela,
        vencimentoData: formValue.vencimentoData,
        recebido: formValue.recebido,
        recebidoData: formValue.recebidoData,
        valor: formValue.valor,
        tarifarioMedicoHistorico: selectedTarifario!,
        percentualTarifaAplicado: formValue.percentualTarifaAplicado
      };

      if (this.isEditMode) {
        this.financeiroService.updateFinanceiro(financeiro).subscribe(() => {
          this.router.navigate(['/financeiros']);
        });
      } else {
        this.financeiroService.createFinanceiro(financeiro).subscribe(() => {
          this.router.navigate(['/financeiros']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/financeiros']);
  }
}
