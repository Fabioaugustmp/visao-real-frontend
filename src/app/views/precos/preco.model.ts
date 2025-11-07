import { Item } from '../itens/item.model';

export interface Preco {
  id: number;
  item: Item;
  valor: number;
}

