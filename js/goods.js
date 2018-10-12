'use strict';

(function () {
  // переменная-массив для объектов товаров в корзине
  var goodsCards = [];
  // переменная-массив для объектов товаров в корзине
  var cart = [];
  var cartTotalCost = 0;
  // найдём элемент, в который мы будем вставлять карточки товаров
  var catalogCardsElement = document.querySelector('.catalog__cards');
  // находим шаблон для карточки товара
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.catalog__card');
  // находим шаблон пустого каталога (если после фильтра не остается ни одного товара)
  var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
  // находим шаблон для товаров в корзине
  var inCartTemplate = document.querySelector('#card-order')
    .content
    .querySelector('.goods_card');
  // найдём элемент, в который мы будем вставлять карточки товаров в корзине
  var goodsCardsElement = document.querySelector('.goods__cards');
  // блок пустой корзины
  var goodsCardsEmpty = document.querySelector('.goods__card-empty');
  // Массив классов соответствующих value рейтинга
  var starsRatingClass = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  // Блок корзина в хедере страницы
  var headerCart = document.querySelector('.main-header__basket');
  var headerCartText;
  var headerCartEmpty = 'В корзине ничего нет';
  // окно статуса загрузки
  var errorPopup = document.querySelector('.modal--error');
  var errorPopupClose = errorPopup.querySelector('.modal__close');
  var errorMessage = errorPopup.querySelector('.modal__message');
  var ESC_KEYCODE = 27;

  // для фильтра "избранное"
  var favoriteInput = document.querySelector('#filter-favorite');
  var favoriteAmountValue = favoriteInput.parentNode.querySelector('.input-btn__item-count');
  var favoriteList = [];

  var fillGoodsCards = function (data) {
    goodsCards = data;
    for (var i = 0; i < goodsCards.length; i++) {
      goodsCards[i].cardIndex = i;
    }
    catalogCardsElement.appendChild(createAllCards(goodsCards));
    // Убераем у блока catalog__cards класс catalog__cards--load
    document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
    // Скрываем при помощи класса visually-hidden блок catalog__load
    document.querySelector('.catalog__load').classList.add('visually-hidden');
    favoriteAmountValue.textContent = '(0)';
    addEventsForCardButtons();
    window.findPriceValue(goodsCards);
    window.findGoodsNumber(goodsCards);
    window.goodsData = goodsCards;
  };

  // функция обработчик клика по кнопке закрытия блока сообщения об ошибке
  var onClickCloseError = function (evt) {
    errorPopup.classList.add('modal--hidden');
    evt.target.removeEventListener('click', onClickCloseError);
  };

  // функция, открывающая окно с ошибкой, если произошла ошибка при получении данных с сервера
  var onError = function (str) {
    errorPopup.classList.remove('modal--hidden');
    errorMessage.textContent = str;
    errorPopupClose.addEventListener('click', onClickCloseError);
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        errorPopup.classList.add('modal--hidden');
      }
    });
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
    cardElement.querySelector('.card__img').src = 'img/cards/' + goodsCard.picture;
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

  // Обновление каталога после применения фильтра
  var updateGoodsCollection = function (newGoods) {
    catalogCardsElement.innerHTML = '';
    if (newGoods.length === 0) {
      catalogCardsElement.appendChild(emptyFiltersTemplate.cloneNode(true));
    } else {
      catalogCardsElement.appendChild(createAllCards(newGoods));
      addEventsForCardButtons();
    }
  };

  // ТОВАРЫ В КОРЗИНЕ
  // алгоритм:
  // 1. В карточки товаров добавляем дата атрибут содержащий индекс в массиве
  // 2. При клике на "добавить" клонируем объект из массива карточек и добавляем его в массив "в корзине";
  // добавляем новое свойство - кол-во в корзине (orderedAmount);
  // удаляем ненужные свойства: amount, weight, rating, nutritionFacts.
  // 3. Условие: Если объект (товар) уже есть в массиве "корзина", то меняется только свойство "orderedAmount"

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
      goodsCardsElement.classList.add('goods__cards--empty');
      goodsCardsEmpty.classList.remove('visually-hidden');
      headerCart.textContent = headerCartEmpty;
    }
  };

  // Находим ВСЕ кнопки "Удалить товар" и навешиваем события
  var createDeleteEvent = function (newCardInCart) {
    var btnDeleteFromCart = newCardInCart.querySelector('.card-order__close');
    btnDeleteFromCart.addEventListener('click', function (e) {
      e.preventDefault();
      deleteCardFromCart(e.target);
    });
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
  var createDecreaseIncreaseEvent = function (newCardInCart, currentIndex) {
    var btnDecrease = newCardInCart.querySelector('.card-order__btn--decrease');
    var btnIncrease = newCardInCart.querySelector('.card-order__btn--increase');
    btnDecrease.addEventListener('click', function (e) {
      e.preventDefault();
      changeOrderedAmount(e.target, -1, currentIndex);
    });
    btnIncrease.addEventListener('click', function (e) {
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
      inCartElement.querySelector('.card-order__img').src = 'img/cards/' + productInCart.picture;
      inCartElement.querySelector('.card-order__img').alt = productInCart.name;
      inCartElement.querySelector('.card-order__price').textContent = productInCart.price + ' ₽';
      inCartElement.querySelector('.card-order__count').value = productInCart.orderedAmount;
      inCartElement.dataset.cardIndex = productInCart.cardIndex;
      productInCart.elem = inCartElement;
      goodsCardsElement.appendChild(inCartElement);
      cart.push(productInCart);
      createDeleteEvent(inCartElement);
      createDecreaseIncreaseEvent(inCartElement, currentIndex);
      // Удаляем у блока goods__cards класс goods__cards--empty и скрываем блок goods__card-empty
      goodsCardsElement.classList.remove('goods__cards--empty');
      goodsCardsEmpty.classList.add('visually-hidden');
    }

    goodsCards[currentIndex].amount -= 1;
    changeGoodsCardClass(currentIndex);
    calcCartTotalCost();
    headerCartText = 'В корзине ' + cart.length + ' товаров ' + 'на ' + cartTotalCost + '₽';
    headerCart.textContent = headerCartText;
    return cart;
  };

  // События для кнопок "Добавить +1", "Избранное" и "Состав"
  var addEventsForCardButtons = function () {
    // Находим ВСЕ кнопки "Добавить в корзину"
    var btnAddToCart = document.querySelectorAll('.card__btn');
    // обработчик события на кнопку "добавить в корзину"
    for (var k = 0; k < btnAddToCart.length; k++) {
      btnAddToCart[k].addEventListener('click', checkIsInStock);
    }
    // При нажатии на кнопку избранного в карточке товара
    var btnFavProd = document.querySelectorAll('.card__btn-favorite');
    var addFavProd = function (e) {
      e.preventDefault();
      var currentBtn = e.target;
      currentBtn.classList.toggle('card__btn-favorite--selected');
      var currentCard = currentBtn.closest('.catalog__card');
      var currentCardIndex = parseInt(currentCard.dataset.cardIndex, 10);
      var currentCardFavorite = favoriteList.indexOf(goodsCards[currentCardIndex]);
      if (currentCardFavorite === -1) {
        favoriteList.push(goodsCards[currentCardIndex]);
      } else {
        favoriteList.splice(currentCardFavorite, 1);
      }
      favoriteAmountValue.textContent = '(' + favoriteList.length + ')';
    };
    for (var j = 0; j < btnFavProd.length; j++) {
      btnFavProd[j].addEventListener('click', addFavProd);
    }
    // кнопки раскрытия и скрытия состава
    var ingredientsBtn = document.querySelectorAll('.card__btn-composition');
    ingredientsBtn.forEach(function (item) {
      item.addEventListener('click', function (evt) {
        var currentCard = evt.target.closest('.catalog__card');
        var ingredientsList = currentCard.querySelector('.card__composition');
        ingredientsList.classList.toggle('card__composition--hidden');
      });
    });
  };

  // запускаем загрузку данных с сервера
  window.backend.load(fillGoodsCards, onError);

  window.goods = {
    updateGoodsCollection: updateGoodsCollection,
    favoriteList: favoriteList
  };

})();
