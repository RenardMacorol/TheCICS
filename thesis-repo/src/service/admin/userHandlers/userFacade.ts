import { UserBase } from "../../Class/UserBase";
import { FetchUserAll } from "../../contentManagement/FetchUserAll";
import { Fetchable } from "../../Types/Fetchable";
import User from "../../Types/User";

export class UserFacade extends  UserBase implements Fetchable<User>{

    async fetch(): Promise<User[]> {
    const fetchUserAll = new FetchUserAll();
    await fetchUserAll.fetch()
    return this._user =fetchUserAll.users;
    }

    

    



}