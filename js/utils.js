'use strict';

// весь код - в IIFE, анонимная самовызывющаяся функция
(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  // функция генерации случайного номера элемента массива
  var getRandomArrayElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // функция генерации случайного числа в интервале от мин. до макс.
  var getRandomNumber = function (values) {
    return Math.floor(Math.random() * (values.MAX - values.MIN + 1)) + values.MIN;
  };

  // функция перемешивания элементов массива
  var shuffleArray = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = arr[j];
      arr[j] = arr[i];
      arr[i] = swap;
    }
    return arr;
  };

  // поиск по индексу элемента в массиве
  var getUnique = function (arr) {
    return arr.filter(function (item, index, array) {
      return array.indexOf(item) === index;
    });
  };

  // устранение "эффекта дребезга"
  var debounce = function (fun, param) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL, param);
  };

  window.util = {
    getRandomArrayElement: getRandomArrayElement,
    getRandomNumber: getRandomNumber,
    shuffleArray: shuffleArray,
    debounce: debounce,
    getUnique: getUnique
  };
})();
