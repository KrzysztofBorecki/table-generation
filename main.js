"use strict";

const inputNumOfRows = document.getElementById('numOfRows');
const inputNumOfColumns = document.getElementById('numOfColumns');
const inputSelectedRow = document.getElementById('selectedRow');
const inputSelectedColumn = document.getElementById('selectedColumn');

let declaredNumOfRows = null;
let declaredNumOfColumns = null;

let selectedRow = null;
let selectedColumn = null;

inputNumOfRows.addEventListener('keydown', checkVal)
inputNumOfColumns.addEventListener('keydown', checkVal)

inputSelectedRow.addEventListener('keydown', checkVal)
inputSelectedColumn.addEventListener('keydown', checkVal)

function checkVal(e) {
    console.log(e);
    if (!((e.key > '0' && e.key <= '9') || ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(e.key))) {
        e.preventDefault();
    };

}



// Table creation //

inputNumOfRows.addEventListener('input', addTable)
inputNumOfColumns.addEventListener('input', addTable)

function addTable(e) {

    // if (inputNumOfRows.value > 100 || inputNumOfColumns.value > 100) {
    //     alert(`Entered value is too high (> 100)! \nPlease enter a value <= 100!`);
    //     return;
    // } 

    declaredNumOfRows = +inputNumOfRows.value;
    declaredNumOfColumns = +inputNumOfColumns.value;

    if (document.querySelector('.table-container')) {
        document.querySelector('.table-container').remove();
        inputSelectedRow.value = "";
        inputSelectedColumn.value = "";
    }

    if (!(declaredNumOfRows && declaredNumOfColumns)) {



    } else {

        const newTableCont = document.createElement('div');
        const newTable = document.createElement('table');
        const newTBody = document.createElement('tbody');
        const newRow = document.createElement('tr');
        const newDataCell = document.createElement('td');

        newTableCont.classList = "table-container";
        newTable.classList = "table";
        newTBody.classList = "table-body"
        newRow.classList = "table-row";
        newDataCell.classList = "row-cell";

        const arrOfColumns = [];
        for (let i = 0; i < declaredNumOfColumns; i++) {
            arrOfColumns.push(newDataCell.cloneNode());
        }

        newRow.append(...arrOfColumns);

        const arrOfRows = [];
        for (let i = 0; i < declaredNumOfRows; i++) {

            arrOfRows.push(newRow.cloneNode(true));
        }

        newTBody.append(...arrOfRows);
        newTable.append(newTBody);
        newTableCont.append(newTable);

        document.querySelector('section').append(newTableCont);

    }

    addValues();

}

function addValues() {
    let rowNumb = 1;
    for (let row of document.querySelector('.table').rows) {
        let columnNumb = 1;
        for (let cell of row.cells) {
            cell.innerHTML = `${rowNumb}${columnNumb}`;
            columnNumb += 1;
        }
        rowNumb += 1;
    }
}

// Rows / Columns / Cross-point coloring //

inputSelectedRow.addEventListener('input', select);
inputSelectedColumn.addEventListener('input', select);

// row -  green
// column - red
// cross-point - blue

function select() {

    if (+inputSelectedRow.value) {
        selectedRow = +inputSelectedRow.value;
    }

    if (+inputSelectedColumn.value) {
        selectedColumn = +inputSelectedColumn.value;
    }

    // if (!(selectedRow >=0 && selectedColumn >=0)) {
    //     alert(`Both values are required!`)
    //     return;
    // }

    addGreen(selectedRow);
    addRed(selectedColumn);
    addBlue(selectedRow, selectedColumn);

}

function addGreen(selectedRow) {

    if (document.querySelector('.bg-green')) {
        document.querySelector('.bg-green').classList.remove("bg-green")
    }
    const rowElem = document.querySelector('.table').rows[selectedRow - 1];
    rowElem.classList.add('bg-green');

}

function addRed(selectedColumn) {

    if (document.querySelectorAll('.bg-red')) {
        for (let elem of document.querySelectorAll('.bg-red')) {
            elem.classList.remove('bg-red');
        };
    }

    for (let elem of document.querySelector('.table').rows) {
        elem.cells[selectedColumn - 1].classList.add("bg-red");
    }
}

function addBlue(selectedRow, selectedColumn) {

    if (document.querySelector('.bg-blue')) {
        document.querySelector('.bg-blue').classList.remove("bg-blue");
    }

    document.querySelector('.table')
        .rows[selectedRow - 1]
        .cells[selectedColumn - 1]
        .classList.add("bg-blue");
}