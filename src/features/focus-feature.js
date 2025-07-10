import { AuroFeature } from "../root/auro-feature";

export class FocusFeature extends AuroFeature {

  constructor(host, config) {
    super(host, config);
    this._init();
  }

  static get properties() {
    return {
      hasFocus: { type: Boolean, attribute: "hasFocus", reflect: true }
    }
  }

  _init() {

    this._setDefaults();
    this._addEventListeners();
  }

  get _onFocusCallback() {
    return typeof this.config.onFocus === 'function' ? this.config.onFocus : () => {};
  }

  get _onBlurCallback() {
    return typeof this.config.onBlur === 'function' ? this.config.onBlur : () => {};
  }

  _addEventListeners() {
    
    this.host.addEventListener('focus', () => {
      this.hasFocus = true;
      this._onFocusCallback();
    });

    this.host.addEventListener('blur', () => {
      this.hasFocus = false;
      this._onBlurCallback();
    });
  }

  _setDefaults() {
    this.hasFocus = false; // Default focus state
  }
}