'use strict';

// свойства товаров
var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'
];
var INGREDIENTS_LIST = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var PICTURES_URLS = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];

var AMOUNT = {
  min: 0,
  max: 20
};
var PRICE = {
  min: 100,
  max: 1500
};
var WEIGHT = {
  min: 30,
  max: 300
};
var RATING = {
  value: {
    min: 1,
    max: 5
  },
  number: {
    min: 10,
    max: 900
  }
};
var NUTRITION_FACTS = {
  sugar: [true, false],
  energy: {
    min: 70,
    max: 500
  }
};

// переменная-массив для объектов - карточек товаров
var goodCards = [];

// функция генерации случайного номера элемента массива
var getRandomArrayElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// функция генерации случайного числа в интервале от мин. до макс.
var getRandomNumber = function (values) {
  return Math.floor(Math.random() * (values.max - values.min + 1)) + values.min;
};

// функция генерации строки из нескольких случайных элементов массива - состав продукта
var ingredientsMinMax = {
  min: 1,
  max: 5
};
var getRandomIngredients = function () {
  var quantity = getRandomNumber(ingredientsMinMax);
  var randomIngredients = '';
  for (var i = 1; i < quantity; i++) {
    randomIngredients += getRandomArrayElement(INGREDIENTS_LIST) + ', ';
  }
  randomIngredients += getRandomArrayElement(INGREDIENTS_LIST);
  return randomIngredients;
};

// создание массива с объектами - товарами
var createGoodCard = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var goodCard = {
      name: arr[i],
      picture: getRandomArrayElement(PICTURES_URLS),
      amount: getRandomNumber(AMOUNT),
      price: getRandomNumber(PRICE),
      weight: getRandomNumber(WEIGHT),
      rating: {
        value: getRandomNumber(RATING.value),
        number: getRandomNumber(RATING.number)
      },
      nutritionFacts: {
        sugar: getRandomArrayElement(NUTRITION_FACTS.sugar),
        energy: getRandomNumber(NUTRITION_FACTS.energy),
        contents: getRandomIngredients(),
      }
    };
    goodCards.push(goodCard);
  }
  return goodCards;
};

createGoodCard(GOODS_NAMES);

// Убераем у блока catalog__cards класс catalog__cards--load
var catalogCards = document.querySelector('.catalog__cards');
catalogCards.classList.remove('catalog__cards--load');

// Скрываем при помощи класса visually-hidden блок catalog__load
var catalogLoad = document.querySelector('.catalog__load');
catalogLoad.classList.add('visually-hidden');

// найдём элемент, в который мы будем вставлять карточки товаров
var catalogCardsElement = document.querySelector('.catalog__cards');

// находим шаблон для карточки товара
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.catalog__card');

// Массив классов соответствующих value рейтинга
var starsRatingClass = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];

// Массив классов соответствующих количеству товара (amount)
var goodsAmountClass = ['card--in-stock', 'card--little', 'card--soon'];

// Клонируем шаблон, заполняем данными и добавляем (отрисуем) в документ
for (var i = 0; i < goodCards.length; i++) {
  var cardElement = cardTemplate.cloneNode(true);
  var goodsAmount = goodCards[i].amount;
  if (goodsAmount === 0) {
    cardElement.classList.remove('card--in-stock');
    cardElement.classList.add(goodsAmountClass[2]);
  } else if (goodsAmount > 0 && goodsAmount <= 5) {
    cardElement.classList.remove('card--in-stock'); cardElement.classList.add(goodsAmountClass[1]);
  }

  cardElement.querySelector('.card__title').textContent = goodCards[i].name;
  cardElement.querySelector('.card__img').src = goodCards[i].picture;
  cardElement.querySelector('.card__img').alt = goodCards[i].name;
  cardElement.querySelector('.card__price').textContent = goodCards[i].price;
  // содержимое блока card__price должно выглядеть следующим образом:
  // {{price}} <span class="card__currency">₽</span><span class="card__weight">/ {{weight}} Г</span>;

  var ratingObject = goodCards[i].rating;
  cardElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  cardElement.querySelector('.stars__rating').classList.add(starsRatingClass[ratingObject.value - 1]);
  cardElement.querySelector('.star__count').textContent = ratingObject.number;

  var nutritionFactsObject = goodCards[i].nutritionFacts;
  if (nutritionFactsObject.sugar) {
    cardElement.querySelector('.card__characteristic').textContent = 'Содержит сахар ' + nutritionFactsObject.energy + ' ккал';
  } else {
    cardElement.querySelector('.card__characteristic').textContent = 'Без сахара ' + nutritionFactsObject.energy + ' ккал';
  }

  cardElement.querySelector('.card__composition-list').textContent = nutritionFactsObject.contents;

  catalogCardsElement.appendChild(cardElement);
}
