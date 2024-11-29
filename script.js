function makeModal(title, button_value, callback) {
    const html = `
    <div class="modal" tabindex="-1" id="userModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="userform">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label>Nome</label>
                            <input type="text" name="name" id="name" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label>Email</label>
                            <input type="email" name="email" id="email" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label>Idade</label>
                            <input type="number" name="age" id="age" class="form-control" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input type="hidden" name="user_id" id="user_id" />
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" onclick="${callback}()">${button_value}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;

    document.querySelector('#modalArea').innerHTML = html;

    const userModalElement = new bootstrap.Modal(document.getElementById('userModal'));
    userModalElement.show();
}

function insertData() {
    const formElement = document.querySelector('#userform');
    const formData = new FormData(formElement);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then((response) => response.json())
        .then(() => {
            userModalElement.hide();
            getData();
        });
}

function getData() {
    fetch('/users')
        .then((response) => response.json())
        .then((data) => {
            let html = '';
            if (data.length > 0) {
                data.forEach((row) => {
                    html += `
                    <tr>
                        <td>${row.name}</td>
                        <td>${row.email}</td>
                        <td>${row.age}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm" onclick="fetchSingleData('${row._id}')">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm" onclick="deleteData('${row._id}')">Excluir</button>
                        </td>
                    </tr>
                    `;
                });
            } else {
                html = '<tr><td colspan="4" class="text-center">Nenhum dado encontrado</td></tr>';
            }
            document.getElementById("table").style.display = "block";

            document.getElementById('dataArea').innerHTML = html;
        });
}

function fetchSingleData(id) {
    fetch(`/users/${id}`)
        .then((response) => response.json())
        .then((data) => {
            makeModal('Editar Usuário', 'Atualizar', 'editData');
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
            document.getElementById('age').value = data.age;
            document.getElementById('user_id').value = data._id;
        });
}

function editData() {
    const formElement = document.getElementById('userform');
    const formData = new FormData(formElement);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    const userId = document.getElementById('user_id').value;

    fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then((response) => response.json())
        .then(() => {
            userModalElement.hide();
            getData();
        });
}

function deleteData(id) {
    if (confirm('Você quer deletar mesmo isso?')) {
        fetch(`/users/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then(() => {
                getData();
            });
    }
}

getData();
