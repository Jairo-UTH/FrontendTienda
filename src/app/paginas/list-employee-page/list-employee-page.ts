import { Component, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { PositionService } from '../../servicios/position-service';
import { EmployeeService } from '../../servicios/employee-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetEmployeeResponse } from '../../Shared/Interface/get-employee-response';
import { GetPositionResponse } from '../../Shared/Interface/get-position-response';
import { EmployeeModel } from '../../interfaces/employee-model';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { UpdateEmployeeRequest } from '../../Shared/Interface/update-employee-request';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-employee-page',
  imports: [RouterLink, FormField],
  templateUrl: './list-employee-page.html',
  styleUrl: './list-employee-page.scss',
})
export class ListEmployeePage implements OnInit {

  private positionService = inject(PositionService)
  private employeeService = inject(EmployeeService)
  private modalService = inject(NgbModal)

  employees = signal<GetEmployeeResponse[]>([])
  positions = signal<GetPositionResponse[]>([])

  employeeModel = signal<EmployeeModel>({
    employeeId: "0",
    fullName: "",
    email: "",
    birthDate: "",
    positionId: "0",
    password: ""  
  })

  employeeForm = form(this.employeeModel, (schemaPath) => {
    required(schemaPath.fullName, { message: "Nombre Completo Requerido" });
    required(schemaPath.email, { message: "Email Es Requerido" });
    required(schemaPath.birthDate, { message: "Fecha de Nacimiento Requerido" });
    validate(schemaPath.positionId, ({ value }) => {

      if (value().match("0")) return { kind: "equals", message: "Cargo Requerido" };

      return null;
    })
  })

  getPositions() {
    this.positionService.getAll().subscribe({
      next: response => {
        this.positions.set(response.positions)  
      },
      error: (e) => { console.log(e) }
    })
  }
  getEmployees() {
    this.employeeService.getAll().subscribe({
      next: response => {
        this.employees.set(response.employees)   
      },
      error: (e) => { console.log(e) }
    })
  }

  ngOnInit(): void {
    this.getPositions()
    this.getEmployees()
  }

  openModal(modalHtml: TemplateRef<any>, id: number) {
    this.employeeService.getById(id).subscribe({
      next: response => {
        const birthDate = new Date(response.birthDate)
        this.employeeModel.set({
          employeeId: response.employeeId.toString(),
          fullName: response.fullName,
          email: response.email,
          birthDate: birthDate.toISOString().split("T")[0],
          positionId: response.positionId.toString(),
          password: ""   
        })
      }, error: (e) => { console.log(e) }
    })
    this.modalService.open(modalHtml, { size: "lg" })
  }

    saveChanges() {
    const password = this.employeeForm.password().value()

    const request: UpdateEmployeeRequest = {
      employeeId: Number(this.employeeForm.employeeId().value()),
      fullName: this.employeeForm.fullName().value(),
      email: this.employeeForm.email().value(),
      birthDate: this.employeeForm.birthDate().value(),
      positionId: Number(this.employeeForm.positionId().value())
    }

    if (password.trim().length > 0) request.password = password   

    this.employeeService.update(request).subscribe({
      next: response => {

        Swal.fire({
          text: "Empleado Editado!",
          icon: "success"
        })
        this.modalService.dismissAll();
        this.getEmployees()
      },
      error: (e) => { console.log(e) }
    })

  }


  delete(id: number) {
    Swal.fire({
      title: "Esta Seguro?",
      text: "No podra revertir esta accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Remuevelo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.delete(id).subscribe({
          next: response => {
            Swal.fire({ text: "Empleado Removido!", icon: "success" })
            this.getEmployees()
          },
          error: (e) => { console.log(e) }
        })
      }
    });
  }
}
