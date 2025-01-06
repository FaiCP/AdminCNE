import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { prestamosRoutes } from "./modules/Prestamos/Prestamos.routing";
import { globalRoutes } from "./modules/global/global.routing";
import { suministrosRoutes } from "./modules/Suministros/Suministros.routing";
import { inventarioRoutes } from "./modules/Inventario/Inventario.routing";
import { personalRoutes } from "./modules/Personal/Personal.routing";
import { homePagesRoutes } from "./modules/home-page/home-page.routing";
import { loginRoutes } from "./modules/login/login.routing";
import { historialRoutes } from "./modules/historial/historial.routing";
import { CustodioRoutes } from "./modules/custodios/Custodio.routing";
import { reportesRoutes } from "./modules/reportes/Reportes.routing";

@NgModule({
  imports: [RouterModule.forChild([
    ...globalRoutes,
    ...suministrosRoutes,
    ...prestamosRoutes,
    ...inventarioRoutes,
    ...personalRoutes,
    ...homePagesRoutes,
    ...loginRoutes,
    ...historialRoutes,
    ...CustodioRoutes,
    ...reportesRoutes
  ])],
  exports:[RouterModule]
})
export class RutasModule{}
