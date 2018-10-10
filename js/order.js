'use strict';

(function () {
  // переменные для переключение вкладок способов доставки и оплаты товаров
  var deliveryToggleBtn = document.querySelectorAll('.deliver .toggle-btn__input');
  var deliverStore = document.querySelector('.deliver__store');
  var deliverCourier = document.querySelector('.deliver__courier');
  var payToggleBtn = document.querySelectorAll('.payment .toggle-btn__input');
  var payCard = document.querySelector('.payment__card-wrap');
  var payCash = document.querySelector('.payment__cash-wrap');
  var paymentCardAllInputs = document.querySelectorAll('.payment__inputs input');
  var deliverCourierAllInputs = document.querySelectorAll('.deliver__courier input, .deliver__courier textarea');
  var deliverStoreInputs = document.querySelectorAll('.deliver__store-list input');

  // по умолчанию блокируем поля данных для способа "Курьером"
  deliverCourierAllInputs.forEach(function (itemInput) {
    itemInput.disabled = true;
  });

  // меняем класс видимости и блокируем инпуты для способов доставки
  var toggleClassDelivery = function (item) {
    deliverStore.classList.toggle('visually-hidden', item.value === 'courier');
    deliverCourier.classList.toggle('visually-hidden', item.value === 'store');
    deliverCourierAllInputs.forEach(function (itemInput) {
      itemInput.disabled = item.value === 'store';
    });
    deliverStoreInputs.forEach(function (itemInput) {
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
    if (luhn(paymentCardInput.value)) {
      paymentCardInput.setCustomValidity('');
      return true;
    } else {
      paymentCardInput.setCustomValidity('Пожалуйста, проверьте номер карты.');
      return false;
    }
  };

  var paymentCardDateInputCheck = function () {
    var patternDate = /(0[1-9]|1[012])\/(1[89]|[2-5][0-9])/;
    if (paymentCardDateInput.value.search(patternDate) !== -1) {
      paymentCardDateInput.setCustomValidity('');
      return true;
    } else {
      paymentCardDateInput.setCustomValidity('Пожалуйста, проверьте дату');
      return false;
    }
  };

  var cvcInputCheck = function () {
    if (cvcInput.value >= 100 && cvcInput.value <= 999) {
      cvcInput.setCustomValidity('');
      return true;
    } else {
      cvcInput.setCustomValidity('Пожалуйста, проверьте CVC');
      return false;
    }
  };

  var cardholderInputCheck = function () {
    if (paymentCardholderInput.value !== '') {
      paymentCardholderInput.setCustomValidity('');
      return true;
    } else {
      paymentCardholderInput.setCustomValidity('Пожалуйста, проверьте имя');
      return false;
    }
  };

  var checkCardStatus = function () {
    if (paymentCardInputCheck() && paymentCardDateInputCheck() && cvcInputCheck() && cardholderInputCheck()) {
      paymentValidMessage.textContent = 'Одобрен';
    } else {
      paymentValidMessage.textContent = 'Не определён';
    }
  };

  paymentCardInput.addEventListener('input', function () {
    paymentCardInputCheck();
    checkCardStatus();
  });
  paymentCardDateInput.addEventListener('input', function () {
    paymentCardDateInputCheck();
    checkCardStatus();
  });
  cvcInput.addEventListener('input', function () {
    cvcInputCheck();
    checkCardStatus();
  });
  paymentCardholderInput.addEventListener('input', function () {
    cardholderInputCheck();
    checkCardStatus();
  });
})();
