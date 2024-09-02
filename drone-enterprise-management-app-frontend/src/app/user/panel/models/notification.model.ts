export interface Notification {
  id: Number,
  userId: Number,
  title: String,
  content: String,
  comment: String,
  state: String,
  seen: Boolean,
  createdAt: Date
}
