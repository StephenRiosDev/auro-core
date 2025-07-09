import { AuroFeature } from "./auro-feature";

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
    this.hasFocus = false;
    this.host.setAttribute('tabindex', '0'); // Make the host focusable
    this.host.addEventListener('focus', () => {
      this.hasFocus = true;
    });

    this.host.addEventListener('blur', () => {
      this.hasFocus = false;
    });
  }
}