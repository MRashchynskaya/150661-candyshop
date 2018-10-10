'use strict';

// свойства товаров
var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'
];
var INGREDIENTS_LIST = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var PICTURES_URLS = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];
// Перменные для случайно перемешанных массивов
var randomGoodsNames = [];
var randomPictureUrls = [];

// Мин и макс значения параметров товара
var Amount = {
  MIN: 0,
  MAX: 20
};
var Price = {
  MIN: 100,
  MAX: 1500
};
var Weight = {
  MIN: 30,
  MAX: 300
};
var Rating = {
  value: {
    MIN: 1,
    MAX: 5
  },
  number: {
    MIN: 10,
    MAX: 900
  }
};
var nutritionFacts = {
  sugar: [true, false],
  energy: {
    MIN: 70,
    MAX: 500
  }
};
var ingredientsMinMax = {
  MIN: 1,
  MAX: 5
};

// Массив классов соответствующих value рейтинга
var starsRatingClass = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
// переменная-массив для объектов - карточек товаров в каталоге
var goodsCards = [];
// переменная-массив для объектов - товаров в корзине
var cart = [];
var cartTotalCost = 0;
// найдём элемент, в который мы будем вставлять карточки товаров
var catalogCardsElement = document.querySelector('.catalog__cards');
// находим шаблон для карточки товара
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.catalog__card');
// находим шаблон для товаров в корзине
var inCartTemplate = document.querySelector('#card-order')
  .content
  .querySelector('.goods_card');
// найдём элемент, в который мы будем вставлять карточки товаров в корзине
var goodsCardsElement = document.querySelector('.goods__cards');
// переменная для проверки наличия в корзине

// Блок корзина в хедере страницы
var headerCart = document.querySelector('.main-header__basket');
var headerCartText;
var headerCartEmpty = 'В корзине ничего нет';

// переменные для переключение вкладок
var deliverToggleBtn = document.querySelectorAll('.deliver .toggle-btn__input');
var deliverStore = document.querySelector('.deliver__store');
var deliverCourier = document.querySelector('.deliver__courier');

var payToggleBtn = document.querySelectorAll('.payment .toggle-btn__input');
var payCard = document.querySelector('.payment__card-wrap');
var payCash = document.querySelector('.payment__cash-wrap');

// функция генерации случайного номера элемента массива
var getRandomArrayElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// функция генерации случайного числа в интервале от мин. до макс.
var getRandomNumber = function (values) {
  return Math.floor(Math.random() * (values.MAX - values.MIN + 1)) + values.MIN;
};

// функция генерации строки из нескольких случайных элементов массива - состав продукта
var getRandomIngredients = function () {
  var quantity = getRandomNumber(ingredientsMinMax);
  var randomIngredients = '';
  for (var i = 1; i < quantity; i++) {
    randomIngredients += getRandomArrayElement(INGREDIENTS_LIST) + ', ';
  }
  randomIngredients += getRandomArrayElement(INGREDIENTS_LIST);
  return randomIngredients;
};

// создаем рандомизированные массивы имен товаров и картинок
var shuffleArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = arr[j];
    arr[j] = arr[i];
    arr[i] = swap;
  }
  return arr;
};
randomGoodsNames = shuffleArray(GOODS_NAMES);
randomPictureUrls = shuffleArray(PICTURES_URLS);

// создание объекта для карточки товара
var createObjectCard = function (goodsName, pictureUrl, index) {
  return {
    name: goodsName,
    picture: pictureUrl,
    amount: getRandomNumber(Amount),
    price: getRandomNumber(Price),
    weight: getRandomNumber(Weight),
    rating: {
      value: getRandomNumber(Rating.value),
      number: getRandomNumber(Rating.number)
    },
    nutritionFacts: {
      sugar: getRandomArrayElement(nutritionFacts.sugar),
      energy: getRandomNumber(nutritionFacts.energy),
      contents: getRandomIngredients(),
    },
    cardIndex: index,
  };
};

// функция создания массива с объектами - карточками товаров
var createGoodsCards = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var goodsCard = createObjectCard(randomGoodsNames[i], randomPictureUrls[i], i);
    goodsCards.push(goodsCard);
  }
  return goodsCards;
};

// Функция создания DOM-элемента - карточки товара
var createCatalogCard = function (goodsCard) {
  var cardElement = cardTemplate.cloneNode(true);
  var goodsAmount = goodsCard.amount;
  if (goodsAmount === 0) {
    cardElement.classList.remove('card--in-stock');
    cardElement.classList.add('card--soon');
  } else if (goodsAmount > 0 && goodsAmount <= 5) {
    cardElement.classList.remove('card--in-stock');
    cardElement.classList.add('card--little');
  }
  cardElement.querySelector('.card__title').textContent = goodsCard.name;
  cardElement.querySelector('.card__img').src = goodsCard.picture;
  cardElement.querySelector('.card__img').alt = goodsCard.name;
  cardElement.querySelector('.card__price-value').textContent = goodsCard.price + ' ';
  cardElement.querySelector('.card__weight').textContent = ' ' + goodsCard.weight + ' Г';
  var ratingObject = goodsCard.rating;
  cardElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  cardElement.querySelector('.stars__rating').classList.add(starsRatingClass[ratingObject.value - 1]);
  cardElement.querySelector('.star__count').textContent = ratingObject.number;
  var nutritionFactsObject = goodsCard.nutritionFacts;
  var containSugar = nutritionFactsObject.sugar ? 'Содержит сахар ' : 'Без сахара ';
  cardElement.querySelector('.card__characteristic').textContent = containSugar + nutritionFactsObject.energy + ' ккал';
  cardElement.querySelector('.card__composition-list').textContent = nutritionFactsObject.contents;
  cardElement.dataset.cardIndex = goodsCard.cardIndex;
  // cardElement.setAttribute('data-cardIndex', goodsCard.cardIndex);
  goodsCard.elem = cardElement;
  return cardElement;
};

// Клонируем карточки, заполняем данными (вызываем createAllCards в цикле) и добавляем все созданные карточки во фрагмент
var createAllCards = function (arr) {
  var fragment = document.createDocumentFragment(); // фрагмент, в который будем поочередно добавлять готовые карточки товаров (затем фрагмент один раз добавляется на страницу)
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(createCatalogCard(arr[i]));
  }
  return fragment;
};

createGoodsCards(GOODS_NAMES);
catalogCardsElement.appendChild(createAllCards(goodsCards));

// ТОВАРЫ В КОРЗИНЕ
// алгоритм:
// 1. В карточки товаров добавляем дата атрибут содержащий индекс в массиве
// 2. При клике на "добавить" клонируем объект из массива карточек и добавляем его в массив "в корзине";
// добавляем новое свойство - кол-во в корзине (orderedAmount);
// удаляем ненужные свойства: amount, weight, rating, nutritionFacts.
// 3. Условие: Если объект (товар) уже есть в массиве "корзина", то меняется только свойство "orderedAmount"

// Убераем у блока catalog__cards класс catalog__cards--load
document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
// Скрываем при помощи класса visually-hidden блок catalog__load
document.querySelector('.catalog__load').classList.add('visually-hidden');

// При нажатии на кнопку избранного .card__btn-favorite в карточке товара, этой кнопке должен добавляться класс card__btn-favorite--selected, который помечал бы её как избранную

var btnFavProd = document.querySelectorAll('.card__btn-favorite');

var addFavProd = function (e) {
  e.preventDefault();
  var currentBtn = e.target;
  currentBtn.classList.toggle('card__btn-favorite--selected');
};

for (var j = 0; j < btnFavProd.length; j++) {
  btnFavProd[j].addEventListener('click', addFavProd);
}

// Находим ВСЕ кнопки "Добавить в корзину"
var btnAddToCart = document.querySelectorAll('.card__btn');

// функция изменения класса карточки в зависимости от текущего кол-ва товара (вид кнопки "Добавить +1")
var changeGoodsCardClass = function (currentIndex) {
  for (var k = 0; k < goodsCards.length; k++) {
    if (goodsCards[k].cardIndex === currentIndex) {
      if (goodsCards[k].amount > 0 && goodsCards[k].amount <= 5) {
        goodsCards[k].elem.classList.remove('card--in-stock', 'card--soon');
        goodsCards[k].elem.classList.add('card--little');
      } else if (goodsCards[k].amount === 0) {
        goodsCards[k].elem.classList.remove('card--in-stock', 'card--little', 'card--soon');
        goodsCards[k].elem.classList.add('card--soon');
      } else {
        goodsCards[k].elem.classList.remove('card--in-stock', 'card--little', 'card--soon');
        goodsCards[k].elem.classList.add('card--in-stock');
      }
      break;
    }
  }
};

// функция удаления из корзины
var deleteCardFromCart = function (currentBtn) {
  var cardToDelete = currentBtn.closest('.card-order');
  var deleteCardIndex = parseInt(cardToDelete.dataset.cardIndex, 10);
  goodsCardsElement.removeChild(cardToDelete);
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].cardIndex === deleteCardIndex) {
      var amountToDelete = cart[i].amount;
      cart.splice(i, 1);
      break;
    }
  }
  for (var k = 0; k < goodsCards.length; k++) {
    if (goodsCards[k].cardIndex === deleteCardIndex) {
      goodsCards[k].amount = amountToDelete;
      break;
    }
  }
  changeGoodsCardClass(deleteCardIndex);
  calcCartTotalCost();
  headerCartText = 'В корзине ' + cart.length + ' товаров ' + 'на ' + cartTotalCost + '₽';
  headerCart.textContent = headerCartText;
  if (cart.length === 0) {
    document.querySelector('.goods__cards').classList.add('goods__cards--empty');
    document.querySelector('.goods__card-empty').classList.remove('visually-hidden');
    headerCart.textContent = headerCartEmpty;
  }
};

// Находим ВСЕ кнопки "Удалить товар" и навешиваем события
var createDeleteEvent = function () {
  var btnDeleteFromCart = document.querySelectorAll('.card-order__close');
  for (var i = 0; i < btnDeleteFromCart.length; i++) {
    btnDeleteFromCart[i].addEventListener('click', function (e) {
      e.preventDefault();
      deleteCardFromCart(e.target);
    });
  }
};

// УНИВЕРСАЛЬНАЯ функция уменьшения и увеличения кол-ва товара в корзине
var changeOrderedAmount = function (currentBtn, changeValue, changeCardIndex) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].cardIndex === changeCardIndex) {
      cart[i].orderedAmount += changeValue;
      if (cart[i].orderedAmount === 0) {
        deleteCardFromCart(currentBtn);
      } else if (cart[i].orderedAmount > cart[i].amount) {
        cart[i].orderedAmount = cart[i].amount;
      } else {
        cart[i].elem.querySelector('.card-order__count').value = cart[i].orderedAmount;
        calcCartTotalCost();
        headerCartText = 'В корзине ' + cart.length + ' товаров ' + 'на ' + cartTotalCost + '₽';
        headerCart.textContent = headerCartText;
        for (var k = 0; k < goodsCards.length; k++) {
          if (goodsCards[k].cardIndex === changeCardIndex) {
            goodsCards[k].amount -= changeValue;
            break;
          }
        }
      }
      break;
    }
  }
  changeGoodsCardClass(changeCardIndex);
};

// Находим кнопки "Уменьшить" и "Увеличить" для карточек в корзине и навешиваем события
var createDecreaseEncreaseEvent = function (currentIndex) {
  var btnDecrease = document.querySelectorAll('.card-order__btn--decrease');
  var btnIncrease = document.querySelectorAll('.card-order__btn--increase');
  btnDecrease[btnDecrease.length - 1].addEventListener('click', function (e) {
    e.preventDefault();
    changeOrderedAmount(e.target, -1, currentIndex);
  });
  btnIncrease[btnIncrease.length - 1].addEventListener('click', function (e) {
    e.preventDefault();
    changeOrderedAmount(e.target, 1, currentIndex);
  });
};

// проверка наличия товара и наличия его в корзине
var checkIsInStock = function (e) {
  e.preventDefault();
  var currentBtn = e.target;
  var currentCard = currentBtn.closest('.catalog__card');
  var currentCardIndex = parseInt(currentCard.dataset.cardIndex, 10);
  if (goodsCards[currentCardIndex].amount !== 0) {
    addNewProductInCart(currentCardIndex, checkIsInCart(currentCardIndex));
  }
  //   alert('Извините данного товара нет в наличии');
};

var checkIsInCart = function (currentIndex) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].cardIndex === currentIndex) {
      return true;
    }
  }
  return false;
};

// функция расчета итоговой стоимости в корзине
var calcCartTotalCost = function () {
  cartTotalCost = 0;
  cart.forEach(function (item) {
    cartTotalCost += item.price * item.orderedAmount;
  });
  return cartTotalCost;
};

// добавление НОВОГО товара в корзину
var addNewProductInCart = function (currentIndex, isInCart) {
  if (isInCart) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].cardIndex === currentIndex) {
        cart[i].orderedAmount += 1;
        cart[i].elem.querySelector('.card-order__count').value = cart[i].orderedAmount;
        break;
      }
    }
  } else {
    var productInCart = Object.assign({orderedAmount: 1}, goodsCards[currentIndex]);
    var inCartElement = inCartTemplate.cloneNode(true);
    inCartElement.querySelector('.card-order__title').textContent = productInCart.name;
    inCartElement.querySelector('.card-order__img').src = productInCart.picture;
    inCartElement.querySelector('.card-order__img').alt = productInCart.name;
    inCartElement.querySelector('.card-order__price').textContent = productInCart.price + ' ₽';
    inCartElement.querySelector('.card-order__count').value = productInCart.orderedAmount;
    inCartElement.dataset.cardIndex = productInCart.cardIndex;
    productInCart.elem = inCartElement;
    goodsCardsElement.appendChild(inCartElement);
    cart.push(productInCart);
    createDeleteEvent();
    createDecreaseEncreaseEvent(currentIndex);
    // Удаляем у блока goods__cards класс goods__cards--empty и скрываем блок goods__card-empty
    document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
    document.querySelector('.goods__card-empty').classList.add('visually-hidden');
  }
  goodsCards[currentIndex].amount -= 1;
  changeGoodsCardClass(currentIndex);
  calcCartTotalCost();
  headerCartText = 'В корзине ' + cart.length + ' товаров ' + 'на ' + cartTotalCost + '₽';
  headerCart.textContent = headerCartText;
  return cart;
};

// обработчик события на кнопку "добавить в корзину"
for (var i = 0; i < btnAddToCart.length; i++) {
  btnAddToCart[i].addEventListener('click', checkIsInStock);
}

// обработчик события на способы доставки и оплаты
var paymentCardAllInputs = document.querySelectorAll('.payment__inputs input');
var deliverCourierAllInputs = document.querySelectorAll('.deliver__courier input, .deliver__courier textarea');
var deliverStoreInputs = document.querySelectorAll('.deliver__store-list input');
// по умолчанию блокируем поля данных для способа "Курьером"
deliverCourierAllInputs.forEach(function (itemInput) {
  itemInput.disabled = true;
});

// обработчик события на кнопки способа доставки и оплаты
deliverToggleBtn.forEach(function (item) {
  item.addEventListener('change', function () {
    deliverStore.classList.toggle('visually-hidden', item.value === 'courier');
    deliverCourier.classList.toggle('visually-hidden', item.value === 'store');
    deliverCourierAllInputs.forEach(function (itemInput) {
      itemInput.disabled = item.value === 'store';
    });
    deliverStoreInputs.forEach(function (itemInput) {
      itemInput.disabled = item.value === 'courier';
    });
  });
});

payToggleBtn.forEach(function (item) {
  item.addEventListener('change', function () {
    payCard.classList.toggle('visually-hidden', item.value === 'cash');
    payCash.classList.toggle('visually-hidden', item.value === 'card');
    if (item.value === 'cash') {
      paymentCardAllInputs.forEach(function (itemInput) {
        itemInput.setAttribute('disabled', '');
      });
    } else {
      paymentCardAllInputs.forEach(function (itemInput) {
        itemInput.removeAttribute('disabled');
      });
    }
  });
});

// шкала фильтра цены
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

// проверка данных формы для платежной карты
var paymentCardInput = document.getElementById('payment__card-number');
var paymentCardDateInput = document.getElementById('payment__card-date');
var cvcInput = document.getElementById('payment__card-cvc');
var paymentCardholderInput = document.getElementById('payment__cardholder');
var paymentValidMessage = document.querySelector('.payment__card-status');

var isDateInputCorrect = function () {
  return paymentCardDateInput.validity.valid;
};
var isCvcInputCorrect = function () {
  return cvcInput.validity.valid;
};
var isCardholderInputCorrect = function () {
  return paymentCardholderInput.validity.valid;
};

var paymentCardAllChecks = function () {
  if (luhn(paymentCardInput.value) && isDateInputCorrect() && isCvcInputCorrect() && isCardholderInputCorrect()) {
    paymentValidMessage.textContent = 'Одобрен';
    paymentCardInput.setCustomValidity('');
  } else {
    paymentValidMessage.textContent = 'Не определён';
    if (!luhn(paymentCardInput.value)) {
      paymentCardInput.setCustomValidity('Пожалуйста, проверьте номер карты.');
    }
  }
};

function luhn(cardNumber) {
  if (cardNumber.length === 16) {
    var arr = cardNumber.split('').map(function (char, index) {
      var digit = parseInt(char, 10);

      if ((index + cardNumber.length) % 2 === 0) {
        var digitX2 = digit * 2;
        return digitX2 > 9 ? digitX2 - 9 : digitX2;
      }

      return digit;
    });

    return !(arr.reduce(function (a, b) {
      return a + b;
    }, 0) % 10);
  }
  return false;
}

paymentCardInput.addEventListener('input', paymentCardAllChecks);
paymentCardDateInput.addEventListener('input', paymentCardAllChecks);
cvcInput.addEventListener('input', paymentCardAllChecks);
paymentCardholderInput.addEventListener('input', paymentCardAllChecks);
