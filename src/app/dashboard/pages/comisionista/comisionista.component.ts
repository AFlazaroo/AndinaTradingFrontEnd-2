import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comisionista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './comisionista.component.html',
  styleUrls: ['./comisionista.component.scss']
})
export class ComisionistaComponent implements OnInit {
  nombreUsuario: string = '';

  constructor() {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombre') || '';
  }
} 