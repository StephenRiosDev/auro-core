# Auro Core / Features
## Description
Auro core is a POC for providing the features functionality in Lit as a part of the Auro design system and integrates existing concepts in the Auro design system into an interesting new idea for easier implementation, maintenance, and extension of complex functionality into our components.

## What Is A Feature?

### Description

A feature is a single-responsibility file that attaches to and extends a LitElement class, or any class that at some level extends LitElement, and functionally extends that class with new functionality without the need for an actual extension.

While Lit does provide something similar with Mixins, they get rather complicated when you try to create a lot of them, and especially when you try to stack them. Features are far more coder-friendly, provide a simple interface, and are easy to create since they work the same way as a component or mixin (with a few caveats, but more on that later).

Features also don't use or require the use of the `extends` key word at any point, and do not need to be chained or be passed a super constructor like mixins.

### What Problem Does This Solve?

One repeating theme in the Auro codebase is the desire to add, remove, disable, or reconfigure pieces of functionality across Auro components. Features are a way to extend the functionality of a class without needing to create a new class. Two of the core development approaches in software engineering are inheritance and composition, but features are effectively compositional inheritance.

### So What's the Idea?

The core principal for this framework is to allow developers to create features/functionality in a single-responsibility environment and provide them at various levels of component inheritance heirarchy - compositional inheritance.

This provides an extra degree of flexibility in development, as features can also be inherited and may also contain compositional services (like FocusTrap) to further isolate the code for functionality/behavior for easier broad adoption, maintenance, and extensibility across the code base.

This means that with this framework in addition to the JavaScript/ES6 and Lit frameworks, we now how composition, inheritance, and compositional inheritance to work with.

### So How Does It Work?

Features are very similar to services and providers in Angular. Any component with AuroElement in it's heirarchy can provide a new feature that will be available to that component/class and any components or classes that extend it, just like in Angular.

Once provided, feature configurations can be altered by any component in the chain by providing an optional feature configuration.

## Providing a new feature

Providing a new feature can be as simple as declaring it and passing a reference to the class. Optionally, a default configuration can be passed to alter the feature's default behavior.

Providing a new feature is done via the `provides` static getter.

Example:
```javascript
import { AuroElement } from "../root/auro-element.js";
import { CustomFeature } from "../features/custom-feature.js";

export class MyComponent extends AuroElement {

  static get provides {
    return {
      customFeature: {
        class: CustomFeature,
        config: { // optionally pass a default config object for your feature
          customSetting: 'customValue',
          defaultOn: false // Whether or not the feature should be enabled
        }
      }
    }
  }

  // ... etc.
}
```

## Feature Configuration

Modifying the configuration of a provided feature can be done in classes that extend a class that provides a feature by passing a new configuration to the static `features` getter.

Example:
```javascript
import { MyComponent } from "../root/auro-element.js";

export class MyComponent extends MyComponent {

  static get features {
    return {
      customFeature: {
        config: {
          customSetting: 'aDifferentValue' // override the customSetting configuration setting
        }
      }
    }
  }

  // ... etc.
}
```

## Disabling a Feature

Features can also be disabled via the static `features` getter.

Example:
```javascript
import { MyComponent } from "../root/auro-element.js";

export class MyComponent extends MyComponent {

  static get features {
    return {
      customFeature: 'disable'
    }
  }

  // ... etc.
}
```

## Creating A Custom Feature

Creating a custom feature is very straight-forward with just a few considerations. Aside from these considerations, coding in a feature is exactly the same as writing code directly in the component.

Considerations:
1. If you have a constructor, you must pass the host and config to the call to `super()`
2. If you define a lifecycle hook you _must_ call `super.*lifecycleHook()*` and pass the relevant data to it
3. If you need to reference the host to do things (like access shadow root), you have to call `this.host`, which is automatically set for you, instead of just `this`.
4. You cannot render things in features. This is not what features are for. Features work like a custom hook or an angular service and only provide code-side functionality.

Example Feature:
```javascript
export class ComponentFeature extends AuroFeature {

  // The constructor will be passed a reference to the host component and the configuration
  // The config will be a combination of the default configuration object with overrides from the feature configs
  constructor(host, config) {
    super(host, config); // Required of your feature has a constructor
    this._init(); // init this feature, or perform other tasks
  }

  // Setting properties works just like it does in a component
  // Any properties defined here will be attached to the component like normal
  static get properties {
    return {
      shape: {
        type: String,
        reflect: true
      }
    }
  }

  // Lifecycle hooks work like normal
  updated(changedProperties) {
    super.updated(changedProperties) // very important with this framework, always call super
    if (changedProperties.has("shape")) {
      console.log("shape changed!");
    }
  }

  _init() {
    // Set defaults
    this._setDefaults();

    // Add event listeners
    this._addEventListeners();
  }

  _addEventListeners() {

    // If you need to add things to the host DOM element, just use this.host
    // You can also do all the normal things like this.host.shadowRoot etc.
    this.host.addEventListener('keydown', () => console.log("keydown"))
  }

  _setDefaults() {
    this.shape = "rounded";
  }
}
```

## So What Can I Do With It?

Oh not much, just pile in a bunch of optional features that can easily be enabled by any component up the chain but only need to be configured at the root:

```javascript
import { AuroCore } from "../root/auro-element.js";
import { LayoutFeature } from '../features/layout-feature/js';
import { FocusTracker } from '../features/focus-tracker.js';
import { MouseTracker } from '../features/mouse-tracker.js';
import { FocusTrap } from '../features/focus-trap.js';

export class AuroElement extends AuroCore {

  static get provides {
    return {

      // We always want to enable these, components up the chain can disable if they want
      layout: { class: LayoutFeature },

      // Provide a bunch of core functionality that components can opt into but disable them by default
      focusTracker: { class: FocusTracker, enabled: false },
      mouseTracker: { class: MouseTracker, enabled: false },
      focusTrap: { class: FocusTrap, enabled: false },
    }
  }

  // ... etc.
}

export class MyComponent extends AuroElement {
  
  static get features {
    return {

      // Child components can opt in via features
      focusTracker: { enabled: true }

      // We can even configure provided features on the fly
      focusTrap: { enabled: true, config: { element: this.elRef, enabled: this.dropdownOpen } }
    }
  }
}
```

## So What's In This Repo?

This repo contains the minimum working example (POC) of this concept, as well as an implementation of the only existing feature currently in our base AuroElement: Layout, and a simple one-off basic example (FocusTracker) that is poorly written but shows the simplest interpretation of a feature, as well as providing features at different levels.

### So What Should I See When I Run This?

You should see a render `custom-element` DOM element, with all of the layout functionality working, and a button to dynamically change the layout so you can see the layout feature working.

You will also notice that the "FocusFeature" class is setting a `tabindex` attribute, listening for focus, adds the `hasFocus` property, and toggles it based on the focus state of the element.

## Class Breakdown

### AuroCore

This class provides the core `features` functionality, connecting features with a component so that coding in a feature is 1:1 with coding in an actual component, including property definitions, lifecycle hooks, etc.

### AuroElement

This is the base class for all Auro components and provides all default functionality/features.

### AuroFeature

This is the base class for all Auro Features and contains all the necessary functionality from the feature side to attach features to components