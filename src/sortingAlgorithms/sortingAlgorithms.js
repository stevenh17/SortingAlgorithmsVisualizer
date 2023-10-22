export function getMergeSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return animations;
    const tempArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, tempArray, animations);
    return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, tempArray, animations) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(tempArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(tempArray, middleIdx + 1, endIdx, mainArray, animations);
    doMerge(mainArray, startIdx, middleIdx, endIdx, tempArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, tempArray, animations) {
    let k = startIdx; // track position of array that will be overwritten
    let i = startIdx;
    let j = middleIdx + 1;

    while (i <= middleIdx && j <= endIdx) {
        animations.push({ type: 'compare', indices: [i, j] });  // identifies which indices are being compared to highlight
        if (tempArray[i] <= tempArray[j]) {
            animations.push({ type: 'overwrite', index: k, value: tempArray[i] });  // overwrite value at specific index position
            mainArray[k++] = tempArray[i++];
        } else {
            animations.push({ type: 'overwrite', index: k, value: tempArray[j] });
            mainArray[k++] = tempArray[j++];
        }
    }

    // one array is empty, copy all values from remaining array into sorted array
    while (i <= middleIdx) {
        animations.push({ type: 'overwrite', index: k, value: tempArray[i] });
        mainArray[k++] = tempArray[i++];
    }

    while (j <= endIdx) {
        animations.push({ type: 'overwrite', index: k, value: tempArray[j] });
        mainArray[k++] = tempArray[j++];
    }
}
