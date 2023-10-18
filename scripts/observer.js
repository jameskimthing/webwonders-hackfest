// basically, observeElement, with a bunch of params, then onIntersecting is called, when in view.

let observer;

/*
interface IntersectingElements {
    [id: string]: {
        onIntersecting: Function;
        onNotIntersecting: Function;
        delay: number;
        repeat: boolean;
    }
}
*/
const intersectingElements = {};
function makeIntersectionObserver() {
  if (!observer)
    observer = new IntersectionObserver((entries) =>
      entries.forEach(async (entry) => {
        const id = entry.target.dataset.observingIndex;
        const { onIntersecting, onNotIntersecting, repeat, delay } =
          intersectingElements[id];
        if (entry.isIntersecting) {
          await new Promise((r) => setTimeout(r, delay));
          await onIntersecting();
          if (!repeat) {
            observer.unobserve(entry.target);
            delete intersectingElements[id];
          }
        } else if (repeat) await onNotIntersecting();
      })
    );
}

let elementId = 0;

/**
 * Observes an element and triggers callbacks based on its intersection status.
 *
 * @param {Object} options - The options for observing the element.
 * @param {HTMLElement} options.element - The element to observe.
 * @param {Function} options.onIntersecting - Callback function to be called when the element is intersecting.
 * @param {Function} options.onNotIntersecting - Callback function to be called when the element is not intersecting.
 * @param {number} [options.delay=0] - Delay before triggering the callback.
 * @param {boolean} [options.repeat=false] - Whether to repeatedly observe the element.
 */
function observeElement(options) {
  makeIntersectionObserver();
  const { element, onIntersecting, onNotIntersecting, repeat, delay } = options;

  element.dataset.observingIndex = `${elementId}`;
  intersectingElements[elementId] = {
    onIntersecting: onIntersecting,
    onNotIntersecting: onNotIntersecting,
    delay: delay,
    repeat: repeat,
  };

  elementId++;
  observer.observe(element);
}
