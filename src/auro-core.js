import { LitElement } from 'lit'

export class AuroCore extends LitElement {

  constructor() {
    super();
    this._initializeFeatures();
  }

  _featureInstances = new Map();
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
   *         defaultOn: false 
   *       }
   *     };
   *   }
   */
  static get provides() {
    return {};
  }

  /**
   * Collects features from the entire inheritance chain
   * @returns {Object} Merged feature definitions
   */
  static getInheritedProvides() {
    // Start with empty features object
    const features = {};
    
    // Walk up the prototype chain to collect features
    let constructor = this;
    while (constructor && constructor !== LitElement) {
      // Get features provided by this class
      const provides = constructor.provides || {};
      
      // Merge with accumulated features (child classes override parent classes)
      Object.entries(provides).forEach(([name, definition]) => {
        if (!features[name]) {
          features[name] = definition;
        }
      });
      
      // Move up the prototype chain
      constructor = Object.getPrototypeOf(constructor);
    }
    
    return features;
  }
  
  /**
   * Collects feature configurations from the inheritance chain
   * @returns {Object} Merged feature configurations
   */
  static getInheritedConfigs() {
    // Start with empty config object
    const configs = {};
    
    // Walk up the prototype chain to collect feature configs
    let constructor = this;
    while (constructor && constructor !== LitElement) {
      // Get feature configurations from this class
      const features = constructor.features || {};
      
      // Merge with accumulated configs
      Object.entries(features).forEach(([name, config]) => {
        if (!configs[name]) {
          configs[name] = config;
        } else if (config === 'disable') {
          // Mark feature as disabled
          configs[name] = 'disable';
        } else if (configs[name] !== 'disable' && config.config) {
          // Merge configs (child overrides parent)
          configs[name] = {
            ...configs[name],
            config: { ...(configs[name].config || {}), ...config.config }
          };
        }
      });
      
      // Move up the prototype chain
      constructor = Object.getPrototypeOf(constructor);
    }
    
    return configs;
  }
  
  /**
   * Initialize features and collect their properties
   * This needs to be called before the element is registered
   */
  static prepareFeatures() {
    if (this._featuresInitialized) {
      return; // Only do this once per class
    }

    // Create feature properties registry if it doesn't exist
    if (!this._featureProperties) {
      this._featureProperties = {};
    }
    
    // Get available features and their configs
    const providedFeatures = this.getInheritedProvides();
    const featureConfigs = this.getInheritedConfigs();

    // Collect properties from all applicable features
    Object.entries(providedFeatures).forEach(([featureName, featureDef]) => {
      const featureConfig = featureConfigs[featureName];
      
      // Skip if feature is explicitly disabled
      if (featureConfig === 'disable') return;
      
      const { class: FeatureClass, config: defaultConfig = {}, defaultOn = true } = featureDef;

      // Skip non-default features that weren't requested
      if (!defaultOn) return;
      
      // Get final configuration
      const finalConfig = !featureConfig
        ? defaultConfig 
        : { ...defaultConfig, ...(featureConfig.config || {}) };
      
      // If feature has static properties, collect them
      if (FeatureClass.properties) {
        Object.entries(FeatureClass.properties).forEach(([propName, propConfig]) => {
          this._featureProperties[propName] = propConfig;
        });
      };
    });

    this._featuresInitialized = true;
  }
  
  static register(componentName) {
    // Ensure features are prepared before registration
    this.prepareFeatures();
    
    // Register the custom element
    customElements.define(componentName, this);
  }

  /**
   * Initialize all features that this component has opted into
   */
  _initializeFeatures() {
    // Get all available features from the class hierarchy
    const availableFeatures = this.constructor.getInheritedProvides();

    // Get feature configurations from the class hierarchy
    const featureConfigs = this.constructor.getInheritedConfigs();

    // Process each available feature
    Object.entries(availableFeatures).forEach(([featureName, featureDef]) => {
      const featureConfig = featureConfigs[featureName];

      // Skip if feature is explicitly disabled
      if (featureConfig === 'disable') {
        return;
      }
      
      const { class: FeatureClass, config: defaultConfig = {}, defaultOn = true } = featureDef;
      
      // Determine if feature should be applied
      if (!featureConfig && !defaultOn) {
        return; // Skip non-default features that weren't requested
      }
      
      // Determine final configuration
      const finalConfig = !featureConfig
        ? defaultConfig 
        : { ...defaultConfig, ...(featureConfig.config || {}) };
      
      // Create the feature
      const featureInstance = new FeatureClass(this, finalConfig);
      
      // Store reference to feature instance
      this._featureInstances.set(featureName, featureInstance);
      
      // Register instance properties if provided
      if (featureInstance.properties) {
        Object.entries(featureInstance.properties).forEach(([propName, propConfig]) => {
          // Initialize property value if provided
          if (propConfig.hasOwnProperty('value')) {
            this[propName] = propConfig.value;
          }
        });
      }
      
      // Apply the feature's properties and methods
      if (typeof featureInstance.applyToComponent === 'function') {
        featureInstance.applyToComponent(this);
      }
    });
  }

  /**
   * Process lifecycle method with before/after hooks
   * @param {string} methodName - Name of lifecycle method
   * @param {Array} args - Arguments to pass to method
   */
  processFeatureLifecycle(methodName, ...args) {
    // Call "before" hooks
    const beforeMethodName = `before${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}`;
    this._featureInstances.forEach(feature => {
      if (typeof feature[beforeMethodName] === 'function') {
        feature[beforeMethodName](...args);
      }
    });
    
    // Call actual method hooks
    this._featureInstances.forEach(feature => {
      if (typeof feature[methodName] === 'function') {
        feature[methodName](...args);
      }
    });
    
    // Call "after" hooks
    const afterMethodName = `after${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}`;
    this._featureInstances.forEach(feature => {
      if (typeof feature[afterMethodName] === 'function') {
        feature[afterMethodName](...args);
      }
    });
  }

  /**
   * Standard LitElement lifecycle methods - pass through to features
   */
  connectedCallback() {
    this.processFeatureLifecycle('beforeConnectedCallback');
    super.connectedCallback();
    this.processFeatureLifecycle('connectedCallback');
    this.processFeatureLifecycle('afterConnectedCallback');
  }

  disconnectedCallback() {
    this.processFeatureLifecycle('beforeDisconnectedCallback');
    this.processFeatureLifecycle('disconnectedCallback');
    super.disconnectedCallback();
    this.processFeatureLifecycle('afterDisconnectedCallback');
  }

  firstUpdated(changedProperties) {
    console.log("AuroCore firstUpdated");
    this.processFeatureLifecycle('beforeFirstUpdated', changedProperties);
    super.firstUpdated(changedProperties);
    this.processFeatureLifecycle('firstUpdated', changedProperties);
    this.processFeatureLifecycle('afterFirstUpdated', changedProperties);
  }

  updated(changedProperties) {
    console.log("AuroCore updated");
    this.processFeatureLifecycle('beforeUpdated', changedProperties);
    super.updated(changedProperties);
    this.processFeatureLifecycle('updated', changedProperties);
    this.processFeatureLifecycle('afterUpdated', changedProperties);
  }
  
  // Add additional lifecycle hooks that features might need
  attributeChangedCallback(name, oldValue, newValue) {
    this.processFeatureLifecycle('beforeAttributeChangedCallback', name, oldValue, newValue);
    super.attributeChangedCallback(name, oldValue, newValue);
    this.processFeatureLifecycle('attributeChangedCallback', name, oldValue, newValue);
    this.processFeatureLifecycle('afterAttributeChangedCallback', name, oldValue, newValue);
  }
}