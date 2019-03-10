/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации
 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */
/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
   */
  const homeworkContainer = document.querySelector('#homework-container');
  // текстовое поле для фильтрации cookie
  const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
  // текстовое поле с именем cookie
  const addNameInput = homeworkContainer.querySelector('#add-name-input');
  // текстовое поле со значением cookie
  const addValueInput = homeworkContainer.querySelector('#add-value-input');
  // кнопка "добавить cookie"
  const addButton = homeworkContainer.querySelector('#add-button');
  // таблица со списком cookie
  const listTable = homeworkContainer.querySelector('#list-table tbody');

loaderCookies();

filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    let subString = event.target.value;

    if (subString !== '') {
		let obj = document.cookie.split('; ').reduce((prev, current) => {
			const [name, value] = current.split('=');
	
			prev[name] = value;
	
			return prev;
		}, {});
		let cookiesArray = toArr(obj);
		
        let filtered = cookiesArray.filter(cookie => {
			if (filterCookie(`${cookie.name}`, subString) || filterCookie(`${cookie.value}`, subString)) {

                return cookie;
            }
        });
        listTable.innerHTML = '';
        for (let cookie of filtered) {
            filterTemplate(cookie);
        }
	} else {
        loaderCookies();
    }
});

// Объект конвертируем в массив с объектами
function toArr(object) {
	const cookieArray = [];

	for (let key in object) {
		let newObj = {};

		newObj.name = key;
		newObj.value = object[key];
		cookieArray.push(newObj);
	}

	return cookieArray;
}

// Функция для фильтра
function filterCookie(full, chunk) {
	let str = full.toLowerCase();

    let substring = chunk.toLowerCase();

    let result = false;

    if (~str.indexOf(substring)) {
        result = true;
    }

    return result;
}

// Отфильтрованная таблица
function filterTemplate(param) {
	const filtertemplate = `<td>${param.name}</td><td>${param.value}</td><td><button class='del-button'>Удалить</button></td>`

	let html = document.createElement('tr');

	html.innerHTML = filtertemplate;
	listTable.appendChild(html);

	return listTable;
}

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    if (addNameInput.value !== '' && addValueInput.value !== '') {
		document.cookie = `${addNameInput.value} = ${addValueInput.value}`;
		if (filterNameInput.value === '') {
			loaderCookies();
		} else {
			if (!filterCookie(addNameInput.value, filterNameInput.value) && !filterCookie(addValueInput.value, filterNameInput.value)) {
				let obj = document.cookie.split('; ').reduce((prev, current) => {
					const [name, value] = current.split('=');

					prev[name] = value;

					return prev;
				}, {});
				let cookiesArray = toArr(obj);

				let filtered = cookiesArray.filter(cookie => {
					if (filterCookie(`${cookie.name}`, filterNameInput.value) || filterCookie(`${cookie.value}`, filterNameInput.value)) {

						return cookie;
					}
				});
				listTable.innerHTML = '';
				for (let cookie of filtered) {
					filterTemplate(cookie);
				}
			} else {
				let obj = document.cookie.split('; ').reduce((prev, current) => {
					const [name, value] = current.split('=');
			
					prev[name] = value;
			
					return prev;
				}, {});
				let cookiesArray = toArr(obj);

				let filtered = cookiesArray.filter(cookie => {
					if (filterCookie(`${cookie.name}`, filterNameInput.value) || filterCookie(`${cookie.value}`, filterNameInput.value)) {

						return cookie;
					}
				});
				listTable.innerHTML = '';
				for (let cookie of filtered) {
					filterTemplate(cookie);
				}
			}
		}
    }
});

// Обработчик для удаления куки
listTable.addEventListener('click', (e) => {
	if (e.target.classList.contains('del-button')) {
		let button = e.target;
		let cookieName = button.parentNode.parentNode.firstChild.innerText;

        deleteCookie(cookieName);
		loaderCookies();
    }
});

// Удаление cookie
function deleteCookie(name) {
	document.cookie = `${name}=;expires=Thu, 01 Jan 1980 00:00:01 GMT;`;
}

// Вывод таблицы
function loaderCookies() {
	listTable.innerHTML = '';
    const arr = document.cookie.split('; ');

    for (let item of arr) {
		let [name, value] = item.split('=');

		const template = `<td>${name}</td><td>${value}</td><td><button class='del-button'>Удалить</button></td>`

		let html = document.createElement('tr');

		html.innerHTML = template;
		listTable.appendChild(html);
    }
}