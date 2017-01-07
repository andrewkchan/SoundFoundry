
/*
 * function getOffsetLeft
 * Returns the total (pagewise) left offset in px of the given element.
 */
export function getOffsetLeft(el) {
    let x = el.offsetLeft;

    while (el.offsetParent) {
        x += el.offsetParent.offsetLeft;
        el = el.offsetParent;
    }

    return x;
}

/*
 * function getOffsetTop
 * Returns the total (pagewise) top offset in px of the given element.
 */
export function getOffsetTop(el) {
    let y = el.offsetTop;

    while (el.offsetParent) {
        y += el.offsetParent.offsetTop;
        el = el.offsetParent;
    }

    return y;
}
