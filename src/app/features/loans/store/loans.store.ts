import { Injectable, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoansRepository } from '../data-access/loans.repository';

@Injectable({ providedIn: 'root' })
export class LoansStore {
  private repo   = inject(LoansRepository);
  private toastr = inject(ToastrService);

  private readonly _items      = signal<any[]>([]);
  private readonly _total      = signal(0);
  private readonly _pageSize   = signal(10);
  private readonly _pageIndex  = signal(0);
  private readonly _search     = signal(' ');
  private readonly _isLoading  = signal(false);
  private readonly _editingIds = signal<number[]>([]);
  private readonly _editingMap = signal<{ [id: number]: any }>({});

  readonly items      = this._items.asReadonly();
  readonly total      = this._total.asReadonly();
  readonly pageSize   = this._pageSize.asReadonly();
  readonly pageIndex  = this._pageIndex.asReadonly();
  readonly isLoading  = this._isLoading.asReadonly();
  readonly editingIds = this._editingIds.asReadonly();
  readonly editingMap = this._editingMap.asReadonly();

  isEditing(id: number): boolean {
    return this._editingIds().includes(id);
  }

  load(): void {
    this._isLoading.set(true);
    this.repo.getLoansList({
      cantidad: this._pageSize(),
      pagina: this._pageIndex(),
      busqueda: this._search()
    }).subscribe({
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

  setPage(pageSize: number, pageIndex: number): void {
    this._pageSize.set(pageSize);
    this._pageIndex.set(pageIndex);
    this.load();
  }

  setSearch(q: string): void {
    this._search.set(q);
    this._pageIndex.set(0);
    this.load();
  }

  startEdit(item: any): void {
    if (!this.isEditing(item.id)) {
      this._editingIds.update(ids => [...ids, item.id]);
      this._editingMap.update(m => ({ ...m, [item.id]: { ...item } }));
    }
  }

  cancelEdit(item: any): void {
    this._editingIds.update(ids => ids.filter(id => id !== item.id));
    this._editingMap.update(m => {
      const copy = { ...m };
      delete copy[item.id];
      return copy;
    });
  }

  updateSnap(id: number, patch: any): void {
    this._editingMap.update(m => ({ ...m, [id]: { ...m[id], ...patch } }));
  }

  saveAll(): void {
    const ids = [...this._editingIds()];
    const map = this._editingMap();
    Promise.all(ids.map(id => this.repo.updateLoan(id, map[id]).toPromise()))
      .then(() => {
        this.repo.getDevolucionPdf(ids).subscribe({
          next: b => this.repo.triggerDownload(b, 'Acta_Prestamo', 'pdf')
        });
        this._editingIds.set([]);
        this._editingMap.set({});
        this.load();
      })
      .catch(e => this.toastr.error(String(e), 'Error al guardar'));
  }

  downloadReportePdf(): void {
    this.repo.getReportePdf().subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Prestamos', 'pdf'),
      error: e => console.error(e)
    });
  }

  downloadReporteExcel(): void {
    this.repo.getReporteExcel().subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Prestamos', 'xlsx'),
      error: e => console.error(e)
    });
  }

  delete(id: number): void {
    if (!confirm(`¿Eliminar ID: ${id}?`)) return;
    this.repo.deleteLoan([id]).subscribe({
      next: () => {
        this.toastr.success('Eliminado');
        this.load();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }
}
