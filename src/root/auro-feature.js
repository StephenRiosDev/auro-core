export class AuroFeature {

  host;
  config;
  _propertyObservers = new Map();
  _internalValues = new Map();

  constructor(host, config) {
    this.host = host;
    this.config = config;
    this._auroFeatureInit();
  }

   _auroFeatureInit() {
    if(!this.constructor.properties) return;

    Object.entries(this.constructor.properties).forEach(([propertyName]) => {
      // Create observer for the property
      this._createPropertyObserver(propertyName);

      // Set the initial value from the feature or host
      this.setInternalValue(propertyName, this[propertyName] || this.host[propertyName]);
    });
   }

   _createPropertyObserver(propertyName) {
    const feature = this;
    Object.defineProperty(this, propertyName, {
      get() {
        return feature.getInternalValue(propertyName);
      },
      set(newValue) {
        feature.host[propertyName] = newValue;
        feature.setInternalValue(propertyName, newValue);
      }
    });
   }

   // Method to set internal value without triggering the setter
   setInternalValue(propertyName, value) {
     this._internalValues.set(propertyName, value);
   }

   // Method to get internal value
   getInternalValue(propertyName) {
     return this._internalValues.get(propertyName);
   }

   firstUpdated() {
      Object.entries(this.constructor.properties).forEach(([propertyName]) => {
        if (this.constructor.properties[propertyName]) {
          this.setInternalValue(propertyName, this.host[propertyName]);
        }
      });
   }

   updated(changedProperties) {
      Object.entries(this.constructor.properties).forEach(([propertyName]) => {
        if (changedProperties.has(propertyName)) {
          this.setInternalValue(propertyName, this.host[propertyName]);
        }
      });
   }
}