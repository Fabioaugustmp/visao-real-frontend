import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ItemTicket } from '../item-ticket.model';
import { ItemTicketService } from '../item-ticket.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-itens-ticket-list',
  templateUrl: './itens-ticket-list.component.html',
  styleUrls: ['./itens-ticket-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule
  ]
})
export class ItensTicketListComponent implements OnInit {

  itensTicket: ItemTicket[] = [];

  constructor(
    private itemTicketService: ItemTicketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadItensTicket();
  }

  loadItensTicket(): void {
    this.itemTicketService.getItemTickets().subscribe(data => {
      this.itensTicket = data;
    });
  }

  excluirItemTicket(id: number): void {
    if (confirm('Tem certeza que deseja excluir este item do ticket?')) {
      this.itemTicketService.deleteItemTicket(id).subscribe(() => {
        this.loadItensTicket();
      });
    }
  }
}
