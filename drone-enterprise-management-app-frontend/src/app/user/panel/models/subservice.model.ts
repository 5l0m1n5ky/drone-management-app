export interface Subservice {
  id: number,
  service_id: number,
  subservice: string,
  unit_amount_min: number,
  unit_amount_max: number,
  unit_price: number,
  created_at: Date,
  updated_at: Date,
}
