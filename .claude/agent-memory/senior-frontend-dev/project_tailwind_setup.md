---
name: tailwind_css_v4_setup
description: Configuración de Tailwind CSS v4 junto a Bootstrap 5 en AdminCNE - decisiones de integración y archivos clave
type: project
---

Tailwind CSS v4.2.2 fue agregado al proyecto junto a Bootstrap 5 (coexistencia, no reemplazo).

**Decisión clave de integración:** `@import "tailwindcss"` no puede coexistir dentro de `styles.scss` porque SCSS requiere que todos los `@use` precedan cualquier otra regla. La solución fue crear un archivo CSS puro dedicado.

**Archivos creados/modificados:**
- `src/tailwind.css` — archivo nuevo con solo `@import "tailwindcss";`. Es CSS puro, no SCSS, para evitar conflicto con reglas `@use`.
- `postcss.config.mjs` — archivo nuevo con `@tailwindcss/postcss` plugin.
- `angular.json` — `src/tailwind.css` se agrega al array `styles` ANTES de `src/styles.scss`. Se eliminó `node_modules/bootstrap/dist/css/bootstrap.min.css` (Bootstrap se importa vía `@use` en `styles.scss`).
- `src/styles.scss` — NO se modificó para Tailwind. Bootstrap sigue importándose con `@use`.

**Orden del array `styles` en angular.json:**
1. `./node_modules/ngx-toastr/toastr.css`
2. `src/tailwind.css` (Tailwind v4)
3. `src/styles.scss` (Bootstrap via @use + tokens + mixins)
4. `./node_modules/@angular/material/prebuilt-themes/indigo-pink.css`

**Why:** SCSS no permite `@import` antes de `@use`. Separar Tailwind en su propio `.css` resuelve el conflicto sin tocar la cadena de imports SCSS existente.

**How to apply:** Al agregar nuevas utilidades Tailwind, solo usar clases en templates HTML. No agregar directivas Tailwind dentro de archivos `.scss` a menos que sean `@apply` (compatible con v4).

**Errores preexistentes (no relacionados a Tailwind):**
- `Can't find stylesheet 'styles/mixins'` en `menu-global.component.scss` e `index.component.scss` del branch actual del worktree.
- `TS2551: getUserName does not exist` en `Prestamos/index.component.ts`.
Estos errores existían antes de la integración de Tailwind (verificado con `git stash` + build limpio).
