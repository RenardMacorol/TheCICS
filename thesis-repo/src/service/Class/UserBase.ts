import Users from "../Types/User";

export class UserBase{
    protected _user!: Users[];

    get users(): Users[]{
        return this._user;
    }
}