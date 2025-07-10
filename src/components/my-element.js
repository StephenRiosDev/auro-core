import { html } from "lit";
import { AuroElement } from "../root/auro-element";
import { FocusFeature } from "../features/focus-feature";
import { classMap } from "lit/directives/class-map.js";

export class CustomElement extends AuroElement {

  updateLayout() {
    this.layout = this.layout === "classic" ? "emphasized" : "classic";
  }

  static get provides() {
    return {
      'focusTracker': {
        class: FocusFeature
      }
    }
  }

  render() {
    return html`
      <div class="${classMap(this.layoutClasses)}">
        <h1>Custom Element</h1>
        <h2>Features POC</h2>
        <p>This is a custom element that extends AuroElement.</p>
        <p> Check this element for cool layout classes being applied! </p>
        <p> Focus is also tracked! </p>
        <p>The Layout type is currently: ${this.layout}</p>
        <p>Shape: ${this.shape}, Size: ${this.size}, On Dark: ${this.onDark}</p>
        <p>Focus state: ${this.hasFocus ? 'Focused' : 'Not Focused'}</p>
        <p>Layout Classes: ${JSON.stringify(this.layoutClasses)}</p>
        <slot></slot>
        <button @click="${this.updateLayout}">Update Layout</button>
      </div>
    `;
  }
}

CustomElement.register("custom-element");