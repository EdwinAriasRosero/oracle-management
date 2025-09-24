export interface DataRow extends Config {}

export interface MetaData {
  name: string;
}

export interface QueryResults {
  metaData: MetaData[];
  rows: any[][];
}

export type SchemaType =
  | 'table'
  | 'view'
  | 'procedure'
  | 'package'
  | 'function';

export interface SchemaNode {
  name: string;
  type?: SchemaType;
  children?: SchemaNode[];
}

export interface TabConfig {
  name: string;
  config: any;
}

export interface Config {
  [key: string]: any;
}
