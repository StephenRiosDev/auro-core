import { AuroFeature } from "../root/auro-feature";

export class LayoutFeature extends AuroFeature {

  constructor(host, config) {
    super(host, config);
    this.layout = config.layout || "classic";
    this.shape = config.shape || "pill";
    this.size = config.size || "md";
    this.onDark = config.onDark || false;
    this.layoutClasses = {};

    // Initialize layout classes
    this.updateComponentArchitecture();
  }

  static get properties() {
    return {
      layout: {
        type: String,
        attribute: "layout",
        reflect: true
      },

      shape: {
        type: String,
        attribute: "shape",
        reflect: true
      },

      size: {
        type: String,
        attribute: "size",
        reflect: true
      },

      onDark: {
        type: Boolean,
        attribute: "ondark",
        reflect: true
      },

      layoutClasses: {
        type: Object,
        attribute: false,
        reflect: false
      },
    };
  }

  updateShapeClasses() {
    // Create a new object with the existing classes
    const updatedClasses = {...this.layoutClasses};
    
    // Remove existing shape classes
    Object.keys(updatedClasses).forEach(className => {
      if (className.startsWith('shape-')) {
        delete updatedClasses[className];
      }
    });

    // Add new shape class
    if (this.shape && this.size) {
      updatedClasses[`shape-${this.shape.toLowerCase()}-${this.size.toLowerCase()}`] = true;
    } else {
      updatedClasses['shape-none'] = true;
    }

    // Update layoutClasses once
    this.layoutClasses = updatedClasses;
  }

  updateLayoutClasses() {
    if (this.layout) {
      // Create a new object with the existing classes
      const updatedClasses = {...this.layoutClasses};
      
      // Remove existing layout classes
      Object.keys(updatedClasses).forEach(className => {
        if (className.startsWith('layout-')) {
          delete updatedClasses[className];
        }
      });

      // Add new layout class
      updatedClasses[`layout-${this.layout.toLowerCase()}`] = true;
      
      // Update layoutClasses once
      this.layoutClasses = updatedClasses;
    }
  }

  updateComponentArchitecture() {
    this.updateLayoutClasses();
    this.updateShapeClasses();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('layout') || changedProperties.has('shape') || changedProperties.has('size')) {
      this.updateComponentArchitecture();
    }
  }
}