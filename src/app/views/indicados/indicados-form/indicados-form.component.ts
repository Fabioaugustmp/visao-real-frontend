import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IndicadoService } from '../indicado.service';
import { Indicado } from '../indicado.model';
import { Ticket } from '../../tickets/ticket.model';
import { TicketService } from '../../tickets/ticket.service';
import { Indicacao } from '../../indicacoes/indicacao.model';
import { IndicacaoService } from '../../indicacoes/indicacao.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-indicados-form',
  templateUrl: './indicados-form.component.html',
  styleUrls: ['./indicados-form.component.scss'],
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
export class IndicadosFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  indicadoId: number | null = null;
  tickets: Ticket[] = [];
  indicacoes: Indicacao[] = [];

  constructor(
    private fb: FormBuilder,
    private indicadoService: IndicadoService,
    private ticketService: TicketService,
    private indicacaoService: IndicacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      ticket: [null, Validators.required],
      indicacao: [null, Validators.required],
      venctoIndicacao: [null, Validators.required],
      totalParcelas: [null, Validators.required],
      parcela: [null, Validators.required],
      valorIndicacao: [null, Validators.required],
      pago: [false],
      pagoData: [null],
      recebido: [false],
      recebidoData: [null]
    });
  }

  ngOnInit(): void {
    this.loadTickets();
    this.loadIndicacoes();
    this.indicadoId = this.route.snapshot.params['id'];
    if (this.indicadoId) {
      this.isEditMode = true;
      this.indicadoService.getIndicado(this.indicadoId).subscribe(data => {
        this.form.patchValue({
          ...data,
          ticket: data.ticket?.id,
          indicacao: data.indicacao.id
        });
      });
    }
  }

  loadTickets(): void {
    this.ticketService.getAllTicketsWithoutPagination().subscribe(data => {
      this.tickets = data;
    });
  }

  loadIndicacoes(): void {
    this.indicacaoService.getIndicacoes().subscribe(data => {
      this.indicacoes = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedTicket = this.tickets.find(t => t.id === formValue.ticket);
      const selectedIndicacao = this.indicacoes.find(i => i.id === +formValue.indicacao);
      const indicado: Indicado = {
        id: formValue.id,
        ticket: selectedTicket!,
        indicacao: selectedIndicacao!,
        venctoIndicacao: formValue.venctoIndicacao,
        totalParcelas: formValue.totalParcelas,
        parcela: formValue.parcela,
        valorIndicacao: formValue.valorIndicacao,
        pago: formValue.pago,
        pagoData: formValue.pagoData,
        recebido: formValue.recebido,
        recebidoData: formValue.recebidoData
      };

      if (this.isEditMode) {
        this.indicadoService.updateIndicado(indicado).subscribe(() => {
          this.router.navigate(['/indicados']);
        });
      } else {
        this.indicadoService.createIndicado(indicado).subscribe(() => {
          this.router.navigate(['/indicados']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/indicados']);
  }
}
