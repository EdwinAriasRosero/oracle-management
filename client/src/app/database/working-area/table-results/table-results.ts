import { Component, computed, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataRow } from '../../models/model';

@Component({
  selector: 'app-table-results',
  imports: [MatTableModule],
  templateUrl: './table-results.html',
  styleUrl: './table-results.scss',
})
export class TableResults {
  dataSource = input.required<DataRow[]>();
  displayedColumnsNames = computed(() => Object.keys(this.dataSource()[0] || {}));
}
