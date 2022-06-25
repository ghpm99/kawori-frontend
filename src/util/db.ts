import Dexie, { Table } from 'dexie';

export interface Facetexture {
  id?: number
  name: string
  class?: number
  show: boolean
  order: number
  image: Blob
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  facetexture!: Table<Facetexture>;

  constructor() {
    super('kawori');
    this.version(1).stores({
      facetexture: '++id, name, class, show, order, image' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();