'use strict';

(function () {
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

  // переменная-массив для объектов - карточек товаров в каталоге
  var goodsCards = [];

  // функция генерации строки из нескольких случайных элементов массива - состав продукта
  var getRandomIngredients = function () {
    var quantity = window.util.getRandomNumber(ingredientsMinMax);
    var randomIngredients = '';
    for (var i = 1; i < quantity; i++) {
      randomIngredients += window.util.getRandomArrayElement(INGREDIENTS_LIST) + ', ';
    }
    randomIngredients += window.util.getRandomArrayElement(INGREDIENTS_LIST);
    return randomIngredients;
  };

  // создаем рандомизированные массивы имен товаров и картинок
  randomGoodsNames = window.util.shuffleArray(GOODS_NAMES);
  randomPictureUrls = window.util.shuffleArray(PICTURES_URLS);

  // создание объекта для карточки товара
  var createObjectCard = function (goodsName, pictureUrl, index) {
    return {
      name: goodsName,
      picture: pictureUrl,
      amount: window.util.getRandomNumber(Amount),
      price: window.util.getRandomNumber(Price),
      weight: window.util.getRandomNumber(Weight),
      rating: {
        value: window.util.getRandomNumber(Rating.value),
        number: window.util.getRandomNumber(Rating.number)
      },
      nutritionFacts: {
        sugar: window.util.getRandomArrayElement(nutritionFacts.sugar),
        energy: window.util.getRandomNumber(nutritionFacts.energy),
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

  createGoodsCards(GOODS_NAMES);

  window.data = {
    goodsCards: goodsCards
  };
})();
