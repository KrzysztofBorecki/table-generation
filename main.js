'use strict';

(function createTable() {
    const tableInputs = ['numOfRows', 'numOfColumns', 'selectedRow', 'selectedColumn'];

    tableInputs.forEach((idName) => document.getElementById(`${idName}`)
        .addEventListener('keydown', buildTableForValidData));

    function checkValAll(e) {
        if (((e.target.value === '' || e.target.value === '0') && e.key === '0')
            || (!((parseInt(e.key) <= 9) || ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'].includes(e.key)))) {
            e.preventDefault();
        }
    }
    checkValAll(e);

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

        document.getElementById('numOfRows').addEventListener('input', addNewTable)
        document.getElementById('numOfColumns').addEventListener('input', addNewTable)

        function addNewTable(e) {
            let declaredNumOfRows = parseInt(document.getElementById('numOfRows').value);
            let declaredNumOfColumns = parseInt(document.getElementById('numOfColumns').value);

            if (document.querySelector('.table-container')) {
                document.querySelector('.table-container').remove();
                document.getElementById('selectedRow').value = '';
                document.getElementById('selectedColumn').value = '';
            }

            if (declaredNumOfRows && declaredNumOfColumns) {
                const arrOfColumns = [];
                const arrOfRows = [];
                const newTableCont = document.createElement('div');
                const newTable = document.createElement('table');
                const newTBody = document.createElement('tbody');
                const newRow = document.createElement('tr');
                const newDataCell = document.createElement('td');

                newTableCont.classList = 'table-container';
                newTable.classList = 'table';
                newTBody.classList = 'table-body'
                newRow.classList = 'table-row';
                newDataCell.classList = 'row-cell';

                for (let i = 0; i < declaredNumOfColumns; i++) {
                    arrOfColumns.push(newDataCell.cloneNode());
                }

                newRow.append(...arrOfColumns);
              
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
            if (document.querySelector('.table')) {
                for (let row of document.querySelector('.table').rows) {
                    let columnNumb = 1;
                    for (let cell of row.cells) {
                        cell.innerHTML = `${rowNumb}${columnNumb}`;
                        columnNumb += 1;
                    }
                    rowNumb += 1;
                }
            }
        }

        document.getElementById('selectedRow').addEventListener('input', selectRowColumnCell);
        document.getElementById('selectedColumn').addEventListener('input', selectRowColumnCell);

        function selectRowColumnCell() {
            let selectedRow = null;
            let selectedColumn = null;

            if (parseInt(document.getElementById('selectedRow').value)) {
                selectedRow = parseInt(document.getElementById('selectedRow').value);
            }

            if (parseInt(document.getElementById('selectedColumn').value)) {
                selectedColumn = parseInt(document.getElementById('selectedColumn').value);
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
            document.getElementById(`${idName}`).addEventListener('input', validationError);
        });

        function validationError(e) {
            if (document.querySelectorAll('.validationError')) {
                Array.from(document.querySelectorAll('.validationError'))
                    .forEach((value) => value.classList.remove('validationError'));
            }

            if (document.querySelector('.validationErrorBox')) {
                document.querySelector('.validationErrorBox').remove();
            }

            if (parseInt(document.getElementById('selectedRow').value) > parseInt(document.getElementById('numOfRows').value)) {
                document.getElementById('selectedRow').classList.add('validationError');
            }

            if (parseInt(document.getElementById('selectedColumn').value) > parseInt(document.getElementById('numOfColumns').value)) {
                document.getElementById('selectedColumn').classList.add('validationError');
            }

            if (document.querySelector('.validationError')) {
                const validationErrorBox = document.createElement('div');
                validationErrorBox.classList.add('validationErrorBox');
                validationErrorBox.textContent = `Error: Entered value is too high!\r\nPlease enter correct value!`;
                document.forms[0].after(validationErrorBox);
            }
        }
    }
})();