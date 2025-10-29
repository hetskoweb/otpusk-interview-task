import type { Hotel } from "./Hotel";

export interface Tour {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID: string;
  hotel?: Hotel;
}