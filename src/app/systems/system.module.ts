import { DetailComponent } from './detail/detail.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../share/material-module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from "./products/products.component";
import { AddProductComponent } from './add-product/add-product.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
    // { path:'detail-doctor/:id',component:DetailDoctorComponent},
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductsComponent },
    { path: 'detail', component: DetailComponent },
    { path: 'add', component: AddProductComponent },
    { path: 'edit/:key', component: EditProductComponent }
]

@NgModule({
    declarations: [
        ProductsComponent,
        DetailComponent,
        AddProductComponent,
        EditProductComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        AngularEditorModule
    ]
})
export class SystemsModule { }