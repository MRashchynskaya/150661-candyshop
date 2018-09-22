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
// переменная-массив для объектов - карточек товаров
var goodsCards = [];
// переменная-массив для объектов - товаров в корзине
var cart = [];
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
// Блок корзина в хедере страницы
var headerCart = document.querySelector('.main-header__basket');

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
    cardindex: index,
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
  cardElement.dataset.cardindex = goodsCard.cardindex;
  // cardElement.setAttribute('data-cardindex', goodsCard.cardindex);
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

// функция удаления из корзины
var deleteCardFromCart = function (e) {
  e.preventDefault();
  var currentBtn = e.target;
  var cardToDelete = currentBtn.closest('.card-order');
  var deleteCardIndex = Number(cardToDelete.dataset.cardindex);
  goodsCardsElement.removeChild(cardToDelete);
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].cardindex === deleteCardIndex) {
      var amountToDelete = cart[i].amount;
      cart.splice(i, 1);
    }
  }
  for (var k = 0; k < goodsCards.length; k++) {
    if (goodsCards[k].cardindex === deleteCardIndex) {
      goodsCards[k].amount = amountToDelete;
    }
  }
  headerCart.textContent = 'В корзине ' + cart.length + ' товаров';
  if (cart.length === 0) {
    document.querySelector('.goods__cards').classList.add('goods__cards--empty');
    document.querySelector('.goods__card-empty').classList.remove('visually-hidden');
    headerCart.textContent = 'В корзине ничего нет';
  }
  return cart;
};

// Находим ВСЕ кнопки "Удалить товар" и навешиваем события
var createDeleteEvent = function () {
  var btnDeleteFromCart = document.querySelectorAll('.card-order__close');
  for (var i = 0; i < btnDeleteFromCart.length; i++) {
    btnDeleteFromCart[i].addEventListener('click', deleteCardFromCart);
  }
};

// проверка наличия товара и наличия его в корзине
var checkIsInStock = function (e) {
  e.preventDefault();
  var currentBtn = e.target;
  var currentCard = currentBtn.closest('.catalog__card');
  var currentCardIndex = Number(currentCard.dataset.cardindex);
  if (goodsCards[currentCardIndex].amount !== 0) {
    addNewGoodInCart(currentCardIndex, checkIsInCart(currentCardIndex));
  }
  //   alert('Извините данного товара нет в наличии');
  // }
  return currentCardIndex;
};

var checkIsInCart = function (currentindex) {
  var isInCart;
  if (cart.length === 0) {
    isInCart = false;
    return isInCart;
  } else {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].cardindex === currentindex) {
        isInCart = true;
        return isInCart;
      } else {
        isInCart = false;
      }
    }
  }
  return isInCart;
};

// добавление НОВОГО товара в корзину
var addNewGoodInCart = function (currentindex, isincart) {
  if (isincart) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].cardindex === currentindex) {
        cart[i].orderedAmount += 1;
        cart[i].elem.querySelector('.card-order__count').value = cart[i].orderedAmount;
      }
    }
  } else {
    var productInCart = Object.assign({orderedAmount: 1}, goodsCards[currentindex]);
    var inCartElement = inCartTemplate.cloneNode(true);
    inCartElement.querySelector('.card-order__title').textContent = productInCart.name;
    inCartElement.querySelector('.card-order__img').src = productInCart.picture;
    inCartElement.querySelector('.card-order__img').alt = productInCart.name;
    inCartElement.querySelector('.card-order__price').textContent = productInCart.price + ' ₽';
    inCartElement.querySelector('.card-order__count').value = productInCart.orderedAmount;
    inCartElement.dataset.cardindex = productInCart.cardindex;
    productInCart.elem = inCartElement;
    goodsCardsElement.appendChild(inCartElement);
    cart.push(productInCart);
    createDeleteEvent();
    // Удаляем у блока goods__cards класс goods__cards--empty и скрываем блок goods__card-empty
    document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
    document.querySelector('.goods__card-empty').classList.add('visually-hidden');
  }
  goodsCards[currentindex].amount -= 1;
  var currentAmount = goodsCards[currentindex].amount;
  if (currentAmount === 0) {
    goodsCards[currentindex].elem.classList.remove('card--in-stock');
    goodsCards[currentindex].elem.classList.add('card--soon');
  } else if (currentAmount > 0 && currentAmount <= 5) {
    goodsCards[currentindex].elem.classList.remove('card--in-stock');
    goodsCards[currentindex].elem.classList.add('card--little');
  }
  headerCart.textContent = 'В корзине ' + cart.length + ' товаров';
  return cart;
};

// обработчик события на кнопку "добавить в корзину"
for (var i = 0; i < btnAddToCart.length; i++) {
  btnAddToCart[i].addEventListener('click', checkIsInStock);
}
