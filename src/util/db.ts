import Dexie, { Table } from 'dexie';

export interface Facetexture {
  id?: number
  name: string
  class?: number
  show: boolean
  order: number
  image: Blob
  upload: boolean
}

export interface Background {
  id?:number
  image: Blob
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  facetexture!: Table<Facetexture>;
  background!: Table<Background>;

  constructor() {
    super('kawori');
    this.version(3).stores({
      facetexture: '++id, name, class, show, order, image, upload',
      background: '++id, image'
    });
  }
}

export const db = new MySubClassedDexie();