'use strict';

(function () {
  // переменные для переключение вкладок способов доставки и оплаты товаров
  var deliveryToggleBtn = document.querySelectorAll('.deliver .toggle-btn__input');
  var deliveryStore = document.querySelector('.deliver__store');
  var deliveryCourier = document.querySelector('.deliver__courier');
  var payToggleBtn = document.querySelectorAll('.payment .toggle-btn__input');
  var payCard = document.querySelector('.payment__card-wrap');
  var payCash = document.querySelector('.payment__cash-wrap');
  var paymentCardAllInputs = document.querySelectorAll('.payment__inputs input');
  var deliveryCourierAllInputs = document.querySelectorAll('.deliver__courier input, .deliver__courier textarea');
  var deliveryStoreInputs = document.querySelectorAll('.deliver__store-list input');
  var deliveryStoreMetroList = document.querySelector('.deliver__store-list');
  var deliveryStoreMapImg = document.querySelector('.deliver__store-map-img');
  var deliveryStoreAddress = document.querySelector('.deliver__store-describe');

  // по умолчанию блокируем поля данных для способа "Курьером"
  deliveryCourierAllInputs.forEach(function (itemInput) {
    itemInput.disabled = true;
  });

  // меняем класс видимости и блокируем инпуты для способов доставки
  var toggleClassDelivery = function (item) {
    deliveryStore.classList.toggle('visually-hidden', item.value === 'courier');
    deliveryCourier.classList.toggle('visually-hidden', item.value === 'store');
    deliveryCourierAllInputs.forEach(function (itemInput) {
      itemInput.disabled = item.value === 'store';
    });
    deliveryStoreInputs.forEach(function (itemInput) {
      itemInput.disabled = item.value === 'courier';
    });
  };

  // обработчик события на кнопки способа доставки и оплаты
  deliveryToggleBtn.forEach(function (itemBtn) {
    itemBtn.addEventListener('change', function () {
      toggleClassDelivery(itemBtn);
    });
  });

  payToggleBtn.forEach(function (item) {
    item.addEventListener('change', function () {
      payCard.classList.toggle('visually-hidden', item.value === 'cash');
      payCash.classList.toggle('visually-hidden', item.value === 'card');
      if (item.value === 'cash') {
        paymentCardAllInputs.forEach(function (itemInput) {
          itemInput.disabled = true;
        });
      } else {
        paymentCardAllInputs.forEach(function (itemInput) {
          itemInput.disabled = false;
        });
      }
    });
  });

  // проверка данных формы для платежной карты
  var paymentCardInput = document.querySelector('#payment__card-number');
  var paymentCardDateInput = document.querySelector('#payment__card-date');
  var cvcInput = document.querySelector('#payment__card-cvc');
  var paymentCardholderInput = document.querySelector('#payment__cardholder');
  var paymentValidMessage = document.querySelector('.payment__card-status');

  var luhn = function (cardNumber) {
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
  };

  var paymentCardInputCheck = function () {
    var checkLuhn = luhn(paymentCardInput.value);
    var customValidityText = checkLuhn ? '' : 'Пожалуйста, проверьте номер карты.';
    paymentCardInput.setCustomValidity(customValidityText);
    return checkLuhn;
  };

  var paymentCardDateInputCheck = function () {
    var patternDate = /(0[1-9]|1[012])\/(1[89]|[2-5][0-9])/;
    var checkDate = patternDate.test(paymentCardDateInput.value);
    var customValidityText = checkDate ? '' : 'Пожалуйста, проверьте дату';
    paymentCardDateInput.setCustomValidity(customValidityText);
    return checkDate;
  };

  var cvcInputCheck = function () {
    var checkCVC = cvcInput.value >= 100 && cvcInput.value <= 999;
    var customValidityText = checkCVC ? '' : 'Пожалуйста, проверьте CVC';
    cvcInput.setCustomValidity(customValidityText);
    return checkCVC;
  };

  var checkCardStatus = function () {
    paymentValidMessage.textContent = paymentCardInputCheck() && paymentCardDateInputCheck() && cvcInputCheck() && paymentCardholderInput.validity.valid ? 'Одобрен' : 'Не определён';
  };

  // отправка данных из формы на сервер
  var form = document.querySelector('.form-order');
  var modalSuccess = document.querySelector('.modal--success');
  var modalError = document.querySelector('.modal--error');
  var ESC_KEYCODE = 27;

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), onSucces, onError);
    evt.preventDefault();
  });

  var onSucces = function () {
    modalSuccess.classList.remove('modal--hidden');

    var modalClose = modalSuccess.querySelector('.modal__close');
    modalClose.addEventListener('click', function () {
      modalSuccess.classList.add('modal--hidden');
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        modalSuccess.classList.add('modal--hidden');
      }
    });
  };

  var onError = function () {
    modalError.classList.remove('modal--hidden');

    var modalClose = modalError.querySelector('.modal__close');
    modalClose.addEventListener('click', function () {
      modalError.classList.add('modal--hidden');
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        modalError.classList.add('modal--hidden');
      }
    });
  };

  paymentCardInput.addEventListener('input', checkCardStatus);
  paymentCardDateInput.addEventListener('input', checkCardStatus);
  cvcInput.addEventListener('input', checkCardStatus);
  paymentCardholderInput.addEventListener('input', checkCardStatus);

  // смена карты и адреса при выборе станции метро


  deliveryStoreMetroList.addEventListener('change', function (evt) {
    if (evt.target.id === 'store-academicheskaya') {
      deliveryStoreMapImg.src = 'img/map/academicheskaya.jpg';
      deliveryStoreAddress.textContent = 'проспект Науки, д. 19, корп. 3, литер А, ТК «Платформа», 3-й этаж, секция 310';
    }
    if (evt.target.id === 'store-vasileostrovskaya') {
      deliveryStoreMapImg.src = 'img/map/vasileostrovskaya.jpg';
      deliveryStoreAddress.textContent = 'м. Василеостровская, д. 59, корп. 3, 3-й этаж, секция 210';
    }
    if (evt.target.id === 'store-rechka') {
      deliveryStoreMapImg.src = 'img/map/rechka.jpg';
      deliveryStoreAddress.textContent = 'м. Черная речка, д. 16, 1-й этаж';
    }
    if (evt.target.id === 'store-petrogradskaya') {
      deliveryStoreMapImg.src = 'img/map/petrogradskaya.jpg';
      deliveryStoreAddress.textContent = 'м. Петроградская, д. 89, корп. 3, литер А, 3-й этаж, секция 310';
    }
    if (evt.target.id === 'store-proletarskaya') {
      deliveryStoreMapImg.src = 'img/map/proletarskaya.jpg';
      deliveryStoreAddress.textContent = 'м. Пролетарская, д. 75, корп. 4, 2-й этаж';
    }
    if (evt.target.id === 'store-vostaniya') {
      deliveryStoreMapImg.src = 'img/map/vostaniya.jpg';
      deliveryStoreAddress.textContent = 'м. Восстания, д. 44, корп. 7, 2-й этаж';
    }
    if (evt.target.id === 'store-prosvesheniya') {
      deliveryStoreMapImg.src = 'img/map/prosvesheniya.jpg';
      deliveryStoreAddress.textContent = 'м. Просвещения, д. 19, корп. 4, 1-й этаж';
    }
    if (evt.target.id === 'store-frunzenskaya') {
      deliveryStoreMapImg.src = 'img/map/frunzenskaya.jpg';
      deliveryStoreAddress.textContent = 'м. Фрунзенская, д. 77, корп. 4, 1-й этаж';
    }
    if (evt.target.id === 'store-chernishevskaya') {
      deliveryStoreMapImg.src = 'img/map/chernishevskaya.jpg';
      deliveryStoreAddress.textContent = 'м. Чернышевская, д. 75, корп. 4, 2-й этаж';
    }
    if (evt.target.id === 'store-tehinstitute') {
      deliveryStoreMapImg.src = 'img/map/tehinstitute.jpg';
      deliveryStoreAddress.textContent = 'м. Технологический институт, д. 55, корп. 7, 3-й этаж';
    }
  });

})();
