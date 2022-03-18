'use strict';

(function createTable() {
    const tableInputs = ['numOfRows', 'numOfColumns', 'selectedRow', 'selectedColumn'];

    tableInputs.forEach((idName) => document.getElementById(`${idName}`)
        .addEventListener('keydown', buildTableForValidData));
    tableInputs.forEach((idName) => document.getElementById(`${idName}`)
        .addEventListener('keydown', checkValAll));    

    function checkValAll(e) {
        if (((e.target.value === '' || e.target.value === '0') && e.key === '0')
            || (!((parseInt(e.key) <= 9) || ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'].includes(e.key)))) {
            e.preventDefault();
        }
    }

    function getNumericValueById(elemId) {
        return parseInt(document.getElementById(elemId).value);
    }

    function buildTableForValidData(e) {
        document.getElementById('numOfRows').addEventListener('input', setPlaceholder);
        document.getElementById('numOfColumns').addEventListener('input', setPlaceholder);

        function setPlaceholder(e) {
            if (e.target === document.getElementById('numOfRows')) {
                if (e.target.value > 0) {
                    document.getElementById('selectedRow').setAttribute('placeholder', `value 1 - ${e.target.value}`);
                } else {
                    document.getElementById('selectedRow').setAttribute('placeholder', `value > 0`);
                }
            }

            if (e.target === document.getElementById('numOfColumns')) {
                if (e.target.value > 0) {
                    document.getElementById('selectedColumn').setAttribute('placeholder', `value 1 - ${e.target.value}`);
                } else {
                    document.getElementById('selectedColumn').setAttribute('placeholder', `value > 0`);
                }
            }
        }

        document.getElementById('numOfRows').addEventListener('input', removeOldTable)
        document.getElementById('numOfColumns').addEventListener('input', removeOldTable)

        function removeOldTable(){
            if (document.querySelector('.table-container')) {
                document.querySelector('.table-container').remove();
                document.getElementById('selectedRow').value = '';
                document.getElementById('selectedColumn').value = '';
            }
        }

        document.getElementById('numOfRows').addEventListener('input', addNewTable)
        document.getElementById('numOfColumns').addEventListener('input', addNewTable)

        function addNewTable() {
            const declaredNumOfRows = getNumericValueById('numOfRows');
            const declaredNumOfColumns = getNumericValueById('numOfColumns');

            if (declaredNumOfRows && declaredNumOfColumns) {
                const arrOfElements = createArrayOfTabElem();
                appendTableElements(...arrOfElements);
                addValues();
            }

            function createArrayOfTabElem() {
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
                
                return [newTableCont, newTable, newTBody, newRow, newDataCell];
            }        

            function appendTableElements(newTableCont, newTable, newTBody, newRow, newDataCell) {
                const arrOfColumns = Array(declaredNumOfColumns)
                    .fill(null)
                    .map(() => newDataCell.cloneNode());

                newRow.append(...arrOfColumns);

                const arrOfRows = Array(declaredNumOfRows)
                    .fill(null)
                    .map(() => newRow.cloneNode(true));

                newTBody.append(...arrOfRows);
                newTable.append(newTBody);
                newTableCont.append(newTable);
                document.querySelector('section').append(newTableCont);  
            }
        }

        function addValues() {
            if (document.querySelector('.table')) {
                Array.from(document.querySelector('.table').rows).forEach((row, rowIndex) => {
                    Array.from(row.cells).forEach((cell, colIndex) => {
                        cell.innerHTML = `${rowIndex + 1}${colIndex + 1}`;
                    })
                }); 
            }
        }

        document.getElementById('selectedRow').addEventListener('input', selectRowColumnCell);
        document.getElementById('selectedColumn').addEventListener('input', selectRowColumnCell);

        function selectRowColumnCell() {
            let selectedRow = null;
            let selectedColumn = null;

            if (getNumericValueById('selectedRow')) {
                selectedRow = getNumericValueById('selectedRow');
            }

            if (getNumericValueById('selectedColumn')) {
                selectedColumn = getNumericValueById('selectedColumn');
            }

            function markSelectedRow() {
                if (document.querySelector('.bg-green')) {
                    document.querySelector('.bg-green').classList.remove('bg-green');
                }

                if (selectedRow > document.querySelector('.table').rows.length) return;

                if (selectedRow) {
                    const rowElem = document.querySelector('.table').rows[selectedRow - 1];
                    rowElem.classList.add('bg-green');
                }
            }
            markSelectedRow();

            function markSelectedColumn() {
                if (document.querySelectorAll('.bg-red')) {
                    document.querySelectorAll('.bg-red').forEach((elem) => elem.classList.remove('bg-red'));
                }

                if (selectedColumn > document.querySelector('.table').rows[0].cells.length) return;

                if (selectedColumn) {
                    Array.from(document.querySelector('.table').rows).forEach((elem) => {
                        elem.cells[selectedColumn - 1].classList.add('bg-red');
                    });
                }
            }
            markSelectedColumn();

            function markSelectedCell() {
                if (document.querySelector('.bg-blue')) {
                    document.querySelector('.bg-blue').classList.remove('bg-blue');
                }

                if ((selectedRow && selectedColumn)
                    && !(selectedRow > document.querySelector('.table').rows.length
                        && selectedColumn > document.querySelector('.table').rows[0].cells.length)) {
                    document.querySelector('.table')
                        .rows[selectedRow - 1]
                        .cells[selectedColumn - 1]
                        .classList.add('bg-blue');
                }
            }
            markSelectedCell();
        }

        tableInputs.forEach((idName) => {
            document.getElementById(`${idName}`).addEventListener('input', removeValidationErrorStyles);
        });

        tableInputs.forEach((idName) => {
            document.getElementById(`${idName}`).addEventListener('input', addValidationErrorStyles);
        });

        // function addValidationErrorStyles(e) {
        //     if (document.querySelectorAll('.validationError')) {
        //         Array.from(document.querySelectorAll('.validationError'))
        //             .forEach((value) => value.classList.remove('validationError'));
        //     }

        //     if (getNumericValueById('selectedRow') > getNumericValueById('numOfRows')) {
        //         document.getElementById('selectedRow').classList.add('validationError');
        //     }

        //     if (getNumericValueById('selectedColumn') > getNumericValueById('numOfColumns')) {
        //         document.getElementById('selectedColumn').classList.add('validationError');
        //     }

        //     if (!document.querySelector('.validationError')) {
        //         document.querySelector('.validationErrorBox').classList.add('hidden');
        //     } else {
        //         document.querySelector('.validationErrorBox').classList.remove('hidden');
        //     }
        // }

        function removeValidationErrorStyles(e) {
            if (document.querySelectorAll('.validationError')) {
                Array.from(document.querySelectorAll('.validationError'))
                    .forEach((value) => value.classList.remove('validationError'));
            }

            if (!document.querySelector('.validationError')) {
                document.querySelector('.validationErrorBox').classList.add('hidden');
            }
        }

        function addValidationErrorStyles(e) {
            if (getNumericValueById('selectedRow') > getNumericValueById('numOfRows')) {
                document.getElementById('selectedRow').classList.add('validationError');
            }

            if (getNumericValueById('selectedColumn') > getNumericValueById('numOfColumns')) {
                document.getElementById('selectedColumn').classList.add('validationError');
            }

            if (document.querySelector('.validationError')) {
                document.querySelector('.validationErrorBox').classList.remove('hidden');
            }
        }
    }
})();