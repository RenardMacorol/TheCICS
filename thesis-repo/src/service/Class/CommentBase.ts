import { Comment } from "../Types/Comment";

export class CommentBase{
    protected _comment!: Comment[];

    get thesis(): Comment[]{
        return this._comment;
    }
}