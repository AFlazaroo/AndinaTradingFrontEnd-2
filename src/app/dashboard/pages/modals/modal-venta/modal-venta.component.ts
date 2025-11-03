import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-modal-venta',
  templateUrl: './modal-venta.component.html',
  styleUrls: ['./modal-venta.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModalVentaComponent implements OnInit, OnChanges {
  @Input() symbol: string = '';
  @Input() nombreEmpresa: string = '';
  @Input() cantidadDisponible: number = 0;
  @Input() precioActual: number = 0;
  @Output() confirmar = new EventEmitter<{ cantidad: number }>();

  @ViewChild('modalVenta') modalRef!: ElementRef;
  cantidad: number = 1;

  ngOnInit(): void {
    this.cantidad = 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cantidadDisponible']) {
      this.cantidad = Math.min(this.cantidad, changes['cantidadDisponible'].currentValue || 1);
    }
  }

  open(): void {
    // Resetear valores cuando se abre el modal
    this.cantidad = 1;
    
    if (this.modalRef?.nativeElement) {
      const modal = new bootstrap.Modal(this.modalRef.nativeElement);
      modal.show();
    }
  }

  close(): void {
    if (this.modalRef?.nativeElement) {
      const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  onConfirmar(): void {
    if (this.cantidad > 0 && this.cantidad <= this.cantidadDisponible) {
      this.confirmar.emit({ 
        cantidad: this.cantidad
      });
      this.close();
    }
  }

  get valorTotalEstimado(): number {
    // Valor estimado basado en el precio actual (solo informativo)
    return this.cantidad * (this.precioActual || 0);
  }

  get precioFormateado(): string {
    return (this.precioActual || 0).toFixed(2);
  }

  get puedeVender(): boolean {
    return this.cantidad > 0 && 
           this.cantidad <= this.cantidadDisponible;
  }
}

