import { AuroFeature } from "../root/auro-feature";

/**
 * LifecycleLoggerFeature
 * Logs lifecycle events for demonstration/documentation.
 */
export class LifecycleLoggerFeature extends AuroFeature {
  connectedCallback() {
    console.log(`[LifecycleLoggerFeature] connectedCallback on`, this.host);
  }
  disconnectedCallback() {
    console.log(`[LifecycleLoggerFeature] disconnectedCallback on`, this.host);
  }
  firstUpdated() {
    console.log(`[LifecycleLoggerFeature] firstUpdated on`, this.host);
  }
  updated() {
    console.log(`[LifecycleLoggerFeature] updated on`, this.host);
  }
}