export interface TypeaheadResponse {
  _embedded: Embedd;
}

interface Embedd {
  items: Item[];
}

interface Item {
  label: string;
  value: string;
  count: number;
}
