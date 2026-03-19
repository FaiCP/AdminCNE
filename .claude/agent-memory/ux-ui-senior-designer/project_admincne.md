---
name: AdminCNE Project Context
description: Panel de administracion gubernamental CNE - Angular 19, Material, Bootstrap - gestiona inventario, prestamos, personal, suministros, reportes
type: project
---

AdminCNE es un panel de administracion para el Consejo Nacional Electoral (CNE) que gestiona inventario de equipos tecnologicos, prestamos, personal, suministros, custodios, historial y reportes.

**Stack tecnico:**
- Angular 19 + Angular Material 19 (tema prebuilt purple-green) + Bootstrap 5.3
- SCSS como preprocesador
- chart.js + ng2-charts para graficos
- ngx-toastr para notificaciones
- ngx-bootstrap para datepicker

**Estado actual del diseno:**
- Usa tema prebuilt purple-green de Material (no customizado)
- Colores hardcodeados: #3F51B5 (indigo) como fondo principal, #000000 en toolbars/tabs
- Layout basico: mat-toolbar arriba + grid Bootstrap para dashboard cards
- Sin sidebar real - usa toolbar con navegacion por cards en home
- Sin design tokens ni variables CSS centralizadas
- Componentes dispersos sin sistema de diseno unificado

**Modulos:** Login, Dashboard (global/index), Inventario, Prestamos, Personal, Suministros, Custodios, Historial, Reportes

**Why:** El proyecto necesita un design system escalable para profesionalizar la interfaz gubernamental.
**How to apply:** Toda recomendacion de diseno debe ser compatible con Angular Material 19 + Bootstrap 5, usar SCSS, y poder implementarse incrementalmente sin reescribir todo.
