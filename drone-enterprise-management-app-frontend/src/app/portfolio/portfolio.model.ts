export interface Post {
  id: number,
  hidden: boolean,
  location: string,
  type_id: string,
  path: string,
  description: string,
  reactions: number,
  hidden_reactions: boolean,
  created_at: string,
  updated_at: string
}
