export function getStepsToMove({ leftPageIndex, newLeftPageIndex, visableItems, step }) {
    const rightPageIndex = getRightPageIndex({ leftPageIndex, visableItems });
    
    let stepsToMove;
    if (newLeftPageIndex > rightPageIndex) {
        stepsToMove = (newLeftPageIndex - rightPageIndex) / step;
    } else {
        stepsToMove = (newLeftPageIndex - leftPageIndex) / step;
    }
    //arithmetic ceil
    return Math.sign(stepsToMove) * Math.ceil(Math.abs(stepsToMove));
}

export function getRightPageIndex({ leftPageIndex, visableItems }) {
    return leftPageIndex + Math.floor(visableItems) - 1;
}

export function normalizeIndex(index, itemCount) {
    if(index < 0) {
        return normalizeIndex(index + itemCount, itemCount);
    } else if(index > itemCount - 1){
        return normalizeIndex(index - itemCount, itemCount);
    }
    return index;
}
