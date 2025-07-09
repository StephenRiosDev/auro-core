import { AuroCore } from "./auro-core";
import { LayoutFeature } from "../features/layout-feature";

export class AuroElement extends AuroCore {

  static get provides() {
    return {
      "layout": {
        class: LayoutFeature
      }
    }
  }
}