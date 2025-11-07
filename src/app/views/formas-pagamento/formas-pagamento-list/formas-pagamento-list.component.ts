import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormaPagamento } from '../forma-pagamento.model';
import { FormaPagamentoService } from '../forma-pagamento.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-formas-pagamento-list',
  templateUrl: './formas-pagamento-list.component.html',
  styleUrls: ['./formas-pagamento-list.component.scss'],
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
export class FormasPagamentoListComponent implements OnInit {

  formasPagamento: FormaPagamento[] = [];

  constructor(
    private formaPagamentoService: FormaPagamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFormasPagamento();
  }

  loadFormasPagamento(): void {
    this.formaPagamentoService.getFormasPagamento().subscribe(data => {
      this.formasPagamento = data;
    });
  }

  excluirFormaPagamento(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta forma de pagamento?')) {
      this.formaPagamentoService.deleteFormaPagamento(id).subscribe(() => {
        this.loadFormasPagamento();
      });
    }
  }
}
