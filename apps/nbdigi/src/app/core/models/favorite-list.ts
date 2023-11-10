import { Timestamp } from 'firebase/firestore';
import { Item } from './search-result.model';

export interface FavoriteList {
  id: string;
  name: string;
  items: Item[];
  timestamp: Timestamp | null;
}
