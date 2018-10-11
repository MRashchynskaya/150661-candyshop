'use strict';

(function () {
  // переменная-массив для объектов товаров в корзине - получаем данные из модуля data
  var goodsCards = window.data.goodsCards;
  // переменная-массив для объектов товаров в корзине
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
  // блок пустой корзины
  var goodsCardsEmpty = document.querySelector('.goods__card-empty');
  // Массив классов соответствующих value рейтинга
  var starsRatingClass = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  // Блок корзина в хедере страницы
  var headerCart = document.querySelector('.main-header__basket');
  var headerCartText;
  var headerCartEmpty = 'В корзине ничего нет';

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

  catalogCardsElement.appendChild(createAllCards(goodsCards));

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

  // Убераем у блока catalog__cards класс catalog__cards--load
  document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
  // Скрываем при помощи класса visually-hidden блок catalog__load
  document.querySelector('.catalog__load').classList.add('visually-hidden');

  // ТОВАРЫ В КОРЗИНЕ
  // алгоритм:
  // 1. В карточки товаров добавляем дата атрибут содержащий индекс в массиве
  // 2. При клике на "добавить" клонируем объект из массива карточек и добавляем его в массив "в корзине";
  // добавляем новое свойство - кол-во в корзине (orderedAmount);
  // удаляем ненужные свойства: amount, weight, rating, nutritionFacts.
  // 3. Условие: Если объект (товар) уже есть в массиве "корзина", то меняется только свойство "orderedAmount"

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

  // обработчик события на кнопку "добавить в корзину"
  for (var i = 0; i < btnAddToCart.length; i++) {
    btnAddToCart[i].addEventListener('click', checkIsInStock);
  }

})();
