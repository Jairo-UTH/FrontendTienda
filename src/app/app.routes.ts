import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProduListPage } from './paginas/produ-list-page/produ-list-page';
import { CarroPage } from './paginas/carro-page/carro-page';
import { ComprasPage } from './paginas/compras-page/compras-page';
import { NewProduPage } from './paginas/new-produ-page/new-produ-page';
import { ListEmployeePage } from './paginas/list-employee-page/list-employee-page';
import { CreateEmployeePage } from './paginas/create-employee-page/create-employee-page';
import { LoginPage } from './paginas/login-page/login-page';
import { gerenteGuard } from './guards/gerente-guards';
import { MovimientosPage } from './paginas/movimientos-page/movimientos-page';
export const routes: Routes = [

  { path: 'login', component: LoginPage },

  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ProduListPage },
      { path: 'cart', component: CarroPage },
      { path: 'purchase', component: ComprasPage },
      { path: 'newProduct', component: NewProduPage, canActivate: [gerenteGuard] },
      { path: 'createEmployee', component: CreateEmployeePage, canActivate: [gerenteGuard] },
      { path: 'listEmployee', component: ListEmployeePage, canActivate: [gerenteGuard] },
      { path: 'movimientos', component: MovimientosPage, canActivate: [gerenteGuard] },
    ]
  }

];
