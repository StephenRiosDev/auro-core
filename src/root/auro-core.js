import { LitElement } from 'lit';
import { FeatureManager } from './services/feature-manager.js';

/**
 * @class AuroCore
 * @extends {LitElement}
 * @description Base class for Auro web components with feature management capabilities.
 * Provides a feature system that allows components to inherit, configure, and extend
 * functionality through a composable architecture.
 */
export class AuroCore extends LitElement {
  /**
   * @constructor
   * @description Initializes the component and sets up the feature management system.
   */
  constructor() {
    super();

    /**
     * @type {FeatureManager}
     * @description Instance of the FeatureManager that handles feature registration,
     * lifecycle management, and property merging. It traverses the inheritance chain
     * to collect features and configurations defined in any ancestor class.
     */
    this.featureManager = new FeatureManager(this, this.constructor);
  }

  /**
   * @static
   * @type {Object}
   * @description Holds feature-defined properties. This static property is populated
   * by the FeatureManager when features are prepared during component registration.
   */
  static _featureProperties = {};

  /**
   * @static
   * @returns {Object} Combined properties from both direct class definition and features
   * @description Overrides the standard properties getter to include feature-defined properties.
   * Base properties take precedence over feature properties when merged.
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
   * @static
   * @returns {Object} Configuration for features this component wants to use
   * @description Defines which features this component/class wants to use or configure.
   * Use 'disable' property to explicitly disable an inherited feature.
   * @example
   * static get features() {
   *   return {
   *     'custom-feature': { config: { optionA: true, optionB: 'value' } }
   *   };
   * }
   */
  static get features() {
    return {};
  }

  /**
   * @static
   * @returns {Object} Registry of features provided by this component/class
   * @description Defines features that this component provides for itself or descendants.
   * Each feature should include a class reference and optional default configuration.
   * @example
   * static get provides() {
   *   return {
   *     'custom-feature': { 
   *       class: CustomFeature, 
   *       config: { defaultOption: true },
   *       enabled: false 
   *     }
   *   };
   * }
   */
  static get provides() {
    return {};
  }

  /**
   * @static
   * @param {string} componentName - The custom element name to register (e.g., 'auro-button')
   * @description Registers the component as a custom element with the browser.
   * Also ensures all features are prepared before the component is instantiated by
   * collecting features and configurations up the inheritance chain.
   */
  static register(componentName) {
    // Ensure features are prepared before component registration
    FeatureManager.prepareFeatures(this);
    
    // Register the custom element
    customElements.define(componentName, this);
  }

  /**
   * @description Invoked when the element is added to the document's DOM.
   * Processes feature lifecycle hooks in the order: beforeConnectedCallback,
   * standard connectedCallback, afterConnectedCallback.
   */
  connectedCallback() {
    this.featureManager.processLifecycle('beforeConnectedCallback');
    super.connectedCallback();
    this.featureManager.processLifecycle('connectedCallback');
    this.featureManager.processLifecycle('afterConnectedCallback');
  }

  /**
   * @description Invoked when the element is removed from the document's DOM.
   * Processes feature lifecycle hooks in the order: beforeDisconnectedCallback,
   * disconnectedCallback, standard disconnectedCallback, afterDisconnectedCallback.
   */
  disconnectedCallback() {
    this.featureManager.processLifecycle('beforeDisconnectedCallback');
    this.featureManager.processLifecycle('disconnectedCallback');
    super.disconnectedCallback();
    this.featureManager.processLifecycle('afterDisconnectedCallback');
  }

  /**
   * @param {Map} changedProperties - Map of changed properties with their previous values
   * @description Invoked after the element's first update cycle completes.
   * Processes feature lifecycle hooks in the order: beforeFirstUpdated,
   * standard firstUpdated, firstUpdated, afterFirstUpdated.
   */
  firstUpdated(changedProperties) {
    this.featureManager.processLifecycle('beforeFirstUpdated', changedProperties);
    super.firstUpdated(changedProperties);
    this.featureManager.processLifecycle('firstUpdated', changedProperties);
    this.featureManager.processLifecycle('afterFirstUpdated', changedProperties);
  }

  /**
   * @param {Map} changedProperties - Map of changed properties with their previous values
   * @description Invoked whenever the element's properties are updated.
   * Processes feature lifecycle hooks in the order: beforeUpdated,
   * standard updated, updated, afterUpdated.
   */
  updated(changedProperties) {
    this.featureManager.processLifecycle('beforeUpdated', changedProperties);
    super.updated(changedProperties);
    this.featureManager.processLifecycle('updated', changedProperties);
    this.featureManager.processLifecycle('afterUpdated', changedProperties);
  }
  
  /**
   * @param {string} name - Name of the attribute that changed
   * @param {string} oldValue - Previous value of the attribute
   * @param {string} newValue - New value of the attribute
   * @description Invoked when one of the element's attributes is changed.
   * Processes feature lifecycle hooks in the order: beforeAttributeChangedCallback,
   * standard attributeChangedCallback, attributeChangedCallback, afterAttributeChangedCallback.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.featureManager.processLifecycle('beforeAttributeChangedCallback', name, oldValue, newValue);
    super.attributeChangedCallback(name, oldValue, newValue);
    this.featureManager.processLifecycle('attributeChangedCallback', name, oldValue, newValue);
    this.featureManager.processLifecycle('afterAttributeChangedCallback', name, oldValue, newValue);
  }
}