// функция вызова спасибки, где this - сама форма
// showThanks(this)

// функция вызова модалки, где this - значение data-modal
// modal.show(this)

// функция закрытия модалки, где this - значение data-modal
// modal.close(this)

// спасибки
// let allForms = document.querySelectorAll("[data-validate-form]");
// allForms.forEach((form) => {
//   form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     showThanks(e.target);
//   });
// });
//
// // подтверждение города
// let cityConfirms = document.querySelectorAll("[data-city-confirm]");
// cityConfirms.forEach((item) => {
//   // showConfirm(item);
// });

sbjs.init();

ym(94359082,'reachGoal','all_vizits');

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}
// случайное число от min до (max+1)
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// Поиск города
document.addEventListener("DOMContentLoaded", function() {
    let citySearch = document.getElementById('js_city_search');
    if(citySearch) {
        let citySearchresult = document.getElementById('js_city_search_result')

        let cities = [];
        citiesBlock = document.querySelectorAll('.js_city');
        citiesBlock.forEach(function(city) {
            cities.push({'city': city.textContent, 'link': city.getAttribute('href')});
        });

        citySearch.addEventListener("input", function () {

            let citiSearchValue = this.value;

            let search = cities.filter(function(city) {
                var n = new RegExp(citiSearchValue, "gi");
                return city.city.match(n)
            });

            if(citiSearchValue.length > 0){
                citySearchresult.innerHTML = search.map((function (e) {
                        var name = e.city,
                            link = e.link,
                            find = new RegExp(citiSearchValue, "gi"),
                            newname = name.replace(find, "<b>".concat(citiSearchValue, "</b>"));
                            console.log(newname);
                        return "<a class='city-modal__town' href=".concat(link, ">").concat(newname, "</a>")
                    })).join("");
            }
        });
    }
});

// Формы
document.addEventListener("DOMContentLoaded", function() {

    // Подстановка заголовков для АМО
    let btnFormTitle = document.querySelectorAll('[data-form_title]');
    if (btnFormTitle.length > 0) {
        btnFormTitle.forEach(function(btnTitle) {
            btnTitle.addEventListener('click', function() {
                let popupFormID = btnTitle.getAttribute('data-modal-open');
                if (popupFormID) {
                    let popupForm = document.querySelector(`[data-modal=${popupFormID}]`);
                    if (popupForm) {
                        let popupTitle = popupForm.querySelector('[name="title"]');
                        if (popupTitle) {
                            popupTitle.value = btnTitle.dataset.form_title;
                        }
                    }
                }
            });
        });
    }

    // отправка формы
    let allForms = document.querySelectorAll(".js_form_ajax");
    allForms.forEach((form) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            formData = new FormData(form);

            fetch("/wp-admin/admin-ajax.php", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    return response.text();
                })
                .then(data => {

                    showThanks(e.target);

                    if(data == "ok") {
                        let curUrl = window.location.origin + window.location.pathname;
                        ym(94359082, 'reachGoal', 'free_consultation', {URL: curUrl});

                        let ymGoal = form.dataset.ym2;
                        if (ymGoal) {
                            ym(94359082, 'reachGoal', ymGoal, {URL: curUrl});
                        }
                    }
                });
        });
    });
});

// Пагинация
document.addEventListener("DOMContentLoaded", function() {
    paginationAjax();
    function paginationAjax(){
        let btn = document.querySelector(".js_btn_more");

        if(btn){
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                let url = document.getElementById('js_block_ajax').dataset.url;
                let paged = btn.dataset.paged;

                formData = new FormData();
                formData.append('paged', paged);

                fetch(url, {
                    method: "POST",
                    body: formData,
                })
                    .then(response => {
                        return response.text();
                    })
                    .then(data => {

                        btn.parentNode.remove();

                        var result = new DOMParser().parseFromString(data, "text/html");

                        let dataInfo = result.getElementById('js_block_ajax');

                        document.getElementById('js_block_ajax').innerHTML += (dataInfo.innerHTML);

                        bgImageLoad();
                        paginationAjax();
                    });
            });
        }
    }

    paginationAjaxSearchService();
    function paginationAjaxSearchService(){
        let btn = document.querySelector(".js_btn_more_service");

        if(btn){
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                let url = "/?s="+btn.dataset.search;
                let paged = btn.dataset.paged;

                formData = new FormData();
                formData.append('pagedService', paged);

                fetch(url, {
                    method: "POST",
                    body: formData,
                })
                    .then(response => {
                        return response.text();
                    })
                    .then(data => {

                        btn.parentNode.remove();

                        var result = new DOMParser().parseFromString(data, "text/html");

                        let dataInfo = result.getElementById('js_block_ajax_service');

                        document.getElementById('js_block_ajax_service').innerHTML += (dataInfo.innerHTML);

                        bgImageLoad();
                        paginationAjaxSearchService();
                    });
            });
        }
    }

    paginationAjaxSearchArticle();
    function paginationAjaxSearchArticle(){
        let btn = document.querySelector(".js_btn_more_article");

        if(btn){
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                let url = "/?s="+btn.dataset.search;
                let paged = btn.dataset.paged;

                formData = new FormData();
                formData.append('pagedArticle', paged);

                fetch(url, {
                    method: "POST",
                    body: formData,
                })
                    .then(response => {
                        return response.text();
                    })
                    .then(data => {

                        btn.parentNode.remove();

                        var result = new DOMParser().parseFromString(data, "text/html");

                        let dataInfo = result.getElementById('js_block_ajax_article');

                        document.getElementById('js_block_ajax_article').innerHTML += (dataInfo.innerHTML);

                        bgImageLoad();
                        paginationAjaxSearchArticle();
                    });
            });
        }
    }
});

// Меню в статье
document.addEventListener('DOMContentLoaded', function () {

    let articleMenu = document.getElementById('js_article_menu');

    //console.log(articleMenu);

    if(articleMenu){
        if(articleMenu.innerText.length == 0){

            let codeBody = document.getElementById('js_article_content');

            let h = codeBody.querySelectorAll('h2');

            const hd = [];
            let n = 0;
            let m = 0;
            for (let i = 0; i < h.length; i += 1) {
                if(!h[i].hasAttribute('data-notmenu')){
                    hd[n] = [];
                    hd[n].head = Number(h[i].localName[1]);
                    hd[n].text = h[i].textContent;
                    hd[n].link = "link"+(n+1);
                    h[i].setAttribute("id", hd[n].link);
                    if(i+1 < h.length && Number(h[i+1].localName[1]) == 3 && !h[i+1].hasAttribute('data-notmenu'))
                    {
                        hd[n].parent = true;
                    }

                    n++;
                }
            }

            let curHead = 2;
            let menu = "";
            n=1;
            m=1;
            menu += "";
            for (let i = 0; i < hd.length; i += 1) {
                if(hd[i].head == 2){
                    if(curHead == 3){
                        menu += "</ol>";
                        curHead = 2;
                        n++;
                    }
                    menu += '<li class="page-nav__item">';
                    menu += '<a class="page-nav__link" href="#'+hd[i].link+'">'+hd[i].text+'</a>';
                    if(hd[i].parent){
                        menu += "<ol class=\"page-nav__list\">";
                    }
                    else{
                        menu += '</li>';
                        n++;
                    }
                }
                else if(hd[i].head == 3){
                    if(curHead == 2){
                        curHead = 3;
                        m=1;
                    }

                    menu += '<li class="page-nav__item"><a class="page-nav__link" href="#'+hd[i].link+'">'+hd[i].text+'</a></li>';
                    m++;
                }
            }
            menu += "";

            if(menu.length > 0){
                menu = '<div class="page-nav__title"><span>Оглавление</span></div><ol class="page-nav__list">' + menu + '</ol>';
            }

            articleMenu.innerHTML = menu;
        }
    }
});

//Рейтинг
document.addEventListener('DOMContentLoaded', function () {
    let articleRadioRating = document.querySelectorAll(".rating__input");
    articleRadioRating.forEach((button) => {
        button.addEventListener("change", (e) => {
            e.preventDefault();
            setRating(e, button);
        });
        button.addEventListener("click", (e) => {
            e.preventDefault();
            setRating(e, button);
        });
    });

    function setRating(e, button){
        let rating = getCookie('rating');
        let postID = document.getElementById('js_rating');
        postID = postID.dataset.id;

        if(rating == undefined && postID) {

            formData = new FormData();
            formData.append('action', 'js_rating');
            formData.append('postID', postID);
            formData.append('rating', button.value);

            fetch("/wp-admin/admin-ajax.php", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    let rating_value = document.getElementById('js_rating_value');
                    rating_value.innerHTML = data.rating;
                    let rating_count = document.getElementById('js_rating_count');
                    rating_count.innerHTML = data.rating_count;

                    showThanks(e.target);

                    setCookie('rating', button.value, {expires: 30672000, path: location.href});
                });
        }
    }

    // Авто рейтинг
    let ratingAutoName = 'rating_auto';
    let postID = document.getElementById('js_rating');
    if(postID) {
        postID = postID.dataset.id;
        let autoRating = getCookie(ratingAutoName);
        if (autoRating == undefined && postID) {
            let random = randomInteger(0, 99);
            if (random < 30) {
                let rating = 5;
                random = randomInteger(0, 99);
                if (random < 30) {
                    rating = 4;
                }

                formData = new FormData();
                formData.append('action', 'js_rating');
                formData.append('postID', postID);
                formData.append('rating', rating);

                fetch("/wp-admin/admin-ajax.php", {
                    method: "POST",
                    body: formData
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {

                        setCookie(ratingAutoName, rating, {expires: 604800, path: location.href});
                    });
            }
        }
    }
});