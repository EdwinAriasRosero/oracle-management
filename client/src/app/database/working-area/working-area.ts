import { Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { Config, SchemaNode } from '../models/model';
import { QUERIES } from '../models/queries';
import { TableResults } from './table-results/table-results';
import { DbService } from '../services/query-results.helper';
import { ResizableDirective } from '../../directives/resizable.directive';
import { SchemaTree } from '../schema-tree/schema-tree';
import { Loading } from '../../controls/loading/loading';
import { demandResource } from '../../controls/on-demand-resource';

@Component({
  selector: 'app-working-area',
  imports: [
    MonacoEditorModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    TableResults,
    ResizableDirective,
    SchemaTree,
    Loading,
  ],
  templateUrl: './working-area.html',
  styleUrl: './working-area.scss',
})
export class WorkingArea {
  code = model(QUERIES.sample);
  showSidebar = signal(true);
  config = input.required<Config>();
  query = inject(DbService);

  editorOptions = {
    theme: 'vs-dark',
    language: 'sql',
    automaticLayout: true,
    minimap: { enabled: true },
    lineNumbers: 'on',
  };

  queryResults = demandResource({
    defaultValue: [],
    loader: async (params: { config: Config; code: string }) => {
      return await this.query.executeQuery(params.config, params.code);
    },
  });

  async showNode(node: SchemaNode) {
    if (node.type === 'table' || node.type === 'view') {
      this.code.set(QUERIES.select(node.name));
      this.execute();
    } else {
      const result = await this.query.executeQuery(
        this.config(),
        QUERIES.definition(node.name)
      );

      this.code.set(result.map((r: any) => r.TEXT).join(''));
    }
  }

  async execute() {
    this.queryResults.reload({ config: this.config(), code: this.code() });
  }

  clear() {
    this.code.set('');
  }

  toggleSidebar() {
    this.showSidebar.update((current) => !current);
  }
}
