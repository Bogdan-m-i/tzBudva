import IMask from 'imask';

const BODY = document.querySelector('.notes__body');

function maskPhone(elements) {
    if (!elements.length) return
    elements.forEach(item => {
        IMask(item, {
            mask: '+{7} (000) 000-00-00',
            prepare: function (appended, masked) {
                if (appended === '8' && masked.value === '') {
                    return '';
                }
                return appended;
            },
        });
    })
}

const ajaxSend = async (formData) => {
    const fetchResp = await fetch('./form.php', {
        method: 'POST',
        body: formData
    });
    if (!fetchResp.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
    }
    return await fetchResp.text();
};

function formInit(forms) {
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
    
            form.classList.add('was-validate');
    
            const formData = new FormData(this);
    
            if (form.id === 'note__add') {
                let element = {},
                    name = form.querySelector('.notes-name:valid'),
                    phone = form.querySelector('.notes-phone:valid');
                
                if (name != null && phone != null) {
                    element.name = name.value
                    element.phone = phone.value
                    BODY.insertAdjacentHTML('beforeend', createTableItem(element))
    
                    let items = document.querySelectorAll('.notes__body-item-btn'),
                        item = items[items.length-1];
                    formInit([item.closest('.form')])
                    maskPhone([...item.closest('.form').querySelectorAll('input[data-type="phone"]')])
                    form.classList.remove('was-validate')
                    form.reset()
                }
            }
    
            if (form.classList.contains('note__form-edit')) {
                let name = form.querySelector('.notes-name:valid'),
                    phone = form.querySelector('.notes-phone:valid'),
                    txtName = form.querySelector('span.name'),
                    txtPhone = form.querySelector('span.phone');
                if (name != null && phone != null) {
                    txtName.textContent = name.value
                    txtPhone.textContent = phone.value
                    form.classList.remove('was-validate')
                    form.reset()
                    form.querySelectorAll('label').forEach(item => item.classList.add('hide'))
                    form.querySelector('button.submit').classList.add('hide')
                    form.querySelector('button.cancel').classList.add('hide')
                    form.querySelector('button.edit').classList.remove('hide')
                }
            }
    
            ajaxSend(formData)
                .then((response) => {
                    console.log('отравлено');
                    form.reset();
    
                }).catch((err) => console.log('не отправлено'))
        });
    });
}


async function getData() {
	const data = await fetch('../static/js/json/users.json'),
		del = await data.json()
	return del
}

async function render() {
	const data = await getData();
	renderTable(data)
}

render()

function renderTable(data) {
    data.forEach(element => {BODY.insertAdjacentHTML('beforeend', createTableItem(element))});
    document.querySelector('.notes__body').addEventListener('click', clickBody)
    formInit([...document.querySelectorAll('.form')])
    maskPhone([...document.querySelectorAll('input[data-type="phone"]')])
}

function createTableItem(element) {
    return `
        <form class="note__form-edit notes__body-item row form" action="./form.php" novalidate="">
            <div class="col-5 notes__body-item-txt"> <span> <span class="name">${element.name}</span>
                <label class="hide">
                    <input class="notes-name" placeholder="${element.name}" pattern="([а-яА-Я -]{1,})|([a-zA-z -]{1,})" required=""><span class="form__error">Enter a name</span>
                </label></span></div>
            <div class="col-4 notes__body-item-txt"> <span> <span class="phone">${element.phone}</span>
                <label class="hide">
                    <input class="notes-phone" placeholder="${element.phone}" data-type="phone" pattern="[+]7[ ][(][0-9]{3}[)][ ][0-9]{3}[-][0-9]{2}[-][0-9]{2}" required=""><span class="form__error">enter your phone number</span>
                </label></span></div>
            <div class="col-3 notes__body-item-btn">
                <button class="btn cancel hide" type="button">cancel</button>
                <button class="btn submit hide" type="submit">save</button>
                <button class="btn edit" type="button">edit</button>
                <button class="btn delete" type="button">
                <svg class="icon icon-del">
                    <use xlink:href="static/images/svg/symbol/sprite.svg#del"></use>
                </svg>
                </button>
            </div>
        </form>
    `
}

function deleteNote(el) {
    el.closest('.notes__body-item').remove();
}

function editNote(el) {
    let form = el.closest('.form')
    form.querySelectorAll('label').forEach(item => item.classList.remove('hide'))
    form.querySelector('button.submit').classList.remove('hide')
    form.querySelector('button.cancel').classList.remove('hide')
    form.querySelector('button.edit').classList.add('hide')
}

function cancelNote(el) {
    let form = el.closest('.form')
    form.querySelectorAll('label').forEach(item => item.classList.add('hide'))
    form.querySelector('button.submit').classList.add('hide')
    form.querySelector('button.cancel').classList.add('hide')
    form.querySelector('button.edit').classList.remove('hide')
    form.classList.remove('was-validate')
    form.reset()
}

function clickBody(e) {
    if (e.target.classList.contains('edit')) editNote(e.target)
    if (e.target.classList.contains('cancel')) cancelNote(e.target)
    if (e.target.classList.contains('delete') || e.target.closest('.delete')) deleteNote(e.target)
}