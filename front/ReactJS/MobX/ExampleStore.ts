import { observable } from "mobx";
import { Doctor } from "./types";
import CommonStore from "./CommonStore";


export default class DoctorStore extends CommonStore {
    @observable
    private _data: Doctor;
    public get firstName() {
        return this._data.firstName;
    }
    public set firstName(value: string) {
        this._data.firstName = value;
    }
    public get lastName() {
        return this._data.lastName;
    }
    public set lastName(value: string) {
        this._data.lastName = value;
    }
    public get middleName() {
        return this._data.lastName;
    }
    public set middleName(value: string) {
        this._data.lastName = value;
    }
    public get avatar() {
        return this._data.avatar;
    }
    public get office() {
        return this._data.office;
    }
    public set office(id: string) {
        this._data.office = id;
    }
}
