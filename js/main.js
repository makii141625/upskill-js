const tableKey = 'pb-table'

let pbTable;
let pbTableDemo = {
    'Mike Estopa': {
        'phone': '0916 452 9567'
    },
    'Ceb Estopa': {
        'phone': '0943 624 3858'
    }
};

let enableDisableNameInput = (option) => {
    let newContactName = document.getElementById('newContactName');

    if(option === 'enable')
        newContactName.disabled = false;
    else if(option === 'disable')
        newContactName.disabled = true;
}

let refreshDOMTable = () => {

    let pbTableKeys = Object.keys(pbTable);
    let tableContainer = document.getElementById('pbTableContainer');
    let oldTableBody = document.getElementById('tableBody');
    tableContainer.removeChild(oldTableBody);
    let newTableBody = document.createElement('span');
    newTableBody.id = 'tableBody';
    tableContainer.appendChild(newTableBody);

    for (let i = 0; i < pbTableKeys.length; i++) {
        let currentRow = document.createElement('div');
        let currentNameCol = document.createElement('div');
        let currentPhoneCol = document.createElement('div');
        let currentEditBtn = document.createElement('div');
        let currentDeleteBtn = document.createElement('div');

        currentRow.className = 'pb-table-row';
        currentNameCol.className = 'pb-table-column pb-name';
        currentPhoneCol.className = 'pb-table-column pb-number';
        currentEditBtn.className = 'pb-table-column pb-edit';
        currentDeleteBtn.className = 'pb-table-column pb-delete';

        currentNameCol.innerHTML = pbTableKeys[i];
        currentPhoneCol.innerHTML = pbTable[pbTableKeys[i]].phone;

        currentEditBtn.innerHTML = '<i class="fas fa-edit"></i>';
        currentDeleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

        currentRow.appendChild(currentNameCol);
        currentRow.appendChild(currentPhoneCol);
        currentRow.appendChild(currentEditBtn);
        currentRow.appendChild(currentDeleteBtn);
        newTableBody.appendChild(currentRow);

    }

    let enableDisableNewUserModal = (option) => {
        let newContactName = document.getElementById('newContactName');
        let newPhoneNumber = document.getElementById('newPhoneNumber');
        newContactName.value = '';
        newPhoneNumber.value = '';

        let newContactModal = document.getElementById('newContactModal');
        let backdrop = document.getElementById('backdrop');

        newContactModal.className = `${option}-modal`;
        backdrop.className = `${option}-modal`;
    }

    let addContactBtn = document.getElementById('addContact');
    let editBtns = document.getElementsByClassName('pb-edit');
    let deleteBtns = document.getElementsByClassName('pb-delete');

    let newContactSubmitBtn = document.getElementById('newContactSubmitBtn');
    let newContactCancelBtn = document.getElementById('newContactCancelBtn');

    newContactSubmitBtn.addEventListener('click', () => {
        let newContactName = document.getElementById('newContactName').value.trim();
        let newPhoneNumber = document.getElementById('newPhoneNumber').value.trim();

        if (newContactName === '') {
            document.getElementById('newContactName').className = 'input-err';
        } else {
            document.getElementById('newContactName').className = '';
        }

        if (newPhoneNumber === '') {
            document.getElementById('newPhoneNumber').className = 'input-err';
        } else {
            document.getElementById('newPhoneNumber').className = '';
        }

        if(newContactName !== '' && newPhoneNumber !== '') {
            let newContact = {};
            pbTable[newContactName] = {
                'phone': newPhoneNumber
            }
            localStorage.setItem(tableKey, JSON.stringify(pbTable));
            enableDisableNewUserModal('disable');
            refreshDOMTable();
        }
    });

    newContactCancelBtn.addEventListener('click', () => {
        enableDisableNewUserModal('disable');
    })

    addContactBtn.addEventListener('click', () => {
        enableDisableNewUserModal('enable');
        enableDisableNameInput('enable');
    });

    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', ($event) => {
            let nameToEdit = $event.target.parentElement.children[0].innerText;
            let personTodEdit = pbTable[nameToEdit];
            enableDisableNewUserModal('enable');
            let newContactName = document.getElementById('newContactName');
            let newPhoneNumber = document.getElementById('newPhoneNumber');
            newContactName.value = nameToEdit;
            newPhoneNumber.value = personTodEdit.phone;
            enableDisableNameInput('disable');
        })
    }

    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', ($event) => {
            let nameToDelete = $event.target.parentElement.children[0].innerText;
            let isSure = window.confirm('Continue to delete ' + nameToDelete + '?');
            if(isSure)
                deleteUserFromTable(nameToDelete);
        })
    }

}

let deleteUserFromTable = (userName) => {
    let tempTable = {};
    let pbTableKeys = Object.keys(pbTable);
    for(let i = 0; i < pbTableKeys.length; i++) {
        if(userName !== pbTableKeys[i]) {
            tempTable[pbTableKeys[i]] = pbTable[pbTableKeys[i]];
        }
    }
    pbTable = tempTable;
    localStorage.setItem(tableKey, JSON.stringify(pbTable));
    refreshDOMTable();
}

let init = () => {

    if(localStorage.getItem(tableKey)) {
        pbTable = JSON.parse(localStorage.getItem(tableKey));
    }
    else {
        pbTable = pbTableDemo;
        localStorage.setItem(tableKey, JSON.stringify(pbTable));
    }

    refreshDOMTable();

}

init();
