import Debug from "./Debug";

/**
 * @description a wrapper class for the config.json file -- loads it and stores it in the _data property. Accessible via data getter.
 */
class GameConfig {
  private _data: any;
  private _initialized: boolean;

  constructor() {
    this._initialized = false;
    Debug.exposeGlobal(this, 'gameConfig');
  }

  get data(): any {
    if (!this._initialized) {
      Debug.error("Can not access config before initializing it!");
      return null;
    } else {
      return this._data;
    }
  }

  /**
   * @description Load a config.json file from the specified path
   * @param path the path to load the config json data from
   */
  public loadConfig(path: string) {
    let that = this;

    return new Promise((resolve: Function, reject: Function) => {

      var request = new XMLHttpRequest();
      request.open('GET', path, true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          var data = JSON.parse(this.response);
          that._data = data;
          that._initialized = true;
          resolve(data);
        } else {
          reject('ERROR');

        }
      };

      request.onerror = function() {
        reject("ERROR");
      };

      request.send();

    });
  }
}

export default GameConfig;