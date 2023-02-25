export default class Instance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onChanged: ((...args: any[]) => void)[];
  onChanged: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connect: (callback: (...args: any[]) => void) => () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fire: (...args: any[]) => void;
  };

  constructor() {
    this._onChanged = [];
    this.onChanged = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connect: (callback: (...args: any[]) => void) => {
        const length = this._onChanged.length;
        this._onChanged.push(callback);

        return () => {
          this._onChanged.splice(length, 1);
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fire: (...args: any[]) => {
        this._onChanged.forEach((callback) =>
          setTimeout(() => callback(...args), 0)
        );
      },
    };
  }
}
