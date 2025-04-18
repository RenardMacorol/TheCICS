import { View } from "../Types/View";

export class ViewBase{
    protected _view!: View[];

    get thesis(): View[]{
        return this._view;
    }
}