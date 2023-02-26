export default class Instance {
  private _onChanged: ((...args: unknown[]) => void)[];
  onChanged: {
    connect: (callback: (...args: unknown[]) => void) => () => void;
    fire: (...args: unknown[]) => void;
  };

  constructor() {
    this._onChanged = [];
    this.onChanged = {
      connect: (callback: (...args: unknown[]) => void) => {
        let active = true;
        const wrappedCallback = (...args: unknown[]) =>
          active ? callback(...args) : undefined;

        this._onChanged.push(wrappedCallback);

        return () => (active = false);
      },
      fire: (...args: unknown[]) => {
        this._onChanged.forEach((callback) =>
          setTimeout(() => callback(...args), 0)
        );
      },
    };
  }
}
