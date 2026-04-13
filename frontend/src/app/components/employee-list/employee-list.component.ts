import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatToolbarModule, MatProgressSpinnerModule, MatDialogModule,
    MatSnackBarModule, MatChipsModule, MatTooltipModule, MatDividerModule,
    NavbarComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['photo', 'name', 'email', 'designation', 'department', 'salary', 'actions'];
  dataSource = new MatTableDataSource<Employee>();
  loading = false;
  searchForm: FormGroup;
  isSearching = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      searchType: ['department'],
      searchValue: ['']
    });
  }

  ngOnInit(): void { this.loadEmployees(); }

  loadEmployees(): void {
    this.loading = true;
    this.isSearching = false;
    this.employeeService.getAllEmployees().subscribe({
      next: data => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => { this.loading = false; this.snackBar.open('Failed to load employees', 'Close', { duration: 3000 }); }
    });
  }

  onSearch(): void {
    const { searchType, searchValue } = this.searchForm.value;
    if (!searchValue?.trim()) { this.loadEmployees(); return; }
    this.loading = true;
    this.isSearching = true;
    const dept = searchType === 'department' ? searchValue : undefined;
    const desig = searchType === 'designation' ? searchValue : undefined;
    this.employeeService.searchByDeptOrDesignation(dept, desig).subscribe({
      next: data => {
        this.dataSource.data = data;
        setTimeout(() => { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  clearSearch(): void {
    this.searchForm.reset({ searchType: 'department', searchValue: '' });
    this.loadEmployees();
  }

  deleteEmployee(id: string, name: string): void {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    this.employeeService.deleteEmployee(id).subscribe({
      next: res => {
        if (res.success) {
          this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
          this.loadEmployees();
        } else {
          this.snackBar.open(res.message, 'Close', { duration: 3000 });
        }
      },
      error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 })
    });
  }

  getInitials(first: string, last: string): string {
    return `${first[0] || ''}${last[0] || ''}`.toUpperCase();
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(salary);
  }
}
