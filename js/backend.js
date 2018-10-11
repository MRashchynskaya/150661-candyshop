'use strict';

(function () {
  // получение данных о товарах с сервера
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var GET_URL = 'https://js.dump.academy/candyshop/data';
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('GET', GET_URL);
    xhr.send();
  };

  // выгрузка данных из формы заказа на сервер
  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var POST_URL = 'https://js.dump.academy/candyshop/';
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad();
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    upload: upload,
    load: load
  };
})();
