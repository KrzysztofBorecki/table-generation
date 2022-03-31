'use strict';

(function createTable() {
    function getFormFields() {
        return [
            'numOfRows',
            'numOfColumns',
            'selectedRow',
            'selectedColumn'
        ].reduce((formFields, fieldName) => {
            formFields[fieldName] = document.getElementById(fieldName);
            
            return formFields;
        }, {});
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
        // tymczasowe - docelowo setPlaceholders(formFields)
        const formFields = getFormFields();
        // end
        const numOfRows = formFields.numOfRows.value;
        const numOfColumns = formFields.numOfColumns.value;
        
        const selectedRowPlaceholder = numOfRows > 0 ? `value 1 - ${numOfRows}` : 'value > 0';
        const selectedColumnPlaceholder = numOfColumns > 0 ? `value 1 - ${numOfColumns}` : 'value > 0';

        setPlaceholder(formFields.selectedRow, selectedRowPlaceholder);
        setPlaceholder(formFields.selectedColumn, selectedColumnPlaceholder);
    }

    function disableSelectingField(selector, value) {
        selector.disabled = value;
    }

    function disableSelectingFields() {
        // tymczasowe - docelowo disableSelectingFields(formFields)
        const formFields = getFormFields();
        // end
        
        const selectedRowDisableStatus = formFields.numOfRows.value > 0 ||
            formFields.selectedRow.value > 0;
        const selectedColumnDisableStatus = formFields.numOfColumns.value > 0 ||
            formFields.selectedColumn.value > 0;
            
        disableSelectingField(formFields.selectedRow, !selectedRowDisableStatus);
        disableSelectingField(formFields.selectedColumn, !selectedColumnDisableStatus);
    } 

    function removeOldTable(){
        // tymczasowe - docelowo removeOldTable(formFields)
        const formFields = getFormFields();
        // end
        const tableElement = document.querySelector('.table-container');

        if (tableElement) {
            tableElement.remove();
        }
        // if () {
        //     formFields.selectedRow.value = '';
        //     formFields.selectedColumn.value = '';
        // }
    }

    function createTableElements() {
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
        declaredSelectedRow,
        declaredSelectedColumn, 
        newTableCont, 
        newTable, 
        newTBody, 
        newRow, 
        newDataCell
    ) {
        // const arrOfColumns = Array(declaredNumOfColumns)
        //     .fill(null)
        //     .map(() => newDataCell.cloneNode());

        // newRow.append(...arrOfColumns);

        // const arrOfRows = Array(declaredNumOfRows)
        //     .fill(null)
        //     .map(() => newRow.cloneNode(true));

        // newTBody.append(...arrOfRows);

        const columnElements = Array(declaredNumOfColumns)
            .fill(null)
            .map((_, idx) => {
                const clonedElement = newDataCell.cloneNode();
                if (declaredSelectedColumn && idx === declaredSelectedColumn - 1) {
                    clonedElement.classList.add('selected-column');
                }
                return clonedElement;
        });
   
        newRow.append(...columnElements);

        const rowElements = Array(declaredNumOfRows)
        .fill(null)
        .map((_, idx) => {
            const clonedElement = newRow.cloneNode(true);
            
            if (declaredSelectedRow && idx === declaredSelectedRow - 1) {
                clonedElement.classList.add('selected-row');
            }
            
            return clonedElement;
        });

        newTBody.append(...rowElements);
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
        const declaredSelectedRow = getNumericValueById('selectedRow');
        const declaredSelectedColumn = getNumericValueById('selectedColumn');

        if (declaredNumOfRows && declaredNumOfColumns) {
            const arrOfElements = createTableElements();
            appendTableElements(declaredNumOfRows, declaredNumOfColumns, declaredSelectedRow, declaredSelectedColumn, ...arrOfElements);
            addValues();
        }
    }

    // function markSelectedRow(selectedRow) {
    //     if (document.querySelector('.selected-row')) {
    //         document.querySelector('.selected-row').classList.remove('selected-row');
    //     }

    //     if (selectedRow > document.querySelector('.table').rows.length) return;

    //     if (selectedRow) {
    //         const rowElem = document.querySelector('.table').rows[selectedRow - 1];
    //         rowElem.classList.add('selected-row');
    //     }
    // }

    // function markSelectedColumn(selectedColumn) {
    //     if (document.querySelectorAll('.selected-column')) {
    //         document.querySelectorAll('.selected-column')
    //             .forEach((elem) => elem.classList.remove('selected-column'));
    //     }

    //     if (selectedColumn > document.querySelector('.table').rows[0].cells.length) return;

    //     if (selectedColumn) {
    //         Array.from(document.querySelector('.table').rows).forEach((elem) => {
    //             elem.cells[selectedColumn - 1].classList.add('selected-column');
    //         });
    //     }
    // }

    // function selectRowColumn() {
    //     let selectedRow = null;
    //     let selectedColumn = null;

    //     if (getNumericValueById('selectedRow')) {
    //         selectedRow = getNumericValueById('selectedRow');
    //     }

    //     if (getNumericValueById('selectedColumn')) {
    //         selectedColumn = getNumericValueById('selectedColumn');
    //     }

    //     markSelectedRow(selectedRow);
    //     markSelectedColumn(selectedColumn);
    // }

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

    // document.getElementById('numOfRows').addEventListener('input', removeOldTable);
    // document.getElementById('numOfColumns').addEventListener('input', removeOldTable);

    // document.getElementById('numOfRows').addEventListener('input', addNewTable)
    // document.getElementById('numOfColumns').addEventListener('input', addNewTable)

    // document.getElementById('selectedRow').addEventListener('input', selectRowColumn);
    // document.getElementById('selectedColumn').addEventListener('input', selectRowColumn);

    const formFields = getFormFields();

    Object.values(formFields).forEach(field => field.addEventListener('input', removeOldTable)); 
    Object.values(formFields).forEach(field => field.addEventListener('input', addNewTable)); 
    Object.values(formFields).forEach(field => field.addEventListener('keydown', hasClickedForbiddenKey));
    Object.values(formFields).forEach(field => field.addEventListener('input', disableSelectingFields));   
    Object.values(formFields).forEach(field => field.addEventListener('input', removeValidationErrorStyles));
    Object.values(formFields).forEach(field => field.addEventListener('input', addValidationErrorStyles)); 
})();