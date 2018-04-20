import { Item } from './search-result.model';

export interface FavoriteList {
  id?: string;
  name: string;
  items: Item[];
}
