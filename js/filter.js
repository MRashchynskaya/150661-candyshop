'use strict';

(function () {
  // переменные для фильтров
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
  var rangeCount = document.querySelector('.range__count'); // кол-во после применения фильтра по цене
  var minPrice = 0;
  var maxPrice;
  // выставляем пины и полоску на крайние позции (после загрузки пользователь должен видеть все товары, без ограничений по цене)
  var positionBtnLeft = 0; // текущая позиция левого пина = в начале шкалы (слева ноль пикселей от родителя)
  var positionBtnRight = rightEdge - leftEdge; // текущая позиция правого пина (= коорд. правый край - коорд. левый край)
  priceRangeBtnLeft.style.left = positionBtnLeft + 'px';
  priceRangeBtnRight.style.left = positionBtnRight + 'px';
  priceRangeLine.style.left = positionBtnLeft + priceBtnWidth / 2 + 'px';
  priceRangeLine.style.right = priceRangeBarWidth - positionBtnRight + priceBtnWidth / 2 + 'px';
  var getUnique = window.util.getUnique;
  var filterArea = document.querySelector('.catalog__sidebar');
  var filteredGoods = [];
  var typeFilterInputs = filterArea.querySelectorAll('input[name="food-type"]');
  var propertyFilterInputs = filterArea.querySelectorAll('input[name="food-property"]');
  var nutritionFacts = ['sugar', 'vegetarian', 'gluten'];
  var nutritionFactsCounts = [0, 0, 0];
  var favoriteInput = filterArea.querySelector('#filter-favorite');
  var availabilityInput = filterArea.querySelector('#filter-availability');
  var availabilityAmount = 0;
  var sortFilterInputs = filterArea.querySelectorAll('input[name="sort"]');
  var filterSubmitButton = document.querySelector('.catalog__submit');
  var typeInputsContainers = Array.prototype.map.call(typeFilterInputs, function (input) {
    return input.parentNode;
  });
  var propertyInputsContainers = Array.prototype.map.call(propertyFilterInputs, function (input) {
    return input.parentNode;
  });

  // ФИЛЬТРЫ
  // поиск макс. цены в каталоге и запись значение мин и макс цены
  var findMaxPrice = function (data) {
    var prices = data.map(function (goodsData) {
      return goodsData.price;
    });
    rangeCount.textContent = '(' + data.length + ')';
    return Math.max.apply(null, prices);
  };

  var findPriceValue = function (data) {
    maxPrice = findMaxPrice(data);
    rangePriceMin.textContent = minPrice;
    rangePriceMax.textContent = maxPrice;
  };

  // поиск кол-ва разных товаров для фильтров
  var findGoodsNumber = function (goods) {
    // категория товара
    typeInputsContainers.forEach(function (item) {
      var typeName = item.querySelector('label').textContent;
      var goodsNum = goods.filter(function (good) {
        return good.kind === typeName;
      }).length;

      item.querySelector('.input-btn__item-count').textContent = '(' + goodsNum + ')';
    });

    // свойства товара
    goods.forEach(function (item, i) {
      nutritionFacts.forEach(function (fact, j) {

        if (fact === 'vegetarian') {
          if (goods[i].nutritionFacts[fact] === true) {
            nutritionFactsCounts[j]++;
          }
        } else {
          if (goods[i].nutritionFacts[fact] === false) {
            nutritionFactsCounts[j]++;
          }
        }
      });
    });

    propertyInputsContainers.forEach(function (item, i) {
      item.querySelector('.input-btn__item-count').textContent = '(' + nutritionFactsCounts[i] + ')';
    });

    // кол-во добавленных в избранное
    favoriteInput.parentNode.querySelector('.input-btn__item-count').textContent = '(0)';

    // наличие товара (кол-во)
    goods.forEach(function (item) {
      if (item.amount > 0) {
        availabilityAmount++;
      }
    });
    availabilityInput.parentNode.querySelector('.input-btn__item-count').textContent = '(' + availabilityAmount + ')';
  };

  var getActivInputsValue = function (inputs, activeInputs) {
    for (var z = 0; z < inputs.length; z++) {
      if (inputs[z].checked === true) {
        activeInputs.push(inputs[z].value);
      }
    }
  };

  var resetFilters = function () {
    for (var k = 0; k < typeFilterInputs.length; k++) {
      typeFilterInputs[k].checked = false;
    }
    for (var z = 0; z < propertyFilterInputs.length; z++) {
      propertyFilterInputs[z].checked = false;
    }
    sortFilterInputs[0].checked = true;
  };

  var applyFilterToType = function (evt, goods) {
    var activeTypeInputs = [];
    getActivInputsValue(typeFilterInputs, activeTypeInputs);
    if (activeTypeInputs.length === 0) {
      return goods;
    }
    var activeNames = activeTypeInputs.map(function (item) {
      return filterArea.querySelector('label[for="filter-' + item + '"]').textContent;
    });
    var filterArray = [];
    for (var k = 0; k < activeNames.length; k++) {
      filterArray = filterArray.concat(goods.filter(function (item) {
        return item.kind === activeNames[k];
      }));
    }
    return filterArray;
  };

  var applyFilterToProperty = function (evt, goods) {
    var activePropInputs = [];
    getActivInputsValue(propertyFilterInputs, activePropInputs);
    if (activePropInputs.length === 0) {
      return goods;
    }
    var filterArray = [];
    for (var k = 0; k < activePropInputs.length; k++) {
      if (activePropInputs[k] === 'sugar-free') {
        filterArray = filterArray.concat(goods.filter(function (item) {
          return item.nutritionFacts.sugar === false;
        }));
      } else if (activePropInputs[k] === 'vegetarian') {
        filterArray = filterArray.concat(goods.filter(function (item) {
          return item.nutritionFacts.vegetarian === true;
        }));
      } else if (activePropInputs[k] === 'gluten-free') {
        filterArray = filterArray.concat(goods.filter(function (item) {
          return item.nutritionFacts.gluten === false;
        }));
      }
    }
    return getUnique(filterArray);
  };

  var applyFilterToPrice = function (evt, goods) {
    var rangePriceMinValue = document.querySelector('.range__price--min').textContent;
    var rangePriceMaxValue = document.querySelector('.range__price--max').textContent;
    filteredGoods = goods.filter(function (item) {
      return item.price <= rangePriceMaxValue;
    });
    filteredGoods = filteredGoods.filter(function (item) {
      return item.price >= rangePriceMinValue;
    });
    findMaxPrice(filteredGoods);
    return filteredGoods;
  };

  var sortFilter = function (evt, goods) {
    for (var l = 0; l < sortFilterInputs.length; l++) {
      if (sortFilterInputs[l].checked) {
        if (sortFilterInputs[l].value === 'popular') {
          filteredGoods = goods.sort(function (a, b) {
            return b.rating.number - a.rating.number;
          });
        }
        if (sortFilterInputs[l].value === 'expensive') {
          filteredGoods = goods.sort(function (a, b) {
            return b.price - a.price;
          });
        }
        if (sortFilterInputs[l].value === 'cheep') {
          filteredGoods = goods.sort(function (a, b) {
            return a.price - b.price;
          });
        }
        if (sortFilterInputs[l].value === 'rating') {
          filteredGoods = goods.sort(function (a, b) {
            return b.rating.value - a.rating.value;
          });
        }
      }
    }
    return filteredGoods;
  };

  var activeFilters = [applyFilterToType, applyFilterToProperty, applyFilterToPrice, sortFilter];

  var clickFilterHandler = function (evt) {
    if (evt.target.classList.contains('input-btn__input') ||
        evt.target.classList.contains('range__btn') ||
        evt.target.classList.contains('range__filter')
    ) {
      var updateGoodsCollection = window.goods.updateGoodsCollection;
      var goods = window.goodsData;
      var favoriteList = window.goods.favoriteList;
      filteredGoods = (favoriteInput.checked && favoriteList) ? favoriteList : goods;
      activeFilters.forEach(function (func) {
        filteredGoods = func(evt, filteredGoods);
      });
      if (evt.target === favoriteInput) {
        findPriceValue(goods);
        resetFilters();
        if (favoriteInput.checked) {
          availabilityInput.checked = false;
          filteredGoods = (favoriteList) ? favoriteList : [];
        } else {
          filteredGoods = goods;
        }
      }
      if (evt.target === availabilityInput) {
        resetFilters();
        findPriceValue(goods);
        if (availabilityInput.checked) {
          favoriteInput.checked = false;
          filteredGoods = goods.filter(function (item) {
            return item.amount > 0;
          });
        }
      }
      window.util.debounce(updateGoodsCollection, filteredGoods);
    }
  };

  var clickSubmitBtnHandler = function (evt) {
    var updateGoodsCollection = window.goods.updateGoodsCollection;
    // var goods = window.goodsData;
    evt.preventDefault();
    findPriceValue(window.goodsData);
    resetFilters();
    favoriteInput.checked = false;
    availabilityInput.checked = false;
    filteredGoods = window.goodsData;
    window.util.debounce(updateGoodsCollection, filteredGoods);
  };

  // ПЕРЕМЕЩЕНИЕ ПО ШКАЛЕ ЦЕНЫ
  // функция расчета ограничения мин. и макс. цены для фильтра через позицию пина
  var calcPriceValue = function (positionBtn) {
    maxPrice = findMaxPrice(window.goodsData);
    return Math.round(positionBtn / priceRangeBarWidth * (maxPrice - minPrice) + minPrice);
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

  // добавляем обработчики на фильтры
  filterArea.addEventListener('click', clickFilterHandler); // фильтры
  filterSubmitButton.addEventListener('click', clickSubmitBtnHandler); // "Показать всё"

  window.findGoodsNumber = findGoodsNumber;
  window.findPriceValue = findPriceValue;
})();
