'use strict';

(function () {
  // шкала фильтра цены в каталоге
  var priceRangeBar = document.querySelector('.range__filter'); // вся шкала фильтра
  var priceRangeBtnLeft = priceRangeBar.querySelector('.range__btn--left'); // левый ползунок (пин)
  var priceRangeBtnRight = priceRangeBar.querySelector('.range__btn--right'); // правый ползунок (пин)
  var priceBtnWidth = priceRangeBtnLeft.offsetWidth; // ширина пина
  var priceRangeLine = priceRangeBar.querySelector('.range__fill-line'); // заполняющая полоска между ползунками
  var priceRangeBarWidth = priceRangeBar.offsetWidth - priceBtnWidth; // доступная ширина шкалы в пикс. (экв. 100% цены от мин. до макс.)
  var leftEdge = priceRangeBar.getBoundingClientRect().left; // координата левого края шкалы (относительно окна)
  var rightEdge = priceRangeBar.getBoundingClientRect().right - priceBtnWidth; // координата правого края ДОСТУПНОЙ шкалы (с учетом ширины пина)
  var rangePriceMin = document.querySelector('.range__price--min'); // спан с мин. ценой
  var rangePriceMax = document.querySelector('.range__price--max'); // спан с макс. ценой
  var MIN_PRICE = 60;
  var MAX_PRICE = 230;
  // выставляем пины и полоску на крайние позции (после загрузки пользователь должен видеть все товары, без ограничений по цене)
  var positionBtnLeft = 0; // текущая позиция левого пина = в начале шкалы (слева ноль пикселей от родителя)
  var positionBtnRight = rightEdge - leftEdge; // текущая позиция правого пина (= коорд. правый край - коорд. левый край)
  priceRangeBtnLeft.style.left = positionBtnLeft + 'px';
  priceRangeBtnRight.style.left = positionBtnRight + 'px';
  priceRangeLine.style.left = positionBtnLeft + priceBtnWidth / 2 + 'px';
  priceRangeLine.style.right = priceRangeBarWidth - positionBtnRight + priceBtnWidth / 2 + 'px';

  // функция расчета ограничения мин. и макс. цены для фильтра через позицию пина
  var calcPriceValue = function (positionBtn) {
    return Math.round(positionBtn / priceRangeBarWidth * (MAX_PRICE - MIN_PRICE) + MIN_PRICE);
  };

  // функция-обработчик перемещения пинов и отпускания кнопки мыши
  // параметры: событие, текущий пин, левый ограничитель, правый ограничитель, текущий спан, зажат левый пин (true/false)
  var priceRangeBtnHandler = function (evt, buttonElement, minLeft, maxRight, priceEl, isLeftBtn) {
    var shiftX = evt.clientX - buttonElement.getBoundingClientRect().left; // поправка - расст. от курсора до левой границы пина
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
      var newLeft = event.clientX - shiftX - leftEdge; // координата левого края пина

      if (newLeft < minLeft) { // ограничиваем движение пина слева
        newLeft = minLeft;
      } else if (newLeft > maxRight) { // ограничиваем движение пина справа
        newLeft = maxRight;
      }

      buttonElement.style.left = newLeft + 'px';
      priceEl.textContent = calcPriceValue(newLeft);

      if (isLeftBtn) {
        priceRangeLine.style.left = newLeft + shiftX + 'px'; // если пин левый - двигаем левую границу заполняющей полосы
        positionBtnLeft = newLeft; // текущую координату левого пина - в переменную позиции левого пина
      } else {
        priceRangeLine.style.right = priceRangeBarWidth - newLeft + shiftX + 'px'; // если пин НЕ левый - двигаем ПРАВУЮ границу заполняющей полосы
        positionBtnRight = newLeft; // текущую координату правого пина - в переменную позиции правого пина
      }
    }

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }
  };

  // добавляем обработчик нажатия левой кнопки на ЛЕВЫЙ пин
  priceRangeBtnLeft.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    priceRangeBtnHandler(evt, priceRangeBtnLeft, 0, positionBtnRight, rangePriceMin, true);
  });
  // добавляем обработчик нажатия левой кнопки на ПРАВЫЙ пин
  priceRangeBtnRight.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    priceRangeBtnHandler(evt, priceRangeBtnRight, positionBtnLeft, priceRangeBarWidth, rangePriceMax, false);
  });
})();
