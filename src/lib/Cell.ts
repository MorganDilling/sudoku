import Instance from './Instance';
import Coordinate from './Coordinate';

export default class Cell extends Instance {
  private _coordinate: Coordinate;
  private _value: number;

  constructor(coordinate: Coordinate, value?: number) {
    super();
    this._coordinate = coordinate;
    this._value = Math.min(Math.max(value || 0, 0), 9);
  }

  get coordinate() {
    return this._coordinate;
  }

  set coordinate(coordinate: Coordinate) {
    this._coordinate = coordinate;
    this.onChanged.fire();
  }

  get value() {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    this.onChanged.fire();
  }
}
