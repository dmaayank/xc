/**
 * Rect Helper Class
 * Represents a physical area on the screen
 */
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Calculates the bottom-most Y coordinate
    get yEnd() {
        return this.y + this.height;
    }

    // Calculates the right-most X coordinate
    get xEnd() {
        return this.x + this.width;
    }
}

/**
 * Initializes scroll tracking for a container
 */
function setupScroll(container) {
    // Find all elements that need to be tracked
    const scrollPoints = container.querySelectorAll('.scroll-point');

    for (let point of scrollPoints) {
        point.affinityDown = 1;
        point.affinityUp = 1;
    }

    container.onscroll = (event) => {
        // Get the padding of the container to offset calculations
        let paddingTop = parseFloat(getComputedStyle(container).paddingTop);
        
        for (let point of scrollPoints) {
            let scrollElement = ('scrollTop' in event.srcElement) ? event.srcElement : document.scrollingElement;
            
            // Calculate the visible "window" bounds
            let viewTopBoundary = scrollElement.scrollTop + event.srcElement.offsetTop + paddingTop;
            let viewBottomBoundary = scrollElement.scrollTop + scrollElement.clientHeight + event.srcElement.offsetTop + paddingTop;

            // Calculate the absolute position of the element on the page
            let elementRect = new Rect(
                point.offsetLeft + point.offsetParent.offsetLeft,
                point.offsetTop + point.offsetParent.offsetTop,
                point.clientWidth,
                point.clientHeight
            );

            // LOGIC: Is the element completely outside the view?
            if (elementRect.y >= viewBottomBoundary || elementRect.yEnd <= viewTopBoundary) {
                if (point.scrollState) {
                    point.scrollState = undefined;
                    point.dispatchEvent(new Event('viewout'));
                }
            } 
            // LOGIC: Is the element fully visible inside the view?
            else {
                if (elementRect.y > viewTopBoundary && elementRect.yEnd < viewBottomBoundary) {
                    if (point.scrollState !== 'viewfull') {
                        point.scrollState = 'viewfull';
                        point.dispatchEvent(new Event('viewfull'));
                    }
                } 
                // LOGIC: Is it entering the screen for the first time?
                else if (!point.scrollState) {
                    point.scrollState = 'viewin';
                    point.dispatchEvent(new Event('viewenter'));
                } 
                // LOGIC: Did it hit the top boundary?
                else if (compareFloats(elementRect.y, viewTopBoundary) !== point.affinityUp) {
                    point.scrollState = 'viewtop';
                    point.affinityUp = compareFloats(elementRect.y, viewTopBoundary);
                    point.dispatchEvent(new Event('viewtop'));
                } 
                // LOGIC: Did it hit the bottom boundary?
                else if (compareFloats(elementRect.yEnd, viewBottomBoundary) !== point.affinityDown) {
                    point.scrollState = 'viewbottom';
                    point.affinityDown = compareFloats(elementRect.yEnd, viewBottomBoundary);
                    point.dispatchEvent(new Event('viewbottom'));
                }
            }
        }
    };
}

/**
 * Comparison helper for floating point numbers
 */
function compareFloats(val1, val2) {
    let diff = val1 - val2;
    return diff < 0 ? -1 : 1;
}

