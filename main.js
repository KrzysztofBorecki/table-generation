"use strict";
(function createTable() {

    const inputNumOfRows = document.getElementById('numOfRows'),
        inputNumOfColumns = document.getElementById('numOfColumns'),
        inputSelectedRow = document.getElementById('selectedRow'),
        inputSelectedColumn = document.getElementById('selectedColumn');

    let declaredNumOfRows = null, 
        declaredNumOfColumns  = null, 
        selectedRow = null,
        selectedColumn = null;

    // Value validation //

    inputNumOfRows.addEventListener('keydown', checkValAll)
    inputNumOfColumns.addEventListener('keydown', checkValAll)

    inputSelectedRow.addEventListener('keydown', checkValAll)
    inputSelectedColumn.addEventListener('keydown', checkValAll)

    function checkValAll(e) {

        if (((e.target.value === '' || e.target.value === '0') && e.key === '0')
            || (!((parseInt(e.key) <= '9') || ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', "Tab"].includes(e.key)))) {
            e.preventDefault();
        }
    }

    inputSelectedRow.addEventListener('keydown', checkValSelect)
    inputSelectedColumn.addEventListener('keydown', checkValSelect)

    function checkValSelect(e) {   
        if (((e.target === inputSelectedRow) && parseInt(e.target.value+''+e.key) > declaredNumOfRows)
            || ((e.target === inputSelectedColumn) && parseInt(e.target.value+''+e.key) > declaredNumOfColumns)) {
            e.preventDefault();
        }
    }

    // Table creation //

    inputNumOfRows.addEventListener('input', addNewTable)
    inputNumOfColumns.addEventListener('input', addNewTable)
   
    function addNewTable(e) {

        declaredNumOfRows = parseInt(inputNumOfRows.value);
        declaredNumOfColumns = parseInt(inputNumOfColumns.value);

        if (document.querySelector('.table-container')) {
            document.querySelector('.table-container').remove();
            inputSelectedRow.value = "";
            inputSelectedColumn.value = "";
        }

        if (declaredNumOfRows && declaredNumOfColumns) {

            const newTableCont = document.createElement('div'),
                newTable = document.createElement('table'),
                newTBody = document.createElement('tbody'),
                newRow = document.createElement('tr'),
                newDataCell = document.createElement('td');

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

    // Rows / Columns / Cross-point selection & coloring //

    // row          = green
    // column       = red
    // cross-point  = blue

    inputSelectedRow.addEventListener('input', select);
    inputSelectedColumn.addEventListener('input', select);

    function select() {

        if (parseInt(inputSelectedRow.value)) {
            selectedRow = parseInt(inputSelectedRow.value);
        }

        if (parseInt(inputSelectedColumn.value)) {
            selectedColumn = parseInt(inputSelectedColumn.value);
        }

        if (selectedRow) addGreen(selectedRow);
        if (selectedColumn) addRed(selectedColumn);
        if (selectedRow && selectedColumn) addBlue(selectedRow, selectedColumn);
    
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

    // inputSelectedRow / inputSelectedColumn dynamic placeholders //

    inputNumOfRows.addEventListener('input', placeholder);
    inputNumOfColumns.addEventListener('input', placeholder);

    function placeholder(e) {

        if (e.target === inputNumOfRows) {          
            if (e.target.value > 0) {
                inputSelectedRow.setAttribute('placeholder', `value 1 - ${e.target.value}`);
            } else {
                inputSelectedRow.setAttribute('placeholder', `value > 0`);    
            }
        }

        if (e.target === inputNumOfColumns) {          
            if (e.target.value > 0) {
                inputSelectedColumn.setAttribute('placeholder', `value 1 - ${e.target.value}`);
            } else {
                inputSelectedColumn.setAttribute('placeholder', `value > 0`);    
            }
        }   
    }
})();