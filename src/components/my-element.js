import { html } from "lit";
import { AuroElement } from "../root/auro-element";
import { FocusFeature } from "../features/focus-feature";

export class CustomElement extends AuroElement {

  updateLayout() {
    this.layout = this.layout === "default" ? "expanded" : "default";
  }

  // TODO: Implement the feature config overrides
  // static get features() {
  //   return {
  //     layout: {
  //       config: {
  //         // Configuration options for the layout feature
  //       },
  //       properties: {
  //         layout: 'disable'
  //       }
  //     }
  //   };
  // }

  static get provides() {
    return {
      'focusTracker': {
        class: FocusFeature
      }
    }
  }

  render() {
    return html`
      <div>
        <h1>Custom Element</h1>
        <p>This is a custom element that extends AuroElement.</p>
        ${this.layout}
        <slot></slot>
        <button @click="${this.updateLayout}">Update Layout</button>
      </div>
    `;
  }
}

CustomElement.register("custom-element");