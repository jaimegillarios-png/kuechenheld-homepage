/**
 * The motion layer's entry point under Astro.
 *
 * MotionRuntime was a React component whose only job was to call these four on
 * mount. Nothing here is React — every routine queries data attributes on a
 * root — so a module script does the same work without an island.
 *
 * It waits for load rather than running immediately: `collectRevealTargets`
 * decides what is below the fold by measuring, and measuring before images
 * have reserved their space misclassifies elements. React's effect ran after
 * paint, and this matches that.
 */
import {
  initAnchorScroll,
  initCounters,
  initParallax,
  initRules,
  initScrollReveals,
} from "../lib/motion";

const start = () => {
  initScrollReveals();
  initParallax();
  initCounters();
  initRules();
  initAnchorScroll();
};

if (document.readyState === "complete") start();
else window.addEventListener("load", start, { once: true });
