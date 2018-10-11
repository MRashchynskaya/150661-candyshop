'use strict';

// весь код - в IIFE, анонимная самовызывющаяся функция
(function () {
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
  window.util = {
    getRandomArrayElement: getRandomArrayElement,
    getRandomNumber: getRandomNumber,
    shuffleArray: shuffleArray
  };
})();
