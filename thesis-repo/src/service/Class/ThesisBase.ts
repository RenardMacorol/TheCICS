import Thesis from "../Types/Thesis";

export class ThesisBase{
    protected _thesis!: Thesis[];

    get thesis(): Thesis[]{
        return this._thesis;
    }
}