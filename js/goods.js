'use strict';

// свойства товаров
var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'
];
var INGREDIENTS_LIST = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var PICTURES_URLS = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];

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
// Массив классов соответствующих количеству товара (amount)
var goodsAmountClass = ['card--in-stock', 'card--little', 'card--soon'];
// переменная-массив для объектов - карточек товаров
var goodsCards = [];
// переменная-массив для объектов - товаров в корзине
var goodsInCart = [];
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

// перемешиваем случайно массивы имен и картинок
var shuffleArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = arr[j];
    arr[j] = arr[i];
    arr[i] = swap;
  }
  return arr;
};
var randomGoodsNames = shuffleArray(GOODS_NAMES);
var randomPictureUrls = shuffleArray(PICTURES_URLS);

// создание объекта для карточки товара
var createObjectCard = function (goods_name, picture_url) {
  var objectCard = {
    name: goods_name,
    picture: picture_url,
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
    }
  };
  return objectCard;
};

// создание массива с карточками товаров
var createGoodsCards = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var goodCard = createObjectCard(randomGoodsNames[i], randomPictureUrls[i]);
    goodsCards.push(goodCard);
  }
  return goodsCards;
};
createGoodsCards(GOODS_NAMES);

// Клонируем шаблон, заполняем данными и добавляем на страницу
var fragment = document.createDocumentFragment();
for (var i = 0; i < goodsCards.length; i++) {
  var cardElement = cardTemplate.cloneNode(true);
  var goodsAmount = goodsCards[i].amount;
  if (goodsAmount === 0) {
    cardElement.classList.remove('card--in-stock');
    cardElement.classList.add(goodsAmountClass[2]);
  } else if (goodsAmount > 0 && goodsAmount <= 5) {
    cardElement.classList.remove('card--in-stock'); cardElement.classList.add(goodsAmountClass[1]);
  }

  cardElement.querySelector('.card__title').textContent = goodsCards[i].name;
  cardElement.querySelector('.card__img').src = goodsCards[i].picture;
  cardElement.querySelector('.card__img').alt = goodsCards[i].name;
  cardElement.querySelector('.card__price-value').textContent = goodsCards[i].price + ' ';
  cardElement.querySelector('.card__weight').textContent = ' ' + goodsCards[i].weight + ' Г';

  var ratingObject = goodsCards[i].rating;
  cardElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  cardElement.querySelector('.stars__rating').classList.add(starsRatingClass[ratingObject.value - 1]);
  cardElement.querySelector('.star__count').textContent = ratingObject.number;

  var nutritionFactsObject = goodsCards[i].nutritionFacts;
  nutritionFactsObject.sugar ? cardElement.querySelector('.card__characteristic').textContent = 'Содержит сахар ' + nutritionFactsObject.energy + ' ккал' : cardElement.querySelector('.card__characteristic').textContent = 'Без сахара ' + nutritionFactsObject.energy + ' ккал';

  cardElement.querySelector('.card__composition-list').textContent = nutritionFactsObject.contents;

  fragment.appendChild(cardElement);
}

catalogCardsElement.appendChild(fragment);

// Убераем у блока catalog__cards класс catalog__cards--load
document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
// Скрываем при помощи класса visually-hidden блок catalog__load
document.querySelector('.catalog__load').classList.add('visually-hidden');

// Раздел ТОВАРЫ В КОРЗИНЕ
// создание массива с товарами в корзине
var createGoodsInCart = function (addedInCart) {
  for (var i = 0; i < addedInCart; i++) {
    goodsInCart.push(goodsCards[i]);
  }
  return goodsInCart;
};
createGoodsInCart(3);

// Клонируем шаблон товаров в корзине, заполняем данными и добавляем на страницу
var fragmentCart = document.createDocumentFragment();
for (var i = 0; i < goodsInCart.length; i++) {
  var inCartElement = inCartTemplate.cloneNode(true);
  inCartElement.querySelector('.card-order__title').textContent = goodsInCart[i].name;
  inCartElement.querySelector('.card-order__img').src = goodsInCart[i].picture;
  inCartElement.querySelector('.card-order__img').alt = goodsInCart[i].name;
  inCartElement.querySelector('.card-order__price').textContent = goodsCards[i].price + ' ₽';
  fragmentCart.appendChild(inCartElement);
}
goodsCardsElement.appendChild(fragmentCart);

// Удаляем у блока goods__cards класс goods__cards--empty и скрываем блок goods__card-empty
document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
document.querySelector('.goods__card-empty').classList.add('visually-hidden');
