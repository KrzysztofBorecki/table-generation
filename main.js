'use strict';

(function createTable() {
    const formFields = getFormFields();

//     function getFormFields() {
//         return [
//             'numOfRows',
//             'numOfColumns',
//             'selectedRow',
//             'selectedColumn'
//         ].reduce((formFields, fieldName) => {
//             formFields[fieldName] = document.getElementById(fieldName);

//             return formFields;
//         }, {});
//     }

    function getFormFields() {
        return [
            'numOfRows',
            'numOfColumns',
            'selectedRow',
            'selectedColumn'
        ].reduce((formFields, fieldName) => {
            const formField = {}

            formField['element'] = document.getElementById(fieldName)
            formField['parsedValue'] = parseInt(document.getElementById(fieldName).value);
            
            formFields[fieldName] = formField;

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

    function removeOldTable(tableElement){
        tableElement.remove();
    }

    function resetSelectionFields(formFields) {
        formFields.selectedRow.element.value = '';
        formFields.selectedColumn.element.value = '';
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

        return [
            newTableCont, 
            newTable, 
            newTBody, 
            newRow, 
            newDataCell
        ];
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
        Array.from(document.querySelector('.table').rows).forEach((row, rowIndex) => {
            Array.from(row.cells).forEach((cell, colIndex) => {
                cell.innerHTML = `${rowIndex + 1}${colIndex + 1}`;
            })
        });
    }

    function addNewTable(formFields) {
        const declaredNumOfRows = formFields.numOfRows.parsedValue;
        const declaredNumOfColumns = formFields.numOfColumns.parsedValue;
        const declaredSelectedRow = formFields.selectedRow.parsedValue;
        const declaredSelectedColumn = formFields.selectedColumn.parsedValue;
        const tableElements = createTableElements();

        appendTableElements(
            declaredNumOfRows,
            declaredNumOfColumns,
            declaredSelectedRow,
            declaredSelectedColumn,
            ...tableElements
        );
        addValues();
    }

    function removeValidationErrorStyles(validationErrorElements) {
        Array.from(validationErrorElements)
            .forEach((field) => field.classList.remove('validationError'));

        document.querySelector('.validationErrorBox').classList.add('hidden');
    }

    function addValidationErrorStyles(formFields) {
        const declaredNumOfRows = formFields.numOfRows.parsedValue;
        const declaredNumOfColumns = formFields.numOfColumns.parsedValue;
        const declaredSelectedRow = formFields.selectedRow.parsedValue;
        const declaredSelectedColumn = formFields.selectedColumn.parsedValue;

        if (declaredSelectedRow > declaredNumOfRows) {
            formFields.selectedRow.element.classList.add('validationError');
        }

        if (declaredSelectedColumn > declaredNumOfColumns) {
            formFields.selectedColumn.element.classList.add('validationError');
        }

        if (document.querySelector('.validationError')) {
            document.querySelector('.validationErrorBox').classList.remove('hidden');
        }
    }

    function setPlaceholder(selector, value) {
        selector.setAttribute('placeholder', value);
    }

    function setPlaceholders(formFields) {
        const numOfRows = formFields.numOfRows.element.value;
        const numOfColumns = formFields.numOfColumns.element.value;
        
        const selectedRowPlaceholder = numOfRows > 0 ? `value 1 - ${numOfRows}` : 'value > 0';
        const selectedColumnPlaceholder = numOfColumns > 0 ? `value 1 - ${numOfColumns}` : 'value > 0';

        setPlaceholder(formFields.selectedRow.element, selectedRowPlaceholder);
        setPlaceholder(formFields.selectedColumn.element, selectedColumnPlaceholder);
    }

    function disableSelectionField(field, value) {
        field.disabled = value;
    }

    function disableSelectionFields(formFields) {
        const declaredNumOfRows = formFields.numOfRows.parsedValue;
        const declaredNumOfColumns = formFields.numOfColumns.parsedValue;
        const declaredSelectedRow = formFields.selectedRow.parsedValue;
        const declaredSelectedColumn = formFields.selectedColumn.parsedValue;

        const selectedRowDisabledStatus = declaredNumOfRows > 0 || declaredSelectedRow > 0;
        const selectedColumnDisabledStatus = declaredNumOfColumns > 0 || declaredSelectedColumn > 0;
            
        disableSelectionField(formFields.selectedRow.element, !selectedRowDisabledStatus);
        disableSelectionField(formFields.selectedColumn.element, !selectedColumnDisabledStatus);
    } 

    function handleFormChange() {
        const tableElement = document.querySelector('.table-container');
        const validationErrorElements = document.querySelectorAll('.validationError');
        const formFields = getFormFields();
        const declaredNumOfRows = formFields.numOfRows.parsedValue;
        const declaredNumOfColumns = formFields.numOfColumns.parsedValue;

        if (tableElement) removeOldTable(tableElement);

        if (!(declaredNumOfRows || declaredNumOfColumns)) {
            resetSelectionFields(formFields);
        } 

        if (declaredNumOfRows && declaredNumOfColumns) {
            addNewTable(formFields);
        }  

        if (validationErrorElements.length) {
            removeValidationErrorStyles(validationErrorElements);
        }

        addValidationErrorStyles(formFields);
        setPlaceholders(formFields);
        disableSelectionFields(formFields);
    }

    Object.values(formFields).forEach(field => field.element.addEventListener('keydown', hasClickedForbiddenKey));
    Object.values(formFields).forEach(field => field.element.addEventListener('input', handleFormChange));
})();