import {BaseComponent} from '../util/base-component';


/**
 * Sync MDCComponent functions with AngularJS lifecycle events.
 *
 * Exposes foundationReady for when initialSyncWithDOM is completed.
 *
 * @class MDCComponentNg
 */
export class MDCComponentNg extends BaseComponent {
  static get $inject() {
    return ['$element', '$scope', '$document'];
  }

  constructor(...args) {
    super(...args);

    this.unlisteners__ = {};
    this.root_ = this.$element[0];
    this.foundation_ = this.getDefaultFoundation();
  }

  $onInit() {
    this.initialize();
  }

  $postLink() {
    this.$element.ready(() => {
      this.foundation_.init();
      this.initialSyncWithDOM();
      this.foundationReady = true;
    });
  }

  $onDestroy() {
    this.destroy();
  }

  /**
   * @return {!F} foundation
   */
  getDefaultFoundation() {
    // Subclasses must override this method to return a properly configured foundation class for the
    // component.
    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
      'foundation class');
  }

  initialSyncWithDOM() {
    // Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    if (this.foundationReady) {
      this.foundation_.destroy();
    }
  }

  /**
   * Wrapper method to add an event listener to the component's root element. This is most useful when
   * listening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  listen(evtType, handler) {
    if (!this.unlisteners__[evtType]) {
      this.unlisteners__[evtType] = new WeakMap();
    }

    this.unlisteners__[evtType].set(handler, this.$scope.$on(evtType, handler));
  }

  /**
   * Wrapper method to remove an event listener to the component's root element. This is most useful when
   * unlistening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  unlisten(evtType, handler) {
    if (!this.unlisteners__[evtType]) {
      return;
    }

    if (this.unlisteners__[evtType].has(handler)) {
      this.unlisteners__[evtType].get(handler)();
    }
  }

  /**
   * Fires a cross-browser-compatible custom event from the component root of the given type,
   * with the given data.
   * @param {string} evtType
   * @param {!Object} evtData
   * @param {boolean=} shouldBubble - ignored
   */
  emit(evtType, evtData, shouldBubble = false) {
    this.$scope.$emit(evtType, evtData);
  }
}