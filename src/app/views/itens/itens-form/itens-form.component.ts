import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemService } from '../item.service';
import { Item } from '../item.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { ValidationFeedbackComponent } from '../../../components/validation-feedback/validation-feedback.component';

@Component({
  selector: 'app-itens-form',
  templateUrl: './itens-form.component.html',
  styleUrls: ['./itens-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule, ValidationFeedbackComponent]
})
export class ItensFormComponent implements OnInit {

  itemForm!: FormGroup;
  isEditMode = false;
  itemId!: number;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      tipo: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [0, Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.itemService.getItem(this.itemId).subscribe(item => {
          this.itemForm.patchValue(item);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const itemData: Item = this.itemForm.value;
      if (this.isEditMode) {
        itemData.id = this.itemId;
        this.itemService.updateItem(itemData).subscribe(() => {
          this.router.navigate(['/itens']);
        });
      } else {
        this.itemService.createItem(itemData).subscribe(() => {
          this.router.navigate(['/itens']);
        });
      }
    }
  }
}
