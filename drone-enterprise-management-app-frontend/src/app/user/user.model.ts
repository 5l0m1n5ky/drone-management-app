export class User {
  constructor(
    public id: string,
    public email: string,
    public privileges: string,
    public suspended: boolean
  ) { }
}
