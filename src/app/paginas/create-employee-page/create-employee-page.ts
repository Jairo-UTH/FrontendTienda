import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeeService } from '../../servicios/employee-service';
import { CreateEmployeeModel } from '../../interfaces/create-employee-model';
import { form, required, validate, FormField } from '@angular/forms/signals';
import { CreateEmployeeRequest } from '../../Shared/Interface/create-employe-request';
import { GetPositionResponse } from '../../Shared/Interface/get-position-response';
import { PositionService } from '../../servicios/position-service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-employee-page',
  imports: [FormField, RouterLink],
  templateUrl: './create-employee-page.html',
  styleUrl: './create-employee-page.scss',
})
export class CreateEmployeePage implements OnInit {
  private positionService = inject(PositionService)
  private employeeService = inject(EmployeeService)

  positions = signal<GetPositionResponse[]>([]);

  employeeModel = signal<CreateEmployeeModel>({
    fullName: "",
    email: "",
    birthDate: "",
    positionId: "0",
    password: ""
  })

  employeeForm = form(this.employeeModel, (schemaPath) => {
    required(schemaPath.fullName, { message: "Nombre Completo Requerido" });
    required(schemaPath.email, { message: "Email es Requerido" });
    required(schemaPath.birthDate, { message: "Año y Fecha de Nacimiento" });
    required(schemaPath.password, { message: "Contraseña Requerida" });
    validate(schemaPath.positionId, ({ value }) => {

      if (value().match("0")) return { kind: "equals", message: "Necesita asignar el Cargo" };

      return null;

    })
  })

  ngOnInit(): void {
    this.positionService.getAll().subscribe({
      next: response => {
        this.positions.set(response.positions)  
      },
      error: (e) => { console.log(e) }
    })
  }

  onSave() {

    const request: CreateEmployeeRequest = {
      fullName: this.employeeForm.fullName().value(),
      email: this.employeeForm.email().value(),
      birthDate: this.employeeForm.birthDate().value(),
      positionId: Number(this.employeeForm.positionId().value()),
      password: this.employeeForm.password().value()
    }

    this.employeeService.create(request).subscribe({
      next: response => {
        this.resetForm();
        Swal.fire({
          text: "Empleado Registrado",
          icon: "success"
        })
      },
      error: (e) => { console.log(e) }
    })
  }

  private resetForm(): void {
    this.employeeModel.set({
      fullName: "",
      email: "",
      birthDate: "",
      positionId: "0",
      password: ""
    })
    this.employeeForm().reset();
  }

}
