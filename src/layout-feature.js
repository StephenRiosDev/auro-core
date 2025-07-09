import { AuroFeature } from "./auro-feature";

export class LayoutFeature extends AuroFeature {

  constructor(host, config) {
    super(host, config);
    this.layout = config.layout || "default";
    this.shape = config.shape || "default";
    this.size = config.size || "default";
    this.onDark = config.onDark || false;

    // setInterval(() => {
    //   this.layout = this.layout === "bob" ? "tom" : "bob";
    // }, 2500);
  }

  static get properties() {
    return {
      layout: { type: String, attribute: "layout", reflect: true },
      shape: { type: String, attribute: "shape", reflect: true },
      size: { type: String, attribute: "size", reflect: true },
      onDark: { type: Boolean, attribute: "ondark", reflect: true }
    };
  }

  firstUpdated() {
    super.firstUpdated();
    console.log("LayoutFeature firstUpdated");
    console.log(this.layout);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    console.log("LayoutFeature updated");
    console.log(this.layout);
  }
}