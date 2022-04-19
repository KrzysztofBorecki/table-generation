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

    function removeElement(tableElement){
        tableElement.remove();
    }

    function resetFields() {
        const selectionFields = [formFields.selectedRow, formFields.selectedColumn];
        selectionFields.forEach(field => field.value = '');
    }

    function addNewTable(formFields) {
        function addCellValue(rowIdx, colIdx) {
            return `${rowIdx + 1}${colIdx + 1}`;
        }

        function createDataCell(rowIdx, colIdx){
            const dataCell = document.createElement('td');

            dataCell.classList = 'row-cell'; 
            dataCell.innerHTML = addCellValue(rowIdx, colIdx);

            return dataCell;
        }

        function createRow(rowIdx) {
            const declaredNumOfColumns = formFields.numOfColumns.parsedValue;
            const declaredSelectedColumn = formFields.selectedColumn.parsedValue;

            const rowElement = Array(declaredNumOfColumns)
            .fill(null)
            .map((_, colIdx) => {
                const dataCell = createDataCell(rowIdx, colIdx);

                if (declaredSelectedColumn && colIdx === declaredSelectedColumn - 1) {
                    dataCell.classList.add('selected-column');
                }

                return dataCell;
            });

            return rowElement;
        } 

        function createRows(){
            const declaredNumOfRows = formFields.numOfRows.parsedValue;
            const declaredSelectedRow = formFields.selectedRow.parsedValue;

            const rowElements = Array(declaredNumOfRows)
            .fill(null)
            .map((_, rowIdx) => { 
                const newRow = document.createElement('tr');
                newRow.classList = 'table-row';

                const rowElement = createRow(rowIdx);
                newRow.append(...rowElement);

                const clonedElement = newRow.cloneNode(true);

                if (declaredSelectedRow && rowIdx === declaredSelectedRow - 1) {
                    clonedElement.classList.add('selected-row');
                }

                return clonedElement;
            });

            return rowElements;
        }

        function createTBody() {
            const rowElements = createRows();
            const newTBody = document.createElement('tbody');

            newTBody.classList = 'table-body'
            newTBody.append(...rowElements);

            return newTBody;
        }

        function createTable() {
            const newTBody = createTBody();
            const newTable = document.createElement('table');

            newTable.classList = 'table';
            newTable.append(newTBody);

            return newTable;
        }

        function createTableCont() {
            const newTable = createTable();
            const newTableCont = document.createElement('div');

            newTableCont.classList = 'table-container';
            newTableCont.append(newTable);

            return newTableCont;
        }

        function appendTable() {
            const newTableCont = createTableCont();

            document.querySelector('section').append(newTableCont);
        }

        appendTable();
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

        if (tableElement) removeElement(tableElement);

        if (!(declaredNumOfRows || declaredNumOfColumns)) {
            resetFields();
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