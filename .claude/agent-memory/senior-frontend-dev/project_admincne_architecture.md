---
name: AdminCNE Project Architecture
description: Estructura del proyecto AdminCNE - módulos, convenciones de estilo, sistema de diseño y decisiones arquitectónicas clave
type: project
---

## Stack y estructura

- Angular 19, NgModules (NO standalone para componentes de negocio), `standalone: false` explícito en todos los componentes
- `GlobalModule` actúa como módulo compartido: exporta Material, RouterModule, CommonModule, ToastrModule, FormsModule
- Estructura de carpetas: `src/app/modules/<nombre-modulo>/components/<componente>/`
- Proyecto identificado como "Hospital" en angular.json (nombre heredado), pero es sistema AdminCNE
- `stylePreprocessorOptions.includePaths: ["."]` configurado - los @use de SCSS deben partir desde la raíz del proyecto

## Sistema de diseño v2.0 (implementado en marzo 2026)

- Design tokens en `src/styles/_tokens.scss` (CSS Custom Properties bajo prefijo `--cne-*`)
- Mixins en `src/styles/_mixins.scss` - exportar con `@use 'styles/mixins' as m` desde componentes
- Tema Angular Material: `indigo-pink.css` (reemplazó `purple-green.css`)
- Fuente principal: Inter (Google Fonts), fuente mono: JetBrains Mono
- Layout: sidebar fijo 260px / colapsado 72px, topbar 64px altura

**Why:** Rediseño completo desde toolbar plana + cards Bootstrap hacia panel de administración moderno con sidebar fijo.
**How to apply:** Al crear nuevos componentes, usar `@use 'styles/mixins' as m` y CSS variables `--cne-*` en lugar de colores hardcoded.

## Colores semánticos disponibles para badges/iconos

- `primary` → azul institucional (#1B3A5C)
- `success` → verde (#2E7D32)
- `warning` → naranja (#E65100)
- `accent`  → dorado institucional (#D4880F)
- `info`    → azul claro (#0277BD)
- `error`   → rojo (#C62828)

## Rutas del sistema

- `/home/index` - Dashboard
- `/inventario/index`, `/prestamos/index`, `/suministros/index`
- `/personal/index`, `/custodio/index`, `/historial/index`, `/reportes/index`
- `/login/index`

## Componentes del layout global

- `MenuGlobalComponent` - sidebar + topbar + router-outlet (wrapper de toda la app)
- `IndexComponent` - dashboard home con KPI cards

## Responsive breakpoints

- Mobile: < 768px → sidebar oculto, hamburger visible
- Tablet: 768-1024px → sidebar colapsado (72px)
- Desktop: > 1024px → sidebar expandido (260px)
