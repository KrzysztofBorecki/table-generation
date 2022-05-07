'use strict';

(function createTable() {
    const SELECTED_COLUMN_CLASS = 'selected-column';
    const SELECTED_ROW_CLASS = 'selected-row';
    const TABLE_CELL_CLASS = 'table-cell';
    const TABLE_BODY_CLASS = 'table-body';
    const TABLE_CONTAINER_CLASS = 'table-container';
    const TABLE_CLASS = 'table';
    const SECTION_CLASS = 'section';
    const HIDDEN_CLASS = 'hidden';
    const ERROR_VALIDATION_CLASS = 'validationError';
    const ERROR_BOX_VALIDATION_CLASS = 'validationErrorBox';
    const NUMBER_OF_ROWS_FIELD_ID = 'number-of-rows';
    const NUMBER_OF_COLUMNS_FIELD_ID = 'number-of-columns';
    const SELECTED_ROW_FIELD_ID = 'selected-row';
    const SELECTED_COLUMN_FIELD_ID = 'selected-column';
    const FORM_FIELDS = [NUMBER_OF_ROWS_FIELD_ID, NUMBER_OF_COLUMNS_FIELD_ID, SELECTED_ROW_FIELD_ID, SELECTED_COLUMN_FIELD_ID];
    const FORBIDDEN_KEYS = ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Tab'];

    const formFields = getFormFields();

    function getParsedFieldName(fieldName) {
        return fieldName.split('-').map((word, idx) => {
            if (!idx) return word;

            return `${word[0].toUpperCase()}${word.slice(1)}`;
        }).join('');
    }

    function getFormFieldElement(fieldName) {
        return document.getElementById(fieldName)
    }

    function getFormFieldParsedValue(fieldName) {
        return parseInt(document.getElementById(fieldName).value);
    }

    function getFormFields() {
        return FORM_FIELDS.reduce((formFields, fieldName) => {
            const formField = {};
            const parsedFieldName = getParsedFieldName(fieldName);

            formField.element = getFormFieldElement(fieldName);
            formField.parsedValue = getFormFieldParsedValue(fieldName);

            formFields[parsedFieldName] = formField;

            return formFields;
        }, {});
    }

    function hasClickedForbiddenKey(e) {
        if (
            ((e.target.value === '' || e.target.value === '0') && e.key === '0')
            || (!((parseInt(e.key) <= 9) 
            || FORBIDDEN_KEYS.includes(e.key)))
        ) {
            e.preventDefault();
        }
    }

    function removeElement(element) {
        element.remove();
    }

    function resetFields(...selectionFields) {
        selectionFields.forEach(field => field.value = '');
    }

    function createCellValue(rowIdx, colIdx) {
        return `${rowIdx + 1}${colIdx + 1}`;
    }

    function createTableCell(rowIdx, colIdx) {
        const tableCell = document.createElement('td');

        tableCell.classList.add(TABLE_CELL_CLASS); 
        tableCell.innerHTML = createCellValue(rowIdx, colIdx);

        return tableCell;
    }

    function createTableCells(numberOfColumns, selectedColumn, rowIdx) {
        const tableCells = Array(numberOfColumns)
            .fill(null)
            .map((_, colIdx) => {
                const tableCell = createTableCell(rowIdx, colIdx);

                if (selectedColumn && colIdx === selectedColumn - 1) {
                    tableCell.classList.add(SELECTED_COLUMN_CLASS);
                }

                return tableCell;
            });

        return tableCells;
    } 

    function createTableRows(numberOfRows, numberOfColumns, selectedRow, selectedColumn) {
        const tableRows = Array(numberOfRows)
            .fill(null)
            .map((_, rowIdx) => {
                const tableRow = document.createElement('tr');
                const tableCells = createTableCells(numberOfColumns, selectedColumn, rowIdx);

                tableRow.append(...tableCells);

                const clonedRow = tableRow.cloneNode(true);

                if (selectedRow && rowIdx === selectedRow - 1) {
                    clonedRow.classList.add(SELECTED_ROW_CLASS);
                }

                return clonedRow;
            });

        return tableRows;
    }

    function createTableBody(numberOfRows, numberOfColumns, selectedRow, selectedColumn) {
        const tableRows = createTableRows(numberOfRows, numberOfColumns, selectedRow, selectedColumn);
        const tableBody = document.createElement('tbody');

        tableBody.classList.add(TABLE_BODY_CLASS);
        tableBody.append(...tableRows);

        return tableBody;
    }

    function createTable(numberOfRows, numberOfColumns, selectedRow, selectedColumn) {
        const tableBody = createTableBody(numberOfRows, numberOfColumns, selectedRow, selectedColumn);
        const table = document.createElement('table');

        table.classList.add(TABLE_CLASS);
        table.append(tableBody);

        return table;
    }

    function createTableContainer(numberOfRows, numberOfColumns, selectedRow, selectedColumn) {
        const table = createTable(numberOfRows, numberOfColumns, selectedRow, selectedColumn);
        const tableContainer = document.createElement('div');

        tableContainer.classList.add(TABLE_CONTAINER_CLASS);
        tableContainer.append(table);

        return tableContainer;
    }

    function appendTable(numberOfRows, numberOfColumns, selectedRow, selectedColumn) {
        const tableContainer = createTableContainer(numberOfRows, numberOfColumns, selectedRow, selectedColumn);

        document.querySelector(SECTION_CLASS).append(tableContainer);
    }

    function addTable(numberOfRows, numberOfColumns, selectedRow, selectedColumn) {
        appendTable(numberOfRows, numberOfColumns, selectedRow, selectedColumn);
    }

    function removeValidationErrorStyles(validationErrorFields) {
        Array.from(validationErrorFields)
            .forEach((field) => field.classList.remove(ERROR_VALIDATION_CLASS));

        document.querySelector(`.${ERROR_BOX_VALIDATION_CLASS}`).classList.add(HIDDEN_CLASS);
    }

    function addValidationErrorStyles(
            numberOfRows, numberOfColumns, 
            selectedRow, selectedColumn, 
            selectedRowElement, selectedColumnElement
        ) {
        if (selectedRow > numberOfRows) {
            selectedRowElement.classList.add(ERROR_VALIDATION_CLASS);
        }

        if (selectedColumn > numberOfColumns) {
            selectedColumnElement.classList.add(ERROR_VALIDATION_CLASS);
        }

        if (document.querySelector(`.${ERROR_VALIDATION_CLASS}`)) {
            document.querySelector(`.${ERROR_BOX_VALIDATION_CLASS}`).classList.remove(HIDDEN_CLASS);
        }
    }

    function setPlaceholder(selector, value) {
        selector.setAttribute('placeholder', value);
    }

    function setPlaceholders(
            numberOfRows, numberOfColumns, 
            selectedRowElement, selectedColumnElement
        ) {
        const selectedRowPlaceholder = numberOfRows > 0 ? `value 1 - ${numberOfRows}` : 'value > 0';
        const selectedColumnPlaceholder = numberOfColumns > 0 ? `value 1 - ${numberOfColumns}` : 'value > 0';

        setPlaceholder(selectedRowElement, selectedRowPlaceholder);
        setPlaceholder(selectedColumnElement, selectedColumnPlaceholder);
    }

    function disableSelectionField(field, value) {
        field.disabled = value;
    }

    function disableSelectionFields(
            numberOfRows, numberOfColumns, 
            selectedRow, selectedColumn, 
            selectedRowElement, selectedColumnElement
        ) {
        const selectedRowDisabledStatus = numberOfRows > 0 || selectedRow > 0;
        const selectedColumnDisabledStatus = numberOfColumns > 0 || selectedColumn > 0;

        disableSelectionField(selectedRowElement, !selectedRowDisabledStatus);
        disableSelectionField(selectedColumnElement, !selectedColumnDisabledStatus);
    } 

    function handleFormChange() {
        const table = document.querySelector(`.${TABLE_CONTAINER_CLASS}`);
        const validationErrorFields = document.querySelectorAll(`.${ERROR_VALIDATION_CLASS}`);
        const formFields = getFormFields();
        const numberOfRows = formFields.numberOfRows.parsedValue;
        const numberOfColumns = formFields.numberOfColumns.parsedValue;
        const selectedRow = formFields.selectedRow.parsedValue;
        const selectedColumn = formFields.selectedColumn.parsedValue;
        const selectedRowElement = formFields.selectedRow.element;
        const selectedColumnElement = formFields.selectedColumn.element;
        
        if (table) {
            removeElement(table);
        }

        if (!(numberOfRows || numberOfColumns)) {
            resetFields(selectedRowElement, selectedColumnElement);
        } 

        if (numberOfRows && numberOfColumns) {
            addTable(
                numberOfRows, numberOfColumns, 
                selectedRow, selectedColumn
            );
        }

        if (validationErrorFields.length) {
            removeValidationErrorStyles(validationErrorFields);
        }

        addValidationErrorStyles(
            numberOfRows, numberOfColumns, 
            selectedRow, selectedColumn, 
            selectedRowElement, selectedColumnElement
        );

        setPlaceholders(
            numberOfRows, numberOfColumns, 
            selectedRowElement, selectedColumnElement
        );

        disableSelectionFields(
            numberOfRows, numberOfColumns, 
            selectedRow, selectedColumn, 
            selectedRowElement, selectedColumnElement
        );
    }

    Object.values(formFields).forEach(field => field.element.addEventListener('keydown', hasClickedForbiddenKey));
    Object.values(formFields).forEach(field => field.element.addEventListener('input', handleFormChange));
})();