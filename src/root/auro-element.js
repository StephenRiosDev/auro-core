import { AuroCore } from "./auro-core";
import { LayoutFeature } from "../features/layout-feature";

export class AuroElement extends AuroCore {

  static get provides() {
    return {
      Layout: {
        class: LayoutFeature
      }
    }
  }

  /** 
   * Use this to define the layout of the component.
   * This method should be overridden in extending classes to provide the specific layout.
   */
  renderLayout() {};

  /**
   * Render the layout for the component.
   * Do not override this method in extending classes.
   * @returns {TemplateResult} The layout object for the component.
   */
  render() {
    try {
      return this.renderLayout(); // Assumes an extending class will implement this method
    } catch (error) {
      // failed to get the defined layout
      console.error('Failed to get the defined layout - using the default layout', error); // eslint-disable-line no-console

      // fallback to the default layout
      return this.getLayout('default');
    }
  }
}