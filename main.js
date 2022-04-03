'use strict';

(function createTable() {
    const formFields = getFormFields();

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
   
    function removeOldTable(tableElement){
        tableElement.remove();
    }

    function resetSelectionFields(formFields) {
        formFields.selectedRow.value = '';
        formFields.selectedColumn.value = '';
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
        const declaredNumOfRows = parseInt(formFields.numOfRows.value);
        const declaredNumOfColumns = parseInt(formFields.numOfColumns.value);
        const declaredSelectedRow = parseInt(formFields.selectedRow.value);
        const declaredSelectedColumn = parseInt(formFields.selectedColumn.value);
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
        const declaredNumOfRows = parseInt(formFields.numOfRows.value);
        const declaredNumOfColumns = parseInt(formFields.numOfColumns.value);
        const declaredSelectedRow = parseInt(formFields.selectedRow.value);
        const declaredSelectedColumn = parseInt(formFields.selectedColumn.value);

        if (declaredSelectedRow > declaredNumOfRows) {
            formFields.selectedRow.classList.add('validationError');
        }

        if (declaredSelectedColumn > declaredNumOfColumns) {
            formFields.selectedColumn.classList.add('validationError');
        }

        if (document.querySelector('.validationError')) {
            document.querySelector('.validationErrorBox').classList.remove('hidden');
        }
    }

    function setPlaceholder(selector, value) {
        selector.setAttribute('placeholder', value);
    }

    function setPlaceholders(formFields) {
        const numOfRows = formFields.numOfRows.value;
        const numOfColumns = formFields.numOfColumns.value;
        
        const selectedRowPlaceholder = numOfRows > 0 ? `value 1 - ${numOfRows}` : 'value > 0';
        const selectedColumnPlaceholder = numOfColumns > 0 ? `value 1 - ${numOfColumns}` : 'value > 0';

        setPlaceholder(formFields.selectedRow, selectedRowPlaceholder);
        setPlaceholder(formFields.selectedColumn, selectedColumnPlaceholder);
    }

    function disableSelectionField(field, value) {
        field.disabled = value;
    }

    function disableSelectionFields(formFields) {
        const declaredNumOfRows = parseInt(formFields.numOfRows.value);
        const declaredNumOfColumns = parseInt(formFields.numOfColumns.value);
        const declaredSelectedRow = parseInt(formFields.selectedRow.value);
        const declaredSelectedColumn = parseInt(formFields.selectedColumn.value);
                  
        const selectedRowDisabledStatus = declaredNumOfRows > 0 || declaredSelectedRow > 0;
        const selectedColumnDisabledStatus = declaredNumOfColumns > 0 || declaredSelectedColumn > 0;
            
        disableSelectionField(formFields.selectedRow, !selectedRowDisabledStatus);
        disableSelectionField(formFields.selectedColumn, !selectedColumnDisabledStatus);
    } 

    function handleFormChange() {
        const tableElement = document.querySelector('.table-container');
        const validationErrorElements = document.querySelectorAll('.validationError');
        const formFields = getFormFields();
        const numOfRows = formFields.numOfRows.value;
        const numOfColumns = formFields.numOfColumns.value;

        if (tableElement) removeOldTable(tableElement);

        if (!(numOfRows || numOfColumns)) resetSelectionFields(formFields);

        if (numOfRows && numOfColumns) addNewTable(formFields);  

        if (validationErrorElements.length) removeValidationErrorStyles(validationErrorElements);

        addValidationErrorStyles(formFields);
        setPlaceholders(formFields);
        disableSelectionFields(formFields);       
    }

    Object.values(formFields).forEach(field => field.addEventListener('keydown', hasClickedForbiddenKey));
    Object.values(formFields).forEach(field => field.addEventListener('input', handleFormChange));
})();