export class UserData {
    constructor(
        public id: number,
        public email: string,
        public privileges: string,
        public email_verified_at: Date | null,
        public suspended: boolean,
        public created_at: Date
    ) { }
}
