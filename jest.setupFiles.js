import axios from "axios";
import { defaultFallbackInView } from 'react-intersection-observer'

global.IntersectionObserver = jest.fn()
defaultFallbackInView(false)

// antd v6 uses MessageChannel for scheduling — provide a shim for jsdom
if (typeof global.MessageChannel === 'undefined') {
    const { MessageChannel } = require('worker_threads');
    global.MessageChannel = MessageChannel;
}

// jsdom does not support getComputedStyle with pseudo-elements (used by antd animations)
const _getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (elt, pseudoElt) => {
    if (pseudoElt) {
        return { getPropertyValue: () => '' };
    }
    return _getComputedStyle(elt);
};

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

jest.mock("@sentry/nextjs", () => ({
    captureMessage: jest.fn(),
    captureException: jest.fn(),
}));