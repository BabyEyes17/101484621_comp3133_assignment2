import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule,
    NavbarComponent
  ],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  form: FormGroup;
  loading = false;
  photoPreview: string | null = null;
  photoBase64: string | null = null;

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      department: ['', Validators.required],
      date_of_joining: ['', Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Please select an image file', 'Close', { duration: 3000 });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.photoBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoPreview = null;
    this.photoBase64 = null;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const values = this.form.value;
    const input: any = {
      ...values,
      salary: parseFloat(values.salary),
      date_of_joining: values.date_of_joining instanceof Date
        ? values.date_of_joining.toISOString().split('T')[0]
        : values.date_of_joining
    };
    if (this.photoBase64) input.employee_photo = this.photoBase64;

    this.employeeService.addEmployee(input).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.snackBar.open('Employee added successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        } else {
          this.snackBar.open(res.message || 'Failed to add employee', 'Close', { duration: 4000 });
        }
      },
      error: () => { this.loading = false; this.snackBar.open('An error occurred', 'Close', { duration: 3000 }); }
    });
  }

  get f() { return this.form.controls; }
}
