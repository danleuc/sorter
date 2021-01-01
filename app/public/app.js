//Generate columns
let columnsAmount = 100; //default
const generateButton = document.querySelector('.generate-randoms');
const sortButton = document.querySelector('.sort-button');
const container = document.querySelector('.container');
const columnsAmountSlider = document.querySelector('#generate-columns-amount');
const selectAlgorithm = document.querySelector('select');
const columnsAmountSpan = document.querySelector('.generator-container span');

//global variables
let takenValues = [];
let sorting = false;
let stopSorting = false;

//Event listeners
generateButton.addEventListener('click', () => {
    if (!sorting) {
        generateColumns(columnsAmount);
    } else {
        alert('Already sorting!');
    }
});

sortButton.addEventListener('click', () => {
    if (!sorting) {

        const allColumns = document.querySelectorAll('.col');

        switch (selectAlgorithm.value) {
            case 'bubble-sort':
                bubblesort(allColumns);
                break;
            case 'quick-sort':
                quicksortStarter(allColumns, 0, allColumns.length - 1);
                break;
            default:
                break;
        }
    } else {
        stopSorting = true;
        stopSortingHelper();
    }
});

columnsAmountSlider.addEventListener('input', () => {
    columnsAmount = columnsAmountSlider.value;
    columnsAmountSpan.innerText = columnsAmount;
})

//Functions

function getValue() {
    let value = Math.floor(Math.random() * columnsAmount + 1);
    if (takenValues.includes(value) || value === 0) {
        return getValue();
    }
    takenValues.push(value);
    return value;
}

function generateColumns(colNr) {

    //reset
    container.innerHTML = '';
    takenValues = []

    //getMaxHeightValue | 80% of the available space
    const containerHeight80percent = document.querySelector('.container').offsetHeight * 0.8;
    const factor = Math.floor(containerHeight80percent / colNr);


    for (let i = 0; i < colNr; i++) {
        let value = getValue();
        let newCol = document.createElement('div');
        newCol.classList.add('col');
        newCol.id = value;
        newCol.style.height = `${value * factor}px`;
        // newCol.innerText = value;
        container.append(newCol);
    }

    sortButton.classList.remove('inactive');
}

async function swapElements(element1, element2) {
    //element2.parentNode.insertBefore(element2, element1);

    let swapTempClassList = element1.classList;
    let swapTempId = element1.id;
    let swapTempHeight = element1.style.height;

    element1.classList = element2.classList;
    element1.id = element2.id;
    element1.style.height = element2.style.height;

    element2.classList = swapTempClassList;
    element2.id = swapTempId;
    element2.style.height = swapTempHeight;

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startSortingHelper() {
    sorting = true;
    stopSorting = false;
    sortButton.innerText = 'Stop';
    sortButton.classList.add('stop');
}

function stopSortingHelper() {
    sorting = false;
    sortButton.innerText = 'Sort it!';
    sortButton.classList.remove('stop');
    sortButton.classList.add('inactive');
}

async function bubblesort(allColumns) {

    let swapped = true;
    let i = 1;
    let length = allColumns.length;

    startSortingHelper();

    while (i < length - 1) {

        if (stopSorting) {
            break;
        }

        document.querySelectorAll('.col')[i].classList.add('selected');
        await sleep(15);

        if (parseInt(document.querySelectorAll('.col')[i].id) > parseInt(document.querySelectorAll('.col')[i + 1].id)) {
            swapElements(document.querySelectorAll('.col')[i], document.querySelectorAll('.col')[i + 1])
            swapped = true;
            document.querySelectorAll('.col')[i + 1].classList.remove('selected');
        }

        document.querySelectorAll('.col')[i].classList.remove('selected');
        i++;
        if (i === length - 1 && swapped) {
            i = 0;
            length--;
            swapped = false;
        }
    }
    stopSortingHelper();
}

async function quicksortStarter(allColumns, lowI, highI) {
    startSortingHelper();
    await quicksort(allColumns, lowI, highI);
    animationSortingCompleted();
    stopSortingHelper();
}

async function quicksort(allColumns, lowI, highI) {

    if (stopSorting) return;

    if (lowI < highI) {
        let partitionIndex = await partition(allColumns, lowI, highI);
        await quicksort(allColumns, lowI, partitionIndex - 1);
        await quicksort(allColumns, partitionIndex + 1, highI);
    }

}

async function partition(allColumns, lowI, highI) {
    const pivot = parseInt(allColumns[highI].id);
    let i = lowI - 1;

    //add pivot class to col
    document.querySelectorAll('.col')[highI].classList.add('pivot');

    for (j = lowI; j < highI; j++) {

        //add selected class
        document.querySelectorAll('.col')[j].classList.add('selected');
        if (i >= 0) document.querySelectorAll('.col')[i].classList.add('selected');

        if (parseInt(document.querySelectorAll('.col')[j].id) <= pivot) {
            i++;
            await sleep(15);
            await swapElements(document.querySelectorAll('.col')[i], document.querySelectorAll('.col')[j]);

            //remove selected class
            document.querySelectorAll('.col')[j].classList.remove('selected');
            if (i > 0) document.querySelectorAll('.col')[i - 1].classList.remove('selected');
        }

        //remove selected class
        document.querySelectorAll('.col')[j].classList.remove('selected');
        if (i >= 0) document.querySelectorAll('.col')[i].classList.remove('selected');
    }

    //remove pivot class
    document.querySelectorAll('.col')[highI].classList.remove('pivot');

    swapElements(document.querySelectorAll('.col')[i + 1], document.querySelectorAll('.col')[highI]);
    return i + 1;
}


//Animations
async function animationSortingCompleted() {

    await gsap.to('.col', 1, {
        ease: "power2.inOut",
        background: "lightyellow",
        stagger: 0.01,
        y: "-50px"
    });

    await gsap.to('.col', 1, {
        ease: "bounce.out",
        // stagger: 0.01,
        y: "0px"
    });

    await gsap.to('.col', 0, {
        background: "lightgreen",
    });
}




generateColumns(columnsAmount);


