import {
  Component,
  inject,
  input,
  output,
  Pipe,
  PipeTransform,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Config, SchemaNode, SchemaType } from '../models/model';
import { QUERIES } from '../models/queries';
import { DbService } from '../services/query-results.helper';
import { Loading } from '../../controls/loading/loading';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Pipe({
  name: 'filterNode',
})
export class FilterNodePipe implements PipeTransform {
  transform(value: SchemaNode[], filter: string): SchemaNode[] {
    return value.map((node) => ({
      ...node,
      children: node.children?.filter((x) =>
        x.name.toUpperCase().includes(filter.toUpperCase())
      ),
    }));
  }
}

@Component({
  selector: 'app-schema-tree',
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    Loading,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    FilterNodePipe,
  ],
  templateUrl: './schema-tree.html',
  styleUrl: './schema-tree.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SchemaTree {
  query = inject(DbService);
  config = input.required<Config>();
  selectedNode = signal<SchemaNode | null>(null);
  onDblClickNode = output<SchemaNode>();

  schema = resource({
    defaultValue: [],
    params: () => ({ config: this.config() }),
    loader: async ({ params }) => {
      let results = await Promise.all([
        this.toNodeAsync(params.config, QUERIES.tables, 'table'),
        this.toNodeAsync(params.config, QUERIES.views, 'view'),
        this.toNodeAsync(params.config, QUERIES.packages, 'package'),
        this.toNodeAsync(params.config, QUERIES.procedures, 'procedure'),
        this.toNodeAsync(params.config, QUERIES.functions, 'function'),
      ]);

      let nodes: SchemaNode[] = [
        { name: 'Tables', children: results[0] },
        { name: 'Views', children: results[1] },
        { name: 'Packages', children: results[2] },
        { name: 'Procedures', children: results[3] },
        { name: 'Functions', children: results[4] },
      ];

      return nodes;
    },
  });

  async toNodeAsync(config: Config, query: string, type: SchemaType) {
    const data = await this.query.executeQuery(config, query);
    const firstRow = Object.keys(data[0] || {})[0];
    return data.map((row) => ({
      name: row[firstRow],
      type,
    }));
  }

  childrenAccessor = (node: SchemaNode) => node.children ?? [];

  hasChild = (_: number, node: SchemaNode) =>
    !!node.children && node.children.length > 0;

  selectNode(node: SchemaNode) {
    this.selectedNode.set(node);
  }

  openNode(node: SchemaNode) {
    this.onDblClickNode.emit(node);
  }
}
