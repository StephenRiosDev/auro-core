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
          onFocus: () => console.log('Element focused!'),
          onBlur: () => console.log('Element blurred!')
        }
      }
    };
  }

  updateLayout() {
    this.layout = this.layout === "classic" ? "emphasized" : "classic";
  }

  updateSize() {
    this.size = this.size === "md" ? "lg" : "md";
  }

  updateShape() {
    this.shape = this.shape === "pill" ? "rounded" : "pill";
  }

  updateOnDark() {
    this.onDark = !this.onDark;
  }

  renderLayoutClassic() {
    return html`
      <div class="${classMap(this.layoutClasses)}">
        <p>Classic Layout</p>
      </div>
    `;
  }

  renderLayoutEmphasized() {
    return html`
      <div class="${classMap(this.layoutClasses)}">
        <p>Emphasized Layout</p>
      </div>
    `;
  }

  renderLayoutSnowflake() {
    return html`
      <div class="${classMap(this.layoutClasses)}">
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

  renderLayout() {
    const layoutRenderer = this.renderers[this.layout] || this.renderers["default"];
    return html`
      <button @click="${this.updateLayout}">Toggle Layout</button>
      <button @click="${this.updateSize}">Toggle Size</button>
      <button @click="${this.updateShape}">Toggle Shape</button>
      <button @click="${this.updateOnDark}">Toggle On Dark</button>
      ${layoutRenderer.call(this)}
      <p>Shape: ${this.shape}, Size: ${this.size}, On Dark: ${this.onDark}</p>
      <p>Focus state: ${this.hasFocus ? 'Focused' : 'Not Focused'}</p>
    `
  }
}

CustomElement.register("custom-element");