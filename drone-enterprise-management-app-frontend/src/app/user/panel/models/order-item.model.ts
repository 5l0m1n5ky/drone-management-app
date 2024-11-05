export interface OrderItem {
  id: Number
  service: String,
  subservice: String,
  amount: Number,
  bgMusic: String,
  format: String,
  report: Boolean,
  latitude: Number,
  longitude: Number,
  date: Date,
  alias: String,
  price: Number,
  state: String,
  stateColor: String
  customerName: String,
  customerSurname: String,
  nip: Number,
  streetName: String,
  streetNumber: Number,
  apartmentNumber: Number,
  zip: String,
  city: String,
  customerComment: String,
  email: Number,
  tel: Number,
  isReportReady: boolean
}
