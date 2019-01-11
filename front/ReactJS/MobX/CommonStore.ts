import { observable } from "mobx";
import { injectable } from "inversify";

@injectable()
export default abstract class CommonStore {
    @observable
    private _fetching: boolean = false;
    @observable
    private _fetched: boolean = false;
    @observable
    private _errorMessage: string = "";
    @observable
    private _error: boolean = false;
    public get fetching() {
        return this._fetching;
    }
    public set fetching(value: boolean) {
        this._fetching = value;
    }
    public get fetched() {
        return this._fetched;
    }
    public set fetched(value: boolean) {
        this._fetched = value;
    }
    public get errorMessage() {
        return this._errorMessage;
    }
    public set errorMessage(value: string) {
        this._errorMessage = value;
    }
    public get error() {
        return this._error;
    }
    public set error(value: boolean) {
        this._error = value;
    }
}
