import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, Params } from '@angular/router';
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
import { Tarifario } from '../../tarifarios/tarifario.model';
import { TarifarioService } from '../../tarifarios/tarifario.service';
import { Financeiro } from '../../financeiros/financeiro.model';
import { CardModule, GridModule, FormModule, ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

function minLengthArray(min: number) {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value.length >= min) {
      return null;
    }
    return { minLengthArray: { valid: false } };
  };
}

function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = control.value;
  if (!cpf) {
    return null;
  }

  const cleanCpf = cpf.replace(/[^\d]+/g, '');

  if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) {
    return { cpfInvalid: true };
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) {
    return { cpfInvalid: true };
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) {
    return { cpfInvalid: true };
  }

  return null;
}

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
    ButtonModule,
    IconModule
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
  tarifarios$!: Observable<Tarifario[]>;

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
    private tarifarioService: TarifarioService,
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
    this.tarifarios$ = this.tarifarioService.getTarifarios();
  }

  initForm(): void {
    this.ticketForm = this.fb.group({
      dataTicket: ['', Validators.required],
      numAtend: ['', [Validators.required, Validators.maxLength(20)]], // Assuming max length for attendance number
      nomePaciente: ['', [Validators.required, Validators.maxLength(100)]], // Assuming max length for patient name
      nomePagador: ['', [Validators.required, Validators.maxLength(100)]], // Assuming max length for payer name
      cpfPagador: ['', [Validators.required, cpfValidator]], // Using the custom CPF validator
      medicoExec: ['', Validators.required],
      medicoSolic: ['', Validators.required],
      nfSerie: ['', [Validators.required, Validators.maxLength(10)]], // Assuming max length for NF series
      nfNumero: ['', [Validators.required, Validators.maxLength(20)]], // Assuming max length for NF number
      formaPagamento: ['', Validators.required],
      bandeira: ['', Validators.required],
      cartaoIdent: ['', [Validators.required, Validators.maxLength(20)]], // Assuming max length for card identification
      cartaoCvv: ['', [Validators.required, Validators.pattern(/^(\d{3}|\d{4})$/)]],
      cartaoAutorizacao: ['', [Validators.required, Validators.maxLength(20)]], // Assuming max length for authorization
      cartaoNsu: ['', [Validators.required, Validators.maxLength(20)]], // Assuming max length for NSU
      parcelamento: ['', Validators.required],
      posNum: ['', [Validators.required, Validators.maxLength(20)]], // Assuming max length for POS number
      itens: this.fb.array([], minLengthArray(1)),
      indicados: this.fb.array([]),
      tarifario: ['', Validators.required]
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]]
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
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.ticketId = params['id'];
        this.ticketService.getTicket(this.ticketId).subscribe((ticket: Ticket) => {
          this.ticketForm.patchValue({
            ...ticket,
            medicoExec: ticket.medicoExec.id,
            medicoSolic: ticket.medicoSolic.id,
            formaPagamento: ticket.formaPagamento.id,
            bandeira: ticket.bandeira.id,
            parcelamento: ticket.parcelamento.id,
            tarifario: ticket.financeiro.tarifarioMedicoHistorico.id // Patch tarifario
          });
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
      const formValue = this.ticketForm.value;

      // Find selected objects
      let selectedMedicoExec: Medico | undefined;
      this.medicos$.subscribe(medicos => {
        selectedMedicoExec = medicos.find(m => m.id === +formValue.medicoExec);
      }).unsubscribe();

      let selectedMedicoSolic: Medico | undefined;
      this.medicos$.subscribe(medicos => {
        selectedMedicoSolic = medicos.find(m => m.id === +formValue.medicoSolic);
      }).unsubscribe();

      let selectedFormaPagamento: FormaPagamento | undefined;
      this.formasPagamento$.subscribe(formas => {
        selectedFormaPagamento = formas.find(f => f.id === +formValue.formaPagamento);
      }).unsubscribe();

      let selectedBandeira: Bandeira | undefined;
      this.bandeiras$.subscribe(bandeiras => {
        selectedBandeira = bandeiras.find(b => b.id === +formValue.bandeira);
      }).unsubscribe();

      let selectedParcelamento: Parcelamento | undefined;
      this.parcelamentos$.subscribe(parcelamentos => {
        selectedParcelamento = parcelamentos.find(p => p.id === +formValue.parcelamento);
      }).unsubscribe();

      let selectedTarifario: Tarifario | undefined;
      this.tarifarios$.subscribe(tarifarios => {
        selectedTarifario = tarifarios.find(t => t.id === +formValue.tarifario);
      }).unsubscribe();

      // Create Financeiro object
      const financeiro: Financeiro = {
        id: 0, // Will be set by backend
        ticket: null, // Will be set by backend
        medico: selectedMedicoExec!, // Assuming medicoExec is the relevant medico for financeiro
        totalParcelas: 0, // Not available in ticket form
        parcela: 0, // Not available in ticket form
        vencimentoData: new Date(), // Not available in ticket form
        recebido: false, // Default value
        recebidoData: null, // Default value
        valor: 0, // Not available in ticket form
        tarifarioMedicoHistorico: selectedTarifario!,
        percentualTarifaAplicado: selectedTarifario?.percentualTarifa || 0
      };

      const ticketData: Ticket = {
        id: this.ticketId,
        dataTicket: formValue.dataTicket,
        numAtend: formValue.numAtend,
        nomePaciente: formValue.nomePaciente,
        nomePagador: formValue.nomePagador,
        cpfPagador: formValue.cpfPagador,
        medicoExec: selectedMedicoExec!,
        medicoSolic: selectedMedicoSolic!,
        nfSerie: formValue.nfSerie,
        nfNumero: formValue.nfNumero,
        formaPagamento: selectedFormaPagamento!,
        bandeira: selectedBandeira!,
        cartaoIdent: formValue.cartaoIdent,
        cartaoCvv: formValue.cartaoCvv,
        cartaoAutorizacao: formValue.cartaoAutorizacao,
        cartaoNsu: formValue.cartaoNsu,
        parcelamento: selectedParcelamento!,
        posNum: formValue.posNum,
        itens: formValue.itens,
        indicados: formValue.indicados,
        financeiro: financeiro
      };

      if (this.isEditMode) {
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