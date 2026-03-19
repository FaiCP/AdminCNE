import { Injectable, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HistoryRepository } from '../data-access/history.repository';

@Injectable({ providedIn: 'root' })
export class HistoryStore {
  private repo   = inject(HistoryRepository);
  private toastr = inject(ToastrService);

  private readonly _items      = signal<any[]>([]);
  private readonly _custodios  = signal<any[]>([]);
  private readonly _total      = signal(0);
  private readonly _pageSize   = signal(10);
  private readonly _pageIndex  = signal(0);
  private readonly _search     = signal('');
  private readonly _custodioId = signal(0);
  private readonly _isLoading  = signal(false);

  readonly items      = this._items.asReadonly();
  readonly custodios  = this._custodios.asReadonly();
  readonly total      = this._total.asReadonly();
  readonly pageSize   = this._pageSize.asReadonly();
  readonly pageIndex  = this._pageIndex.asReadonly();
  readonly isLoading  = this._isLoading.asReadonly();

  loadCustodios(): void {
    this.repo.getCustodios().subscribe({
      next: res => this._custodios.set(res.datos.elementos),
      error: (e: any) => this.toastr.error(e?.error?.mensajes?.join(','), 'Error')
    });
  }

  loadHistorial(custodioId: number): void {
    this._custodioId.set(custodioId);
    this._isLoading.set(true);
    this.repo.getHistorialList(
      this._pageSize(),
      this._pageIndex(),
      this._search(),
      custodioId
    ).subscribe({
      next: res => {
        this._items.set(res.datos.elementos);
        this._total.set(res.datos.cantidadTotal);
        this._isLoading.set(false);
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
        this._isLoading.set(false);
      }
    });
  }

  setPage(size: number, index: number): void {
    this._pageSize.set(size);
    this._pageIndex.set(index);
    this.loadHistorial(this._custodioId());
  }

  downloadActaPdf(): void {
    const ids = this._items().map((i: any) => i.id);
    this.repo.getActaPdf(ids).subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Prestamo', 'pdf'),
      error: e => console.error(e)
    });
  }
}
