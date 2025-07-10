import { LitElement } from 'lit';
import { FeatureManager } from './services/feature-manager.js';

export class AuroCore extends LitElement {
  constructor() {
    super();
    this.featureManager = new FeatureManager(this, this.constructor);
  }

  // Holds feature-defined properties
  static _featureProperties = {};

  /**
   * Override properties getter to include feature-defined properties
   */
  static get properties() {
    // Get base properties (from direct class definition)
    const baseProperties = Object.getPrototypeOf(this).properties || {};
    
    // Get feature properties
    const featureProperties = this._featureProperties || {};

    // Merge properties (base properties take precedence)
    return {
      ...featureProperties,
      ...baseProperties
    };
  }

  /**
   * Features this component/class wants to use or configure.
   * Use 'disable' to explicitly disable a feature.
   * Example:
   *   static get features() {
   *     return {
   *       'custom-feature': { config: { ...configModifications } }
   *     };
   *   }
   */
  static get features() {
    return {};
  }

  /**
   * Registry of features provided by this component/class
   * Providing a default configuration for features is recommended but optional.
   * Example:
   *   static get provides() {
   *     return {
   *       'custom-feature': { 
   *         class: CustomFeature, 
   *         config: { ...defaultConfigOptions },
   *         enabled: false 
   *       }
   *     };
   *   }
   */
  static get provides() {
    return {};
  }

  static register(componentName) {
    // Ensure features are prepared before registration
    FeatureManager.prepareFeatures(this);
    
    // Register the custom element
    customElements.define(componentName, this);
  }

  /**
   * Standard LitElement lifecycle methods - pass through to features
   */
  connectedCallback() {
    this.featureManager.processLifecycle('beforeConnectedCallback');
    super.connectedCallback();
    this.featureManager.processLifecycle('connectedCallback');
    this.featureManager.processLifecycle('afterConnectedCallback');
  }

  disconnectedCallback() {
    this.featureManager.processLifecycle('beforeDisconnectedCallback');
    this.featureManager.processLifecycle('disconnectedCallback');
    super.disconnectedCallback();
    this.featureManager.processLifecycle('afterDisconnectedCallback');
  }

  firstUpdated(changedProperties) {
    this.featureManager.processLifecycle('beforeFirstUpdated', changedProperties);
    super.firstUpdated(changedProperties);
    this.featureManager.processLifecycle('firstUpdated', changedProperties);
    this.featureManager.processLifecycle('afterFirstUpdated', changedProperties);
  }

  updated(changedProperties) {
    this.featureManager.processLifecycle('beforeUpdated', changedProperties);
    super.updated(changedProperties);
    this.featureManager.processLifecycle('updated', changedProperties);
    this.featureManager.processLifecycle('afterUpdated', changedProperties);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this.featureManager.processLifecycle('beforeAttributeChangedCallback', name, oldValue, newValue);
    super.attributeChangedCallback(name, oldValue, newValue);
    this.featureManager.processLifecycle('attributeChangedCallback', name, oldValue, newValue);
    this.featureManager.processLifecycle('afterAttributeChangedCallback', name, oldValue, newValue);
  }
}