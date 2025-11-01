import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-tickets-form',
  templateUrl: './tickets-form.component.html',
  styleUrls: ['./tickets-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class TicketsFormComponent implements OnInit {

  ticketForm!: FormGroup;
  isEditMode = false;
  ticketId!: string;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.ticketForm = this.fb.group({
      dataTicket: ['', Validators.required],
      numAtend: ['', Validators.required],
      nomePaciente: ['', Validators.required],
      nomePagador: ['', Validators.required],
      cpfPagador: ['', Validators.required],
      medicoExec: ['', Validators.required],
      medicoSolic: ['', Validators.required],
      nfSerie: ['', Validators.required],
      nfNumero: ['', Validators.required],
      formaPagamento: ['', Validators.required],
      bandeira: ['', Validators.required],
      cartaoIdent: ['', Validators.required],
      cartaoCvv: ['', Validators.required],
      cartaoAutorizacao: ['', Validators.required],
      cartaoNsu: ['', Validators.required],
      parcelamento: ['', Validators.required],
      posNum: ['', Validators.required],
      itens: ['', Validators.required],
      indicados: ['', Validators.required],
      financeiro: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.ticketId = params['id'];
        this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
          this.ticketForm.patchValue(ticket);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const ticketData: Ticket = this.ticketForm.value;
      if (this.isEditMode) {
        ticketData.id = this.ticketId;
        this.ticketService.updateTicket(ticketData).subscribe(() => {
          this.router.navigate(['/tickets']);
        });
      } else {
        this.ticketService.createTicket(ticketData).subscribe(() => {
          this.router.navigate(['/tickets']);
        });
      }
    }
  }
}