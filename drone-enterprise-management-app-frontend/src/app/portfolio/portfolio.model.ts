export interface Post {
  id: number,
  location: string,
  path: string,
  cover: string,
  description: string,
  visibility: boolean | number
  created_at: string,
  updated_at: string
}
