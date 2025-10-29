import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-modal-compra',
  templateUrl: './modal-compra.component.html',
  styleUrls: ['./modal-compra.component.css'],
   imports: [CommonModule, FormsModule]
})
export class ModalCompraComponent {
  @Input() symbol: string = '';
  @Output() confirmar = new EventEmitter<number>();

  @ViewChild('modalCompra') modalRef!: ElementRef;
  cantidad: number = 1;

  open(): void {
    if (this.modalRef?.nativeElement) {
      new bootstrap.Modal(this.modalRef.nativeElement).show();
    }
  }

  close(): void {
    if (this.modalRef?.nativeElement) {
      bootstrap.Modal.getInstance(this.modalRef.nativeElement)?.hide();
    }
  }

  onConfirmar(): void {
    if (this.cantidad > 0) {
      this.confirmar.emit(this.cantidad);
      this.close();
    }
  }
}
