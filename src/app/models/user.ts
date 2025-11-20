// src/app/models/user.ts
export type UserRole = 'ADMIN' | 'CLIENT' | 'DRIVER' | 'MECHANIC';
export class User {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public role: UserRole,
    ) {}
}