import { html } from "lit";
import { AuroElement } from "../root/auro-element";
import { FocusFeature } from "../features/focus-feature";
import { classMap } from "lit/directives/class-map.js";

export class CustomElement extends AuroElement {

  static get provides() {
    return {
      'focusTracker': {
        class: FocusFeature,
        config: {
          onFocus: () => console.log('Element focused! - From onFocus config'),
          onBlur: () => console.log('Element blurred! - From onBlur config'),
          makeHostFocusable: true
        }
      }
    };
  }

  static get features() {
    return {
      'layout': {
        config: {
          useLayoutProp: false
        }
      }
    }
  }

  renderLayoutClassic() {
    return html`
      <div class="${classMap(this.layoutClasses || {})}">
        <p>Classic Layout</p>
      </div>
    `;
  }

  renderLayoutEmphasized() {
    return html`
      <div class="${classMap(this.layoutClasses || {})}">
        <p>Emphasized Layout</p>
      </div>
    `;
  }

  renderLayoutSnowflake() {
    return html`
      <div class="${classMap(this.layoutClasses || {})}">
        <p>Snowflake Layout</p>
      </div>
    `;
  }

  renderers = {
    "classic": this.renderLayoutClassic,
    "emphasized": this.renderLayoutEmphasized,
    "snowflake": this.renderLayoutSnowflake,
    "default": this.renderLayoutClassic
  }

  get layoutRenderer() {
    const layoutRenderer = this.renderers[this.layout] || this.renderers["default"];
    return layoutRenderer.bind(this);
  }

  updateLayout() { this.layout && (this.layout = this.layout === "classic" ? "emphasized" : "classic"); }
  updateSize() { this.size && (this.size = this.size === "md" ? "lg" : "md"); }
  updateShape() { this.shape && (this.shape = this.shape === "pill" ? "rounded" : "pill"); }
  updateOnDark() { typeof this.onDark !== 'undefined' && (this.onDark = !this.onDark); }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('hasFocus')) console.log(`Focus state changed: ${this.hasFocus}. - From updated method`);
  }

  renderLayout() {
    return html`
      <button @click="${this.updateLayout}">Toggle Layout</button>
      <button @click="${this.updateSize}">Toggle Size</button>
      <button @click="${this.updateShape}">Toggle Shape</button>
      <button @click="${this.updateOnDark}">Toggle On Dark</button>
      ${this.layoutRenderer()}
      <p>
        Shape: ${this.shape}<br> 
        Size: ${this.size}<br> 
        On Dark: ${this.onDark}
      </p>
      <p>
        Layout Classes:<br>
        ${Object.entries(this.layoutClasses || {}).map(([key, value]) => html`<span>${key}</span><br>`)}
      </p>
      <p>Focus state: ${this.hasFocus ? 'Focused' : 'Not Focused'}</p>
    `
  }
}

CustomElement.register("custom-element");