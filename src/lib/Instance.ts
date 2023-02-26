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
        let active = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedCallback = (...args: any[]) =>
          active ? callback(...args) : undefined;

        this._onChanged.push(wrappedCallback);

        return () => (active = false);
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
