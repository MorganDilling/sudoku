export default class Instance {
  private _onChanged: ((...args: any[]) => void)[];
  onChanged: {
    connect: (callback: (...args: any[]) => void) => () => void;
    fire: (...args: any[]) => void;
  };

  constructor() {
    this._onChanged = [];
    this.onChanged = {
      connect: (callback: (...args: any[]) => void) => {
        const length = this._onChanged.length;
        this._onChanged.push(callback);

        return () => {
          this._onChanged.splice(length, 1);
        };
      },
      fire: (...args: any[]) => {
        this._onChanged.forEach((callback) => callback(args));
      },
    };
  }
}
