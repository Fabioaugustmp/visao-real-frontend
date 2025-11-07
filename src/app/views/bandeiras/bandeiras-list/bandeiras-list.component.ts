import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Bandeira } from '../bandeira.model';
import { BandeiraService } from '../bandeira.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-bandeiras-list',
  templateUrl: './bandeiras-list.component.html',
  styleUrls: ['./bandeiras-list.component.scss'],
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
export class BandeirasListComponent implements OnInit {

  bandeiras: Bandeira[] = [];

  constructor(
    private bandeiraService: BandeiraService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBandeiras();
  }

  loadBandeiras(): void {
    this.bandeiraService.getBandeiras().subscribe(data => {
      this.bandeiras = data;
    });
  }

  excluirBandeira(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta bandeira?')) {
      this.bandeiraService.deleteBandeira(id).subscribe(() => {
        this.loadBandeiras();
      });
    }
  }
}
