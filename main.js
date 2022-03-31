'use strict';

(function createTable() {
    const listOfFormFieldsNames = [
        'numOfRows', 
        'numOfColumns', 
        'selectedRow', 
        'selectedColumn'
    ];

    function getFormFields() {
        const listOfFormFields = {};
        
        listOfFormFieldsNames.forEach((nameOfFormField) => {
            listOfFormFields[nameOfFormField] = document.getElementById(nameOfFormField)
        });
        return listOfFormFields;
    }

    function hasClickedForbiddenKey(e) {
        if (
            ((e.target.value === '' || e.target.value === '0') && e.key === '0')
            || (!((parseInt(e.key) <= 9) 
            || ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'].includes(e.key)))
        ) {
            e.preventDefault();
        }
    }

    function getNumericValueById(elementId) {
        return parseInt(document.getElementById(elementId).value);
    }

    function setPlaceholder(selector, value) {
        selector.setAttribute('placeholder', value);
    }

    function setPlaceholders() {
        const listOfFormFields = getFormFields();
        const selectedRowPlaceholder = (listOfFormFields.numOfRows.value > 0) 
            ? `value 1 - ${listOfFormFields.numOfRows.value}` : 'value > 0';
        const selectedColumnPlaceholder = (listOfFormFields.numOfColumns.value > 0) 
            ? `value 1 - ${listOfFormFields.numOfColumns.value}` : 'value > 0';

        setPlaceholder(listOfFormFields.selectedRow, selectedRowPlaceholder);
        setPlaceholder(listOfFormFields.selectedColumn, selectedColumnPlaceholder);
    } 

    function disableSelectingField(selector, value) {
        selector.disabled = value;
    }

    function disableSelectingFields() {
        const listOfFormFields = getFormFields();
        const selectedRowDisableStatus = listOfFormFields.numOfRows.value > 0 ||
            listOfFormFields.selectedRow.value > 0;
        const selectedColumnDisableStatus = listOfFormFields.numOfColumns.value > 0 ||
            listOfFormFields.selectedColumn.value > 0;
            
        disableSelectingField(listOfFormFields.selectedRow, !selectedRowDisableStatus);
        disableSelectingField(listOfFormFields.selectedColumn, !selectedColumnDisableStatus);
    } 

    function removeOldTable(){
        if (document.querySelector('.table-container')) {
            document.querySelector('.table-container').remove();
            document.getElementById('selectedRow').value = '';
            document.getElementById('selectedColumn').value = '';
        }
    }

    function createArrayOfTabElem() {
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
        
        return [newTableCont, newTable, newTBody, newRow, newDataCell];
    }        

    function appendTableElements(
        declaredNumOfRows, 
        declaredNumOfColumns, 
        newTableCont, 
        newTable, 
        newTBody, 
        newRow, 
        newDataCell
    ) {
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

    function addValues() {
        if (document.querySelector('.table')) {
            Array.from(document.querySelector('.table').rows).forEach((row, rowIndex) => {
                Array.from(row.cells).forEach((cell, colIndex) => {
                    cell.innerHTML = `${rowIndex + 1}${colIndex + 1}`;
                })
            }); 
        }
    }

    function addNewTable() {
        const declaredNumOfRows = getNumericValueById('numOfRows');
        const declaredNumOfColumns = getNumericValueById('numOfColumns');

        if (declaredNumOfRows && declaredNumOfColumns) {
            const arrOfElements = createArrayOfTabElem();
            appendTableElements(declaredNumOfRows, declaredNumOfColumns, ...arrOfElements);
            addValues();
        }
    }

    function markSelectedRow(selectedRow) {
        if (document.querySelector('.bg-green')) {
            document.querySelector('.bg-green').classList.remove('bg-green');
        }

        if (selectedRow > document.querySelector('.table').rows.length) return;

        if (selectedRow) {
            const rowElem = document.querySelector('.table').rows[selectedRow - 1];
            rowElem.classList.add('bg-green');
        }
    }

    function markSelectedColumn(selectedColumn) {
        if (document.querySelectorAll('.bg-red')) {
            document.querySelectorAll('.bg-red')
                .forEach((elem) => elem.classList.remove('bg-red'));
        }

        if (selectedColumn > document.querySelector('.table').rows[0].cells.length) return;

        if (selectedColumn) {
            Array.from(document.querySelector('.table').rows).forEach((elem) => {
                elem.cells[selectedColumn - 1].classList.add('bg-red');
            });
        }
    }

    function markSelectedCell(selectedRow, selectedColumn) {
        if (document.querySelector('.bg-blue')) {
            document.querySelector('.bg-blue').classList.remove('bg-blue');
        }

        if (
            (selectedRow && selectedColumn) && 
            !(selectedRow > document.querySelector('.table').rows.length && 
            selectedColumn > document.querySelector('.table').rows[0].cells.length)
        ) {
            document.querySelector('.table')
                .rows[selectedRow - 1]
                .cells[selectedColumn - 1]
                .classList.add('bg-blue');
        }
    }

    function selectRowColumnCell() {
        let selectedRow = null;
        let selectedColumn = null;

        if (getNumericValueById('selectedRow')) {
            selectedRow = getNumericValueById('selectedRow');
        }

        if (getNumericValueById('selectedColumn')) {
            selectedColumn = getNumericValueById('selectedColumn');
        }

        markSelectedRow(selectedRow);
        markSelectedColumn(selectedColumn);
        markSelectedCell(selectedRow, selectedColumn);
    }

    function removeValidationErrorStyles() {
        if (document.querySelectorAll('.validationError')) {
            Array.from(document.querySelectorAll('.validationError'))
                .forEach((value) => value.classList.remove('validationError'));
        }

        if (!document.querySelector('.validationError')) {
            document.querySelector('.validationErrorBox').classList.add('hidden');
        }
    }

    function addValidationErrorStyles() {
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

    document.getElementById('numOfRows').addEventListener('input', setPlaceholders);
    document.getElementById('numOfColumns').addEventListener('input', setPlaceholders);

    document.getElementById('numOfRows').addEventListener('input', removeOldTable);
    document.getElementById('numOfColumns').addEventListener('input', removeOldTable);

    document.getElementById('numOfRows').addEventListener('input', addNewTable)
    document.getElementById('numOfColumns').addEventListener('input', addNewTable)

    document.getElementById('selectedRow').addEventListener('input', selectRowColumnCell);
    document.getElementById('selectedColumn').addEventListener('input', selectRowColumnCell);

    listOfFormFieldsNames.forEach((elementId) => {
        document.getElementById(`${elementId}`).addEventListener('keydown', hasClickedForbiddenKey);
    });

    listOfFormFieldsNames.forEach((elementId) => {
        document.getElementById(`${elementId}`).addEventListener('input', disableSelectingFields);
    }); 
    
    listOfFormFieldsNames.forEach((elementId) => {
        document.getElementById(`${elementId}`).addEventListener('input', removeValidationErrorStyles);
    });

    listOfFormFieldsNames.forEach((elementId) => {
        document.getElementById(`${elementId}`).addEventListener('input', addValidationErrorStyles);
    }); 
})();