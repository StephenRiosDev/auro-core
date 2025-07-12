import { html } from "lit";
import { AuroElement } from "../root/auro-element";
import { FocusFeature } from "../features/focus-feature";
import { CounterFeature } from "../features/counter-feature";
import { LifecycleLoggerFeature } from "../features/lifecycle-logger-feature";
import { classMap } from "lit/directives/class-map.js";

/**
 * <feature-demo-element>
 * 
 * This element demonstrates the full power of the Auro feature system:
 * - Multiple features (layout, focus, counter, lifecycle logger)
 * - Feature configuration and property merging
 * - Disabling features and properties
 * - Lifecycle hooks
 * - Living documentation via code and comments
 * 
 * Usage:
 *   <feature-demo-element></feature-demo-element>
 * 
 * Features:
 *   - Layout: provides layout, shape, size, onDark, layoutClasses
 *   - Focus: tracks focus state, makes host focusable, logs focus/blur
 *   - Counter: exposes count property, increment/decrement methods, fires events
 *   - LifecycleLogger: logs lifecycle events to console
 */
export class FeatureDemoElement extends AuroElement {

  static get provides() {
    return {
      // layout feature is inherited from AuroElement
      Focus: { class: FocusFeature, config: { makeHostFocusable: false } },
      Counter: { class: CounterFeature, config: { start: 5 } },
      LifecycleLogger: { class: LifecycleLoggerFeature }
    };
  }

  // Override any existing configs with these specific properties in this class
  // This features object acts a single source of truth for features in a given class
  // It overrides all feature configs at all levels at this level and below
  static get features() {
    return {
      // Override layout config and properties
      Layout: {
        config: { layout: "emphasized", shape: "rounded", size: "lg", onDark: false },
        properties: {
          // Example: disable the 'onDark' property from layout feature
          onDark: "disable"
        }
      },
      // Enable focus feature with custom callbacks
      Focus: {
        config: {
          onFocus: () => console.log("Demo: Focused!"),
          onBlur: () => console.log("Demo: Blurred!"),
          makeHostFocusable: true
        }
      },
      // Counter feature: override start value
      Counter: {
        config: { start: 10 }
      },
    };
  }

  // Example: disable a feature entirely
  // static get features() {
  //   return { ...super.features, focus: "disable" };
  // }

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

  renderers = {
    classic: this.renderLayoutClassic,
    emphasized: this.renderLayoutEmphasized,
    default: this.renderLayoutClassic
  }

  get layoutRenderer() {
    const layoutRenderer = this.renderers[this.layout] || this.renderers["default"];
    return layoutRenderer.bind(this);
  }

  updateLayout() { this.layout && (this.layout = this.layout === "classic" ? "emphasized" : "classic"); }
  updateSize() { this.size && (this.size = this.size === "md" ? "lg" : "md"); }
  updateShape() { this.shape && (this.shape = this.shape === "pill" ? "rounded" : "pill"); }

  // Counter feature methods
  increment() { this.Counter && this.Counter.increment(); }
  decrement() { this.Counter && this.Counter.decrement(); }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('hasFocus')) {
      console.log(`Focus state changed: ${this.hasFocus}.`);
    }
    if (changedProperties.has('count')) {
      console.log(`Counter changed: ${this.count}.`);
    }
  }

  renderLayout() {
    return html`
      <h2>Feature System Demo</h2>
      <button @click="${this.updateLayout}">Toggle Layout</button>
      <button @click="${this.updateSize}">Toggle Size</button>
      <button @click="${this.updateShape}">Toggle Shape</button>
      <button @click="${this.increment}">Increment Counter</button>
      <button @click="${this.decrement}">Decrement Counter</button>
      ${this.layoutRenderer()}
      <p>
        <strong>Shape:</strong> ${this.shape}<br> 
        <strong>Size:</strong> ${this.size}<br> 
        <strong>Layout:</strong> ${this.layout}<br>
        <strong>Layout Classes:</strong> ${Object.keys(this.layoutClasses || {}).join(", ")}
      </p>
      <p>
        <strong>Focus state:</strong> ${this.hasFocus ? 'Focused' : 'Not Focused'}
      </p>
      <p>
        <strong>Counter:</strong> ${this.count}
      </p>
      <p>
        <em>Open the console to see lifecycle and feature logs.</em>
      </p>
    `;
  }
}

FeatureDemoElement.register("feature-demo-element");