const arrayContainer = document.getElementById('arrayContainer');
const bubbleSortBtn = document.getElementById('bubbleSortBtn');
const selectionSortBtn = document.getElementById('selectionSortBtn');
const insertionSortBtn = document.getElementById('insertionSortBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const mergeSortBtn = document.getElementById('mergeSortBtn');
const quickSortBtn = document.getElementById('quickSortBtn');
const heapSortBtn = document.getElementById('heapSortBtn');
const countingSortBtn = document.getElementById('countingSortBtn');
const cycleSortBtn = document.getElementById('cycleSortBtn');
const radixSortBtn = document.getElementById('radixSortBtn');
const algoNameSpan = document.getElementById('algoName');
const algoTimeSpan = document.getElementById('algoTime');

let array = [];
const ARRAY_SIZE = 60; // Set to 60 bars
const MIN = 10, MAX = 300;

function randomArray() {
    array = Array.from({ length: ARRAY_SIZE }, () => Math.floor(Math.random() * (MAX - MIN + 1)) + MIN);
    renderArray();
}

function renderArray(activeIndices = [], sortedIndices = []) {
    // Use SVG for rendering
    const width = 900, height = 320;
    const barWidth = Math.floor(900 / 40 * 0.5); // Keep bar width same as for 40 bars
    const barGap = 4; // Keep gap same
    const totalBarsWidth = array.length * barWidth + (array.length - 1) * barGap;
    const margin = (width - totalBarsWidth) / 2;
    let svg = `<svg width="${width}" height="${height}">`;
    array.forEach((value, idx) => {
        let color = '#bbb';
        if (activeIndices.includes(idx)) color = '#a82d2d';
        else if (sortedIndices.includes(idx)) color = '#43b581';
        const x = margin + idx * (barWidth + barGap);
        svg += `<rect x="${x}" y="${height - value}" width="${barWidth}" height="${value}" fill="${color}" stroke="#444" rx="4"/>`;
    });
    svg += '</svg>';
    arrayContainer.innerHTML = svg;
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms / 4)); // 4x speed
}

async function bubbleSort() {
    let arr = array.slice();
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            renderArray([j, j + 1], Array.from({ length: i }, (_, k) => n - 1 - k));
            await sleep(80);
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
            array = arr.slice();
            renderArray([j, j + 1], Array.from({ length: i }, (_, k) => n - 1 - k));
            await sleep(80);
        }
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

async function selectionSort() {
    let arr = array.slice();
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            renderArray([minIdx, j], Array.from({ length: i }, (_, k) => k));
            await sleep(80);
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        array = arr.slice();
        renderArray([i, minIdx], Array.from({ length: i + 1 }, (_, k) => k));
        await sleep(80);
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

async function insertionSort() {
    let arr = array.slice();
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            array = arr.slice();
            renderArray([j, j + 1], Array.from({ length: i }, (_, k) => k));
            await sleep(80);
            j--;
        }
        arr[j + 1] = key;
        array = arr.slice();
        renderArray([j + 1], Array.from({ length: i + 1 }, (_, k) => k));
        await sleep(80);
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

async function mergeSortHelper(arr, l, r, sortedIndices) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSortHelper(arr, l, m, sortedIndices);
    await mergeSortHelper(arr, m + 1, r, sortedIndices);
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
        array = arr.slice();
        renderArray([k], sortedIndices);
        await sleep(80);
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
    }
    while (i < left.length) {
        arr[k++] = left[i++];
        array = arr.slice();
        renderArray([k - 1], sortedIndices);
        await sleep(80);
    }
    while (j < right.length) {
        arr[k++] = right[j++];
        array = arr.slice();
        renderArray([k - 1], sortedIndices);
        await sleep(80);
    }
}

async function mergeSort() {
    let arr = array.slice();
    await mergeSortHelper(arr, 0, arr.length - 1, []);
    array = arr.slice();
    renderArray([], Array.from({ length: arr.length }, (_, k) => k));
}

async function quickSortHelper(arr, l, r, sortedIndices) {
    if (l >= r) return;
    let pivot = arr[r];
    let i = l;
    for (let j = l; j < r; j++) {
        renderArray([j, r], sortedIndices);
        await sleep(80);
        if (arr[j] < pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            array = arr.slice();
            renderArray([i, j], sortedIndices);
            await sleep(80);
            i++;
        }
    }
    [arr[i], arr[r]] = [arr[r], arr[i]];
    array = arr.slice();
    renderArray([i, r], sortedIndices);
    await sleep(80);
    await quickSortHelper(arr, l, i - 1, sortedIndices);
    await quickSortHelper(arr, i + 1, r, sortedIndices);
}

async function quickSort() {
    let arr = array.slice();
    await quickSortHelper(arr, 0, arr.length - 1, []);
    array = arr.slice();
    renderArray([], Array.from({ length: arr.length }, (_, k) => k));
}

async function heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        array = arr.slice();
        renderArray([i, largest], Array.from({ length: array.length }, (_, k) => k >= n ? k : null).filter(x => x !== null));
        await sleep(80);
        await heapify(arr, n, largest);
    }
}

async function heapSort() {
    let arr = array.slice();
    let n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        array = arr.slice();
        renderArray([0, i], Array.from({ length: array.length }, (_, k) => k > i ? k : null).filter(x => x !== null));
        await sleep(80);
        await heapify(arr, i, 0);
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

async function countingSort() {
    let arr = array.slice();
    let n = arr.length;
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let range = max - min + 1;
    let count = Array(range).fill(0);
    let output = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        count[arr[i] - min]++;
        renderArray([i], []);
        await sleep(20);
    }
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    for (let i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
        renderArray([i], []);
        await sleep(20);
    }
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        array = arr.slice();
        renderArray([i], Array.from({ length: i + 1 }, (_, k) => k));
        await sleep(10);
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

async function cycleSort() {
    let arr = array.slice();
    let n = arr.length;
    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        let item = arr[cycleStart];
        let pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
            if (arr[i] < item) pos++;
            renderArray([i, cycleStart], []);
            await sleep(20);
        }
        if (pos === cycleStart) continue;
        while (item === arr[pos]) pos++;
        [arr[pos], item] = [item, arr[pos]];
        array = arr.slice();
        renderArray([pos, cycleStart], []);
        await sleep(20);
        while (pos !== cycleStart) {
            pos = cycleStart;
            for (let i = cycleStart + 1; i < n; i++) {
                if (arr[i] < item) pos++;
                renderArray([i, cycleStart], []);
                await sleep(20);
            }
            while (item === arr[pos]) pos++;
            [arr[pos], item] = [item, arr[pos]];
            array = arr.slice();
            renderArray([pos, cycleStart], []);
            await sleep(20);
        }
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

async function radixSort() {
    let arr = array.slice();
    let n = arr.length;
    let max = Math.max(...arr);
    let exp = 1;
    while (Math.floor(max / exp) > 0) {
        let output = Array(n).fill(0);
        let count = Array(10).fill(0);
        for (let i = 0; i < n; i++) {
            let digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            renderArray([i], []);
            await sleep(10);
        }
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        for (let i = n - 1; i >= 0; i--) {
            let digit = Math.floor(arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
            renderArray([i], []);
            await sleep(10);
        }
        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            array = arr.slice();
            renderArray([i], Array.from({ length: i + 1 }, (_, k) => k));
            await sleep(5);
        }
        exp *= 10;
    }
    renderArray([], Array.from({ length: n }, (_, k) => k));
}

function setAlgoStatus(algoName, timeMs = null) {
    if (!algoNameSpan || !algoTimeSpan) return;
    algoNameSpan.textContent = `Algorithm: ${algoName}`;
    if (timeMs === null) {
        algoTimeSpan.innerHTML = 'Time: <span class="loading-dots">...</span>';
    } else {
        algoTimeSpan.textContent = `Time: ${timeMs.toFixed(2)} ms`;
    }
}

bubbleSortBtn.onclick = async () => {
    setAlgoStatus('Bubble Sort');
    const t0 = performance.now();
    await bubbleSort();
    const t1 = performance.now();
    setAlgoStatus('Bubble Sort', t1 - t0);
};
selectionSortBtn.onclick = async () => {
    setAlgoStatus('Selection Sort');
    const t0 = performance.now();
    await selectionSort();
    const t1 = performance.now();
    setAlgoStatus('Selection Sort', t1 - t0);
};
insertionSortBtn.onclick = async () => {
    setAlgoStatus('Insertion Sort');
    const t0 = performance.now();
    await insertionSort();
    const t1 = performance.now();
    setAlgoStatus('Insertion Sort', t1 - t0);
};
mergeSortBtn.onclick = async () => {
    setAlgoStatus('Merge Sort');
    const t0 = performance.now();
    await mergeSort();
    const t1 = performance.now();
    setAlgoStatus('Merge Sort', t1 - t0);
};
quickSortBtn.onclick = async () => {
    setAlgoStatus('Quick Sort');
    const t0 = performance.now();
    await quickSort();
    const t1 = performance.now();
    setAlgoStatus('Quick Sort', t1 - t0);
};
heapSortBtn.onclick = async () => {
    setAlgoStatus('Heap Sort');
    const t0 = performance.now();
    await heapSort();
    const t1 = performance.now();
    setAlgoStatus('Heap Sort', t1 - t0);
};
countingSortBtn.onclick = async () => {
    setAlgoStatus('Counting Sort');
    const t0 = performance.now();
    await countingSort();
    const t1 = performance.now();
    setAlgoStatus('Counting Sort', t1 - t0);
};
cycleSortBtn.onclick = async () => {
    setAlgoStatus('Cycle Sort');
    const t0 = performance.now();
    await cycleSort();
    const t1 = performance.now();
    setAlgoStatus('Cycle Sort', t1 - t0);
};
radixSortBtn.onclick = async () => {
    setAlgoStatus('Radix Sort');
    const t0 = performance.now();
    await radixSort();
    const t1 = performance.now();
    setAlgoStatus('Radix Sort', t1 - t0);
};
randomizeBtn.onclick = () => {
    setAlgoStatus('None', 0);
    randomArray();
};

randomArray();