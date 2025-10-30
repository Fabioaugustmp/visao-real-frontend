import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrupoService } from '../grupo.service';
import { Grupo } from '../grupo.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-grupos-form',
  templateUrl: './grupos-form.component.html',
  styleUrls: ['./grupos-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class GruposFormComponent implements OnInit {

  grupoForm!: FormGroup;
  isEditMode = false;
  grupoId!: number;

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.grupoForm = this.fb.group({
      nome_grupo: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.grupoId = +params['id'];
        this.grupoService.getGrupo(this.grupoId).subscribe(grupo => {
          this.grupoForm.patchValue(grupo);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.grupoForm.valid) {
      const grupoData: Grupo = this.grupoForm.value;
      if (this.isEditMode) {
        grupoData.id = this.grupoId;
        this.grupoService.updateGrupo(grupoData).subscribe(() => {
          this.router.navigate(['/grupos']);
        });
      } else {
        this.grupoService.createGrupo(grupoData).subscribe(() => {
          this.router.navigate(['/grupos']);
        });
      }
    }
  }
}
