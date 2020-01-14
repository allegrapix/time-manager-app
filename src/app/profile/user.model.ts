export class User {
  constructor(
    public _id: string,
    public name: string,
    public email: string, 
    public createdAt: Date,
    public updatedAt: Date,
    public preferredWorkingHours: number,
    private _tokenExpirationDate: Date,
    private _token: string,
    public avatar?: any
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}