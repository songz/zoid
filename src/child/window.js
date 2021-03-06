/* @flow */

import { memoize, stringifyError, base64decode } from 'belter/src';

import { ZOID } from '../constants';
import type { ChildPayload } from '../parent';

const parseChildWindowName = memoize((windowName : string) : ChildPayload => {
    if (!windowName) {
        throw new Error(`No window name`);
    }

    const [ , zoidcomp, name, encodedPayload ] = windowName.split('__');

    if (zoidcomp !== ZOID) {
        throw new Error(`Window not rendered by zoid - got ${ zoidcomp }`);
    }

    if (!name) {
        throw new Error(`Expected component name`);
    }

    if (!encodedPayload) {
        throw new Error(`Expected encoded payload`);
    }

    try {
        return JSON.parse(base64decode(encodedPayload));
    } catch (err) {
        throw new Error(`Can not decode window name payload: ${ encodedPayload }: ${ stringifyError(err) }`);
    }
});

export function getChildPayload() : ?ChildPayload {
    try {
        return parseChildWindowName(window.name);
    } catch (err) {
        // pass
    }
}
