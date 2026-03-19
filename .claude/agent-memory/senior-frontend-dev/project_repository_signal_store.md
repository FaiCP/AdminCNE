---
name: Repository + Signal Store pattern
description: Capa de acceso a datos y estado reactivo implementada con ApiService base, repositories por feature y Signal Stores para todas las features de AdminCNE
type: project
---

Patrón Repository + Signal Store implementado en marzo 2026.

**Why:** Reemplazar llamadas directas a `HttpService` genérico con repositories especializados y estado reactivo via Angular Signals, eliminando MatTableDataSource y lógica dispersa en los componentes.

**How to apply:** Al trabajar en cualquier feature, usar el store correspondiente en el componente. Nunca llamar al HttpService antiguo desde los index components.

## Archivos creados

### Capa base (core)
- `src/app/core/http/api.service.ts` — ApiService base con métodos protected: `getList`, `getListCustom`, `getOne`, `create`, `update`, `deleteMany`, `getBlob`, `downloadFile`. BaseUrl: `environment.apiUrl + '/api'`
- `src/app/core/store/feature-store.base.ts` — Interfaz `BaseState<T>` y función `createBaseState<T>()` como referencia de forma del estado

### Repositories (src/app/features/<feature>/data-access/)
Cada repository extiende ApiService y expone métodos tipados para su dominio:
- `inventory.repository.ts` — Hardware y Kits. Expone `triggerDownload()` público (wrapper de `downloadFile` protected)
- `loans.repository.ts` — GestionActivos. Expone `triggerDownload()`
- `staff.repository.ts` — Personal. Expone `triggerDownload()`
- `supplies.repository.ts` — Suministros
- `custodians.repository.ts` — Custodios
- `history.repository.ts` — HistorialPrestamos + Custodios (para select). Expone `triggerDownload()`

**Convención importante:** Los métodos del repository tienen nombres propios (no sobrescriben los de ApiService): `getHardwareList`, `getLoansList`, `getStaffList`, `getSuppliesList`, `getCustodiansList`, `getHistorialList`, `updateHardware`, `updateLoan`, etc.

### Signal Stores (src/app/features/<feature>/store/)
Cada store inyecta su repository y ToastrService. Todos los signals internos son `private readonly _x = signal(...)` y exponen versión `asReadonly()`.

Stores creados:
- `inventory.store.ts` — `InventoryStore`: maneja hardware + kits con signals separados. Métodos: `loadHardware`, `loadKits`, `setPage`, `setSearch`, `startEdit`, `cancelEdit`, `updateSnap`, `saveHardwareEdit`, `saveKitEdit`, `deleteHardware`, `downloadHardwareActaPdf`, `downloadHardwareActaExcel`, `downloadKitsActaPdf`
- `loans.store.ts` — `LoansStore`: edición múltiple simultánea via `_editingIds: signal<number[]>` y `_editingMap: signal<{[id:number]:any}>`. `saveAll()` usa Promise.all + toPromise()
- `staff.store.ts` — `StaffStore`: selección para acta PDF via `_selected: signal<number[]>`, método `toggleSelected(id, checked)`
- `supplies.store.ts` — `SuppliesStore`
- `custodians.store.ts` — `CustodiansStore`
- `history.store.ts` — `HistoryStore`: carga custodios para select, luego historial por custodioId. Sin edición inline.

### Componentes actualizados (solo .ts, no HTML)
- `modules/Inventario/components/index/index.component.ts`
- `modules/Prestamos/components/index/index.component.ts`
- `modules/Personal/components/index/index.component.ts`
- `modules/Suministros/components/index/index.component.ts`
- `modules/custodios/components/index/index.component.ts`
- `modules/historial/components/index/index.component.ts`

Todos usan `inject()` function, eliminaron constructor injection, ViewChild(MatPaginator), MatTableDataSource y referencias directas a HttpService.

## Relación con HttpService antiguo
`src/app/services/Http.service.ts` sigue existiendo (no fue eliminado). Los form components y otros módulos pueden seguir usándolo. Solo los index components de las 6 features principales fueron migrados.
