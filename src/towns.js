/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    const cities = new Promise(function (resolve) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.responseType = 'json';
        xhr.send();
        xhr.addEventListener('load', () => {
            const cityList = xhr.response;

            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';

            cityList.sort(function(a, b) {
                var nameA = a.name.toLowerCase();

                var nameB = b.name.toLowerCase();

                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }

                return 0
            });
            resolve(cityList);
        });
    });

    return cities;
}

let cities = loadTowns();

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    let str = full.toLowerCase();

    let substring = chunk.toLowerCase();

    let result = false;

    if (~str.indexOf(substring)) {
        result = true;
    }

    return result;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function() {
    // это обработчик нажатия кливиш в текстовом поле
    let subString = event.target.value;

    function clearResult() {
        let resultChildren = filterResult.querySelectorAll('DIV');

        for (let child of resultChildren) {
            child.remove();
        }
    }

    if (subString.trim() === '') {
        clearResult();
    } else {
        cities.then(cityList => {
            let filtered = cityList.filter(city => {
                if (isMatching(city.name, subString)) {
                    return city;
                }
            });

            clearResult();

            for (let city of filtered) {
                let resultChild = document.createElement('DIV');

                resultChild.textContent = city.name;
                filterResult.appendChild(resultChild);
            }
        });
    }
});

export {
    loadTowns,
    isMatching
};
