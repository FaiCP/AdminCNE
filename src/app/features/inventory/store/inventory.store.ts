import { Injectable, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryRepository } from '../data-access/inventory.repository';

@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private repo   = inject(InventoryRepository);
  private toastr = inject(ToastrService);

  private readonly _items       = signal<any[]>([]);
  private readonly _kits        = signal<any[]>([]);
  private readonly _total       = signal(0);
  private readonly _totalKits   = signal(0);
  private readonly _pageSize    = signal(10);
  private readonly _pageIndex   = signal(0);
  private readonly _search      = signal('');
  private readonly _isLoading   = signal(false);
  private readonly _editingId   = signal<number | null>(null);
  private readonly _editingSnap = signal<any>({});

  readonly items       = this._items.asReadonly();
  readonly kits        = this._kits.asReadonly();
  readonly total       = this._total.asReadonly();
  readonly totalKits   = this._totalKits.asReadonly();
  readonly pageSize    = this._pageSize.asReadonly();
  readonly pageIndex   = this._pageIndex.asReadonly();
  readonly isLoading   = this._isLoading.asReadonly();
  readonly editingId   = this._editingId.asReadonly();
  readonly editingSnap = this._editingSnap.asReadonly();

  isEditing(id: number): boolean {
    return this._editingId() === id;
  }

  loadHardware(): void {
    this._isLoading.set(true);
    this.repo.getHardwareList({
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

  loadKits(): void {
    this.repo.getKitsList({
      cantidad: this._pageSize(),
      pagina: this._pageIndex(),
      busqueda: this._search()
    }).subscribe({
      next: res => {
        this._kits.set(res.datos.elementos);
        this._totalKits.set(res.datos.cantidadTotal);
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }

  setPage(pageSize: number, pageIndex: number): void {
    this._pageSize.set(pageSize);
    this._pageIndex.set(pageIndex);
    this.loadHardware();
  }

  setSearch(q: string): void {
    this._search.set(q);
    this._pageIndex.set(0);
    this.loadHardware();
  }

  startEdit(item: any): void {
    this._editingId.set(item.id);
    this._editingSnap.set({ ...item });
  }

  cancelEdit(): void {
    this._editingId.set(null);
    this._editingSnap.set({});
  }

  updateSnap(patch: any): void {
    this._editingSnap.update((s: any) => ({ ...s, ...patch }));
  }

  saveHardwareEdit(): void {
    const id = this._editingId();
    if (id === null) return;
    this.repo.updateHardware(id, this._editingSnap()).subscribe({
      next: () => {
        this.toastr.success('Actualizado');
        this._editingId.set(null);
        this.loadHardware();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }

  saveKitEdit(): void {
    const id = this._editingId();
    if (id === null) return;
    this.repo.updateKit(id, this._editingSnap()).subscribe({
      next: () => {
        this.toastr.success('Actualizado');
        this._editingId.set(null);
        this.loadKits();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }

  deleteHardware(id: number): void {
    if (!confirm(`¿Eliminar ID: ${id}?`)) return;
    this.repo.deleteHardware([id]).subscribe({
      next: () => {
        this.toastr.success('Eliminado');
        this.loadHardware();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }

  downloadHardwareActaPdf(): void {
    this.repo.getActaPdf().subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Inventario', 'pdf'),
      error: e => console.error(e)
    });
  }

  downloadHardwareActaExcel(): void {
    this.repo.getActaExcel().subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Inventario', 'xlsx'),
      error: e => console.error(e)
    });
  }

  downloadKitsActaPdf(): void {
    this.repo.getKitsActaPdf().subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Kits', 'pdf'),
      error: e => console.error(e)
    });
  }
}
