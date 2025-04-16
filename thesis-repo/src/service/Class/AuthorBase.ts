import { Author } from "../Types/Author";

export class AuthorBase{
    protected _author!: Author[];

    get thesis(): Author[]{
        return this._author;
    }
}