import { Item } from '../itens/item.model';

export interface ItemTicket {
  id: number;
  ticket: any;
  item: Item;
  valor: number;
}