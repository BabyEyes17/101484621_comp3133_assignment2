import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule,
    NavbarComponent
  ],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  fetchLoading = true;
  employeeId = '';
  photoPreview: string | null = null;
  photoBase64: string | null = null;
  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.searchById(this.employeeId).subscribe({
      next: emp => {
        this.fetchLoading = false;
        if (!emp) { this.router.navigate(['/employees']); return; }
        this.photoPreview = emp.employee_photo || null;
        const doj = emp.date_of_joining ? new Date(parseInt(emp.date_of_joining)) : null;
        this.form.patchValue({ ...emp, date_of_joining: doj });
      },
      error: () => { this.fetchLoading = false; this.router.navigate(['/employees']); }
    });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.photoBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
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

    this.employeeService.updateEmployee(this.employeeId, input).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/employees', this.employeeId, 'view']);
        } else {
          this.snackBar.open(res.message || 'Update failed', 'Close', { duration: 4000 });
        }
      },
      error: () => { this.loading = false; this.snackBar.open('An error occurred', 'Close', { duration: 3000 }); }
    });
  }

  get f() { return this.form.controls; }
}
