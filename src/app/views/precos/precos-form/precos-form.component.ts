import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrecoService } from '../preco.service';
import { Preco } from '../preco.model';
import { Item } from '../../itens/item.model';
import { ItemService } from '../../itens/item.service';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-precos-form',
  templateUrl: './precos-form.component.html',
  styleUrls: ['./precos-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class PrecosFormComponent implements OnInit {

  precoForm!: FormGroup;
  isEditMode = false;
  precoId!: number;
  items: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private precoService: PrecoService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadItems();
    this.initForm();
    this.checkMode();
  }

  loadItems(): void {
    this.itemService.getItens().subscribe(items => {
      this.items = items;
    });
  }

  initForm(): void {
    this.precoForm = this.fb.group({
      item: [null, Validators.required],
      valor: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.precoId = +params['id'];
        this.precoService.getPreco(this.precoId).subscribe(preco => {
          this.precoForm.patchValue({
            item: preco.item.id,
            valor: preco.valor
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.precoForm.valid) {
      const formValue = this.precoForm.value;
      const selectedItem = this.items.find(item => item.id === +formValue.item);
      const precoData: Preco = {
        id: this.precoId,
        item: selectedItem!,
        valor: formValue.valor
      };

      if (this.isEditMode) {
        this.precoService.updatePreco(precoData).subscribe(() => {
          this.router.navigate(['/precos']);
        });
      } else {
        this.precoService.createPreco(precoData).subscribe(() => {
          this.router.navigate(['/precos']);
        });
      }
    }
  }
}

