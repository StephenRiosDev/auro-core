/**
 * Compositional service responsible for managing features and their lifecycle hooks
 * and connecting them to the host component.
 */
export class FeatureManager {

  // Stores all instances of provided features
  _featureInstances;

  constructor(host, constructor) {
    this.host = host;
    this.constructor = constructor;
    this._featureInstances = new Map();
    this._initializeFeatures();
  }

  /**
   * Collects features (`static get provides`) from the entire inheritance chain
   * @returns {Object} Merged feature definitions
   */
  static getInheritedProvides(constructor) {
    // Start with empty features object
    const features = {};
    
    // Walk up the prototype chain to collect features
    let current = constructor;
    while (current && current.name !== 'LitElement') {
      // Get features provided by this class
      const provides = current.provides || {};
      
      // Merge with accumulated features (child classes override parent classes)
      Object.entries(provides).forEach(([name, definition]) => {
        if (!features[name]) {
          features[name] = definition;
        }
      });
      
      // Move up the prototype chain
      current = Object.getPrototypeOf(current);
    }
    
    return features;
  }

  /**
   * Collects feature configurations (`static get features`) from the inheritance chain
   * @returns {Object} Merged feature configurations
   */
  static getInheritedConfigs(constructor) {
    // Start with empty config object
    const configs = {};
    
    // Walk up the prototype chain to collect feature configs
    let current = constructor;
    while (current && current.name !== 'LitElement') {
      // Get feature configurations from this class
      const features = current.features || {};
      
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
      current = Object.getPrototypeOf(current);
    }
    
    return configs;
  }

  /**
   * Initialize features and collect their properties
   * This needs to be called before the element is registered
   * This is done in the static `register()` method of the core component
   */
  static prepareFeatures(constructor) {
    if (constructor._featuresInitialized) {
      return; // Only do this once per class
    }

    // Create feature properties registry if it doesn't exist
    if (!constructor._featureProperties) {
      constructor._featureProperties = {};
    }
    
    // Get available features and their configs
    const providedFeatures = this.getInheritedProvides(constructor);
    const featureConfigs = this.getInheritedConfigs(constructor);

    // Collect properties from all applicable features
    Object.entries(providedFeatures).forEach(([featureName, featureDef]) => {
      const featureConfig = featureConfigs[featureName];
      
      // Skip if feature is explicitly disabled
      if (featureConfig === 'disable') return;
      
      const { class: FeatureClass, config: defaultConfig = {}, enabled = true } = featureDef;

      // Skip non-default features that weren't requested
      if (!enabled) return;

      // Get final configuration
      const finalConfig = !featureConfig
        ? defaultConfig 
        : { ...defaultConfig, ...(featureConfig.config || {}) };
      
      // If feature has static properties, collect them
      if (FeatureClass.properties) {
        Object.entries(FeatureClass.properties).forEach(([propName, propConfig]) => {
          constructor._featureProperties[propName] = propConfig;
        });
      };
    });

    constructor._featuresInitialized = true;
  }

  /**
   * Initialize all features that this component has opted into
   */
  _initializeFeatures() {
    // Get all available features from the class hierarchy
    const availableFeatures = FeatureManager.getInheritedProvides(this.constructor);

    // Get feature configurations from the class hierarchy
    const featureConfigs = FeatureManager.getInheritedConfigs(this.constructor);

    // Process each available feature
    Object.entries(availableFeatures).forEach(([featureName, featureDef]) => {
      const featureConfig = featureConfigs[featureName];

      // Skip if feature is explicitly disabled
      if (featureConfig === 'disable') return;
      
      const { class: FeatureClass, config: defaultConfig = {}, enabled = true } = featureDef;
      
      // Determine if feature should be applied
      if (!featureConfig && !enabled) return;
      
      // Determine final configuration
      const finalConfig = !featureConfig
        ? defaultConfig 
        : { ...defaultConfig, ...(featureConfig.config || {}) };
      
      // Create the feature
      const featureInstance = new FeatureClass(this.host, finalConfig);
      
      // Store reference to feature instance
      this._featureInstances.set(featureName, featureInstance);
      
      // Register instance properties if provided
      if (featureInstance.properties) {
        Object.entries(featureInstance.properties).forEach(([propName, propConfig]) => {
          // Initialize property value if provided
          if (propConfig.hasOwnProperty('value')) {
            this.host[propName] = propConfig.value;
          }
        });
      }
      
      // Apply the feature's properties and methods
      if (typeof featureInstance.applyToComponent === 'function') {
        featureInstance.applyToComponent(this.host);
      }
    });
  }

  /**
   * Process lifecycle method for all registered features
   * This allows features to hook into standard LitElement lifecycle methods
   * This is called from the core component's lifecycle methods
   * @param {string} methodName - Name of lifecycle method
   * @param {Array} args - Arguments to pass to method
   */
  processLifecycle(methodName, ...args) {
    this._featureInstances.forEach(feature => {
      if (typeof feature[methodName] === 'function') feature[methodName](...args);
    });
  }
}