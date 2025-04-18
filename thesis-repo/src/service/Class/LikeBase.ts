import { Like } from "../Types/Like";

export class LikeBase{
    protected _like!: Like[];

    get thesis(): Like[]{
        return this._like;
    }
}