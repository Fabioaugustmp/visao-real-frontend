import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, Params } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
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
import { CardModule, GridModule, FormModule, ButtonModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgxCurrencyDirective, NgxCurrencyInputMode } from 'ngx-currency';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ItemTicketService, PageableItemTicket } from '../../itens-ticket/item-ticket.service';
import { ItemTicket } from '../../itens-ticket/item-ticket.model';

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
    IconModule,
    AlertModule,
    NgxCurrencyDirective,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()]
})
export class TicketsFormComponent implements OnInit {

  ticketForm!: FormGroup;
  isEditMode = false;
  ticketId!: string;
  medicos$!: Observable<Medico[]>;
  formasPagamento$!: Observable<FormaPagamento[]>;
  bandeiras$!: Observable<Bandeira[]>;
  parcelamentos$!: Observable<Parcelamento[]>;
  itensList: Item[] = [];
  indicados$!: Observable<Indicado[]>;
  indicacoes$!: Observable<Indicacao[]>;
  tarifarios$!: Observable<Tarifario[]>;
  totalItensValue: number = 0;
  existingItemTickets: ItemTicket[] = [];
  totalExistingItems: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  Math = Math; // Expose Math to template for pagination

  public customCurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: ".",
    nullable: true,
    min: null,
    max: null,
    inputMode: NgxCurrencyInputMode.Financial
  };

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
    private route: ActivatedRoute,
    private itemTicketService: ItemTicketService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.medicos$ = this.medicoService.getMedicos();
    this.formasPagamento$ = this.formaPagamentoService.getFormasPagamento();
    this.bandeiras$ = this.bandeiraService.getBandeiras();
    this.parcelamentos$ = this.parcelamentoService.getParcelamentos();
    this.itemService.getItens().subscribe(itens => this.itensList = itens);
    this.indicados$ = this.indicadoService.getAllIndicados();
    this.indicacoes$ = this.indicacaoService.getAllIndicacoes();

    this.checkMode();

    this.itens.valueChanges.subscribe(() => {
      this.calculateTotalItensValue();
    });
    this.calculateTotalItensValue(); // Initial calculation
  }

  calculateTotalItensValue(): void {
    this.totalItensValue = this.itens.value.reduce((total: number, item: { valor: number }) => {
      return total + (item.valor || 0);
    }, 0);
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

  onItemChange(event: any, index: number): void {
    const itemId = event.target.value;
    const selectedItem = this.itensList.find(item => item.id === +itemId);
    this.calculateTotalItensValue();
    if (selectedItem) {
      this.calculateTotalItensValue();
      this.itens.at(index).patchValue({ valor: selectedItem.valor });
    }
  }

  checkMode(): void {
    this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.ticketId = params['id'];
          return this.ticketService.getTicket(this.ticketId);
        }
        return of(null);
      })
    ).subscribe(ticket => {
      const medicoExecControl = this.ticketForm.get('medicoExec')!;

      this.tarifarios$ = medicoExecControl.valueChanges.pipe(
        startWith(ticket ? ticket.medicoExecId : null),
        switchMap(medicoId => {
          if (medicoId) {
            return this.medicoService.getTarifariosAtuais(medicoId).pipe(
              map(tarifarios => {
                if (ticket && ticket.financeiro.tarifarioMedicoHistorico) {
                  const ticketTarifario = ticket.financeiro.tarifarioMedicoHistorico;
                  if (!tarifarios.some(t => t.id === ticketTarifario.id)) {
                    return [ticketTarifario, ...tarifarios];
                  }
                }
                return tarifarios;
              })
            );
          }
          return of([]);
        })
      );

      if (ticket) {
        const dateTicket = ticket.dataTicket ? new Date(ticket.dataTicket).toISOString().split('T')[0] : '';

        this.ticketForm.patchValue({
          ...ticket,
          dataTicket: dateTicket,
          medicoExec: ticket.medicoExecId,
          medicoSolic: ticket.medicoSolicId,
          formaPagamento: ticket.formaPagamentoId,
          bandeira: ticket.bandeiraId,
          parcelamento: ticket.parcela,
          // tarifario: ticket.financeiro.tarifarioMedicoHistorico.id
          tarifario: undefined
        });

        // const ticketWithItensIds = ticket as any;
        // if (ticketWithItensIds.itensIds && ticketWithItensIds.itensIds.length > 0) {
        //   ticketWithItensIds.itensIds.forEach((itemId: number) => {
        //     this.itemService.getItem(itemId).subscribe(item => {
        //       this.itens.push(this.fb.group({
        //         item: item.id,
        //         valor: item.valor
        //       }));
        //     });
        //   });
        // } else if (ticket.itens && ticket.itens.length > 0) {
        //   // Fallback to original behavior if itensIds is not present
        //   ticket.itens.forEach(item => {
        //     this.itens.push(this.fb.group({
        //       item: item.item.id,
        //       valor: item.valor
        //     }));
        //   });
        // }

        // ticket.indicados.forEach(indicado => {
        //   this.indicados.push(this.fb.group(indicado));
        // });
      }
    });

    this.loadExistingItemTickets(0);
  }

  loadExistingItemTickets(page: number = 0): void {
    if (this.ticketId) {
      this.itemTicketService.getItemTicketsByTicketId(this.ticketId, page, this.pageSize).subscribe(
        (response: PageableItemTicket) => {
          this.existingItemTickets = response.content;
          this.totalExistingItems = response.totalElements;
          this.currentPage = response.number;
        }
      );
    }
  }
  onPageChange(page: number): void {
    this.loadExistingItemTickets(page);
  }

  getTotalExistingItemsValue(): number {
    return this.existingItemTickets.reduce((sum, item) => sum + item.valor, 0);
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.ticketForm.invalid && (this.ticketForm.dirty || this.ticketForm.touched)) {
      Object.keys(this.ticketForm.controls).forEach(key => {
        const control = this.ticketForm.get(key);
        if (control && control.invalid && (control.dirty || control.touched)) {
          const controlErrors = control.errors;
          if (controlErrors) {
            Object.keys(controlErrors).forEach(errorKey => {
              const errorMessage = this.getErrorMessage(key, errorKey, controlErrors[errorKey]);
              if (errorMessage) {
                errors.push(errorMessage);
              }
            });
          }
        }
      });
    }
    return errors;
  }

  getErrorMessage(controlName: string, errorName: string, errorValue: any): string | null {
    const fieldNames: { [key: string]: string } = {
      dataTicket: 'Data',
      numAtend: 'Nº Atendimento',
      nomePaciente: 'Paciente',
      nomePagador: 'Pagador',
      cpfPagador: 'CPF Pagador',
      medicoExec: 'Médico Executante',
      medicoSolic: 'Médico Solicitante',
      nfSerie: 'Série NF',
      nfNumero: 'Nº NF',
      formaPagamento: 'Forma de Pagamento',
      bandeira: 'Bandeira',
      cartaoIdent: 'Identificação do Cartão',
      cartaoAutorizacao: 'Autorização',
      cartaoNsu: 'NSU',
      parcelamento: 'Parcelamento',
      posNum: 'Número POS',
      itens: 'Itens',
      tarifario: 'Tarifário'
    };

    const fieldName = fieldNames[controlName] || controlName;

    switch (errorName) {
      case 'required':
        return `${fieldName} é obrigatório.`;
      case 'maxlength':
        return `${fieldName} deve ter no máximo ${errorValue.requiredLength} caracteres.`;
      case 'min':
        return `${fieldName} deve ser maior que ${errorValue.min}.`;
      case 'cpfInvalid':
        return `${fieldName} é inválido.`;
      case 'minLengthArray':
        return `${fieldName} deve ter pelo menos 1 item.`;
      case 'pattern':
        return `${fieldName} tem um formato inválido.`;
      default:
        return `${fieldName} é inválido.`;
    }
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
        id: 0,
        ticket: null,
        medico: selectedMedicoExec!,
        totalParcelas: selectedParcelamento?.numeroDeParcelas ?? 0,
        parcela: selectedParcelamento?.numeroDeParcelas ?? 0,
        vencimentoData: new Date(),
        recebido: false,
        recebidoData: null,
        valor: 0,
        tarifarioMedicoHistorico: selectedTarifario!,
        percentualTarifaAplicado: selectedTarifario?.percentualTarifa || 0
      };

      // console.log('Form itens:', JSON.stringify(formValue.itens, null, 2));
      const transformedItens = formValue.itens.map((item: any) => ({
        ticketId: null,
        itemId: item.item ? +item.item : null,
        valor: item.valor
      }));

      // Clean CPF to send only raw digits to backend
      const cleanCpf = formValue.cpfPagador ? formValue.cpfPagador.replace(/[^\d]+/g, '') : '';

      const ticketData: Ticket = {
        id: this.ticketId,
        dataTicket: formValue.dataTicket,
        numAtend: formValue.numAtend,
        nomePaciente: formValue.nomePaciente,
        nomePagador: formValue.nomePagador,
        cpfPagador: cleanCpf,
        medicoExec: selectedMedicoExec!,
        medicoSolic: selectedMedicoSolic!,
        nfSerie: formValue.nfSerie,
        nfNumero: formValue.nfNumero,
        formaPagamento: selectedFormaPagamento!,
        formaPagamentoId: formValue.formaPagamento,
        bandeiraId: formValue.bandeira,
        medicoExecId: formValue.medicoExec,
        medicoSolicId: formValue.medicoSolic,
        bandeira: selectedBandeira!,
        cartaoIdent: formValue.cartaoIdent,
        cartaoAutorizacao: formValue.cartaoAutorizacao,
        cartaoNsu: formValue.cartaoNsu,
        parcela: formValue.parcelamento,
        parcelamento: selectedParcelamento!,
        posNum: formValue.posNum,
        itens: transformedItens,
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