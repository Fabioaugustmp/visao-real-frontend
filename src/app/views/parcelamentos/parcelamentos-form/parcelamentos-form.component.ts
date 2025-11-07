import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcelamentoService } from '../parcelamento.service';
import { Parcelamento } from '../parcelamento.model';
import { Ticket } from '../../tickets/ticket.model';
import { TicketService } from '../../tickets/ticket.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-parcelamentos-form',
  templateUrl: './parcelamentos-form.component.html',
  styleUrls: ['./parcelamentos-form.component.scss'],
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
export class ParcelamentosFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  parcelamentoId: number | null = null;
  tickets: Ticket[] = [];

  constructor(
    private fb: FormBuilder,
    private parcelamentoService: ParcelamentoService,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      numeroDeParcelas: [null, Validators.required],
      ticket: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTickets();
    this.parcelamentoId = this.route.snapshot.params['id'];
    if (this.parcelamentoId) {
      this.isEditMode = true;
      this.parcelamentoService.getParcelamento(this.parcelamentoId).subscribe(data => {
        this.form.patchValue({
          ...data,
          ticket: data.ticket?.id
        });
      });
    }
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe(data => {
      this.tickets = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedTicket = this.tickets.find(t => t.id === formValue.ticket);
      const parcelamento: Parcelamento = {
        id: formValue.id,
        numeroDeParcelas: formValue.numeroDeParcelas,
        ticket: selectedTicket!
      };

      if (this.isEditMode) {
        this.parcelamentoService.updateParcelamento(parcelamento).subscribe(() => {
          this.router.navigate(['/parcelamentos']);
        });
      } else {
        this.parcelamentoService.createParcelamento(parcelamento).subscribe(() => {
          this.router.navigate(['/parcelamentos']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/parcelamentos']);
  }
}
