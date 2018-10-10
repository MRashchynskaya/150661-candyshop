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

  var isDateInputCorrect = function () {
    return paymentCardDateInput.validity.valid;
  };
  var isCvcInputCorrect = function () {
    return cvcInput.value >= 100 && cvcInput.value <= 999;
  };
  var isCardholderInputCorrect = function () {
    return paymentCardholderInput.validity.typeMismatch;
  };

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
      paymentValidMessage.textContent = 'Одобрен';
      paymentCardInput.setCustomValidity('');
    } else {
      paymentValidMessage.textContent = 'Не определён';
      paymentCardInput.setCustomValidity('Пожалуйста, проверьте номер карты.');
    }
  };

  var paymentCardDateInputCheck = function () {
    if (isDateInputCorrect()) {
      paymentValidMessage.textContent = 'Одобрен';
    } else {
      paymentValidMessage.textContent = 'Не определён';
      paymentCardDateInput.setCustomValidity('Пожалуйста, проверьте дату');
    }
  };

  var cvcInputCheck = function () {
    if (isCvcInputCorrect()) {
      paymentValidMessage.textContent = 'Одобрен';
      cvcInput.setCustomValidity('');
    } else {
      paymentValidMessage.textContent = 'Не определён';
      cvcInput.setCustomValidity('Пожалуйста, проверьте CVC');
    }
  };

  var cardholderInputCheck = function () {
    if (!isCardholderInputCorrect()) {
      paymentValidMessage.textContent = 'Одобрен';
      paymentCardholderInput.setCustomValidity('');
    } else {
      paymentValidMessage.textContent = 'Не определён';
      paymentCardholderInput.setCustomValidity('Пожалуйста, проверьте имя');
    }
  };

  paymentCardInput.addEventListener('input', paymentCardInputCheck);
  paymentCardDateInput.addEventListener('input', paymentCardDateInputCheck);
  cvcInput.addEventListener('input', cvcInputCheck);
  paymentCardholderInput.addEventListener('input', cardholderInputCheck);
})();
