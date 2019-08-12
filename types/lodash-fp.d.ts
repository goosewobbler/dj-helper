declare module 'lodash/fp' {
  export function contains(): boolean;
  export function lowerCase(a: string): string;
  export function map(f: Function, i: any): any;
  export function uniq(a: any[]): any[];
  export function assign(a: any, b: any): any;
  export function get(a: string): Function;
  export function isObject(a: any): boolean;
  export function some(a: Function, b?: any[]): Function;
  export function sortBy(a: Function): Function;
  export function deburr(a: string): string;
  export function find(a: Function, b: any[]): any;
  export function trim(a: string): string;
  export function throttle(a: any, b: any): Function;
}
