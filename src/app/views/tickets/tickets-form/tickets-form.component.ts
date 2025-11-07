import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Medico } from '../../medicos/medico.model';
import { MedicoService } from '../../medicos/medico.service';
import { FormaPagamento } from '../../formas-pagamento/forma-pagamento.model';
import { FormaPagamentoService } from '../../formas-pagamento/forma-pagamento.service';
import { Bandeira } from '../../bandeiras/bandeira.model';
import { BandeiraService } from '../../bandeiras/bandeira.service';
import { Parcelamento } from '../../parcelamentos/parcelamento.model';
import { ParcelamentoService } from '../../parcelamentos/parcelamento.service';
import { Item } from '../../itens/item.model';
import { ItemService } from '../../itens/item.service';
import { Indicado } from '../../indicados/indicado.model';
import { IndicadoService } from '../../indicados/indicado.service';
import { Ticket } from '../ticket.model';
import { TicketService } from '../ticket.service';
import { IndicacaoService } from '../../indicacoes/indicacao.service';
import { Indicacao } from '../../indicacoes/indicacao.model';
import { CardModule, GridModule, FormModule, ButtonModule } from '@coreui/angular';

@Component({
  selector: 'app-tickets-form',
  templateUrl: './tickets-form.component.html',
  styleUrls: ['./tickets-form.component.scss'],
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
export class TicketsFormComponent implements OnInit {

  ticketForm!: FormGroup;
  isEditMode = false;
  ticketId!: string;
  medicos$!: Observable<Medico[]>;
  formasPagamento$!: Observable<FormaPagamento[]>;
  bandeiras$!: Observable<Bandeira[]>;
  parcelamentos$!: Observable<Parcelamento[]>;
  itens$!: Observable<Item[]>;
  indicados$!: Observable<Indicado[]>;
  indicacoes$!: Observable<Indicacao[]>;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private medicoService: MedicoService,
    private formaPagamentoService: FormaPagamentoService,
    private bandeiraService: BandeiraService,
    private parcelamentoService: ParcelamentoService,
    private itemService: ItemService,
    private indicadoService: IndicadoService,
    private indicacaoService: IndicacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
    this.medicos$ = this.medicoService.getMedicos();
    this.formasPagamento$ = this.formaPagamentoService.getFormasPagamento();
    this.bandeiras$ = this.bandeiraService.getBandeiras();
    this.parcelamentos$ = this.parcelamentoService.getParcelamentos();
    this.itens$ = this.itemService.getItens();
    this.indicados$ = this.indicadoService.getIndicados();
    this.indicacoes$ = this.indicacaoService.getIndicacoes();
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
      itens: this.fb.array([]),
      indicados: this.fb.array([]),
      financeiro: ['', Validators.required]
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  get itens(): FormArray {
    return this.ticketForm.get('itens') as FormArray;
  }

  addItem(): void {
    this.itens.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.itens.removeAt(index);
  }

  createIndicadoFormGroup(): FormGroup {
    return this.fb.group({
      indicado: ['', Validators.required]
    });
  }

  get indicados(): FormArray {
    return this.ticketForm.get('indicados') as FormArray;
  }

  addIndicado(): void {
    this.indicados.push(this.createIndicadoFormGroup());
  }

  removeIndicado(index: number): void {
    this.indicados.removeAt(index);
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.ticketId = params['id'];
        this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
          this.ticketForm.patchValue(ticket);
          ticket.itens.forEach(item => {
            this.itens.push(this.fb.group(item));
          });
          ticket.indicados.forEach(indicado => {
            this.indicados.push(this.fb.group(indicado));
          });
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