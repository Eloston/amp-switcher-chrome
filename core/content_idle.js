"use strict";

// Assuming that AMP or canonical page links will not be added during page idle,
// disconnect the observers to save some resources.

if (headObserver) {
    headObserver.disconnect();
    headObserver = null;
}

if (linkObserver) {
    linkObserver.disconnect();
    linkObserver = null;
}
