import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemTicketService } from '../item-ticket.service';
import { ItemTicket } from '../item-ticket.model';
import { Ticket } from '../../tickets/ticket.model';
import { TicketService } from '../../tickets/ticket.service';
import { Item } from '../../itens/item.model';
import { ItemService } from '../../itens/item.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-itens-ticket-form',
  templateUrl: './itens-ticket-form.component.html',
  styleUrls: ['./itens-ticket-form.component.scss'],
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
export class ItensTicketFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  itemTicketId: number | null = null;
  tickets: Ticket[] = [];
  items: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private itemTicketService: ItemTicketService,
    private ticketService: TicketService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      ticket: [null, Validators.required],
      item: [null, Validators.required],
      valor: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTickets();
    this.loadItems();
    this.itemTicketId = this.route.snapshot.params['id'];
    if (this.itemTicketId) {
      this.isEditMode = true;
      this.itemTicketService.getItemTicket(this.itemTicketId).subscribe(data => {
        this.form.patchValue({
          ...data,
          ticket: data.ticket?.id,
          item: data.item.id
        });
      });
    }
  }

  loadTickets(): void {
    this.ticketService.getAllTicketsWithoutPagination().subscribe(data => {
      this.tickets = data;
    });
  }

  loadItems(): void {
    this.itemService.getItens().subscribe(data => {
      this.items = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedTicket = this.tickets.find(t => t.id === formValue.ticket);
      const selectedItem = this.items.find(i => i.id === +formValue.item);
      const itemTicket: ItemTicket = {
        id: formValue.id,
        ticket: selectedTicket!,
        item: selectedItem!,
        valor: formValue.valor
      };

      if (this.isEditMode) {
        this.itemTicketService.updateItemTicket(itemTicket).subscribe(() => {
          this.router.navigate(['/itens-ticket']);
        });
      } else {
        this.itemTicketService.createItemTicket(itemTicket).subscribe(() => {
          this.router.navigate(['/itens-ticket']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/itens-ticket']);
  }
}
