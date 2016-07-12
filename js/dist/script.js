'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomValidation = function () {
	function CustomValidation(input) {
		_classCallCheck(this, CustomValidation);

		this.invalidities = [];
		this.validityChecks = [];

		//add reference to the input node
		this.inputNode = input;

		//trigger method to attach the listener
		this.registerListener();
	}

	_createClass(CustomValidation, [{
		key: 'addInvalidity',
		value: function addInvalidity(message) {
			this.invalidities.push(message);
		}
	}, {
		key: 'getInvalidities',
		value: function getInvalidities() {
			return this.invalidities.join('. \n');
		}
	}, {
		key: 'checkValidity',
		value: function checkValidity(input) {
			for (var i = 0; i < this.validityChecks.length; i++) {

				var isInvalid = this.validityChecks[i].isInvalid(input);
				if (isInvalid) {
					this.addInvalidity(this.validityChecks[i].invalidityMessage);
				}

				var requirementElement = this.validityChecks[i].element;

				if (requirementElement) {
					if (isInvalid) {
						requirementElement.classList.add('invalid');
						requirementElement.classList.remove('valid');
					} else {
						requirementElement.classList.remove('invalid');
						requirementElement.classList.add('valid');
					}
				} // end if requirementElement
			} // end for
		}
	}, {
		key: 'checkInput',
		value: function checkInput() {
			// checkInput now encapsulated

			this.inputNode.CustomValidation.invalidities = [];
			this.checkValidity(this.inputNode);

			if (this.inputNode.CustomValidation.invalidities.length === 0 && this.inputNode.value !== '') {
				this.inputNode.setCustomValidity('');
			} else {
				var message = this.inputNode.CustomValidation.getInvalidities();
				this.inputNode.setCustomValidity(message);
			}
		}
	}, {
		key: 'registerListener',
		value: function registerListener() {
			//register the listener here

			var CustomValidation = this;

			this.inputNode.addEventListener('keyup', function () {
				CustomValidation.checkInput();
			});
		}
	}]);

	return CustomValidation;
}();

/* ----------------------------

	Validity Checks

	The arrays of validity checks for each input
	Comprised of three things
		1. isInvalid() - the function to determine if the input fulfills a particular requirement
		2. invalidityMessage - the error message to display if the field is invalid
		3. element - The element that states the requirement

---------------------------- */

var usernameValidityChecks = [{
	isInvalid: function isInvalid(input) {
		return input.value.length < 3;
	},

	invalidityMessage: 'This input needs to be at least 3 characters',
	element: document.querySelector('label[for="username"] .input-requirements li:nth-child(1)')
}, {
	isInvalid: function isInvalid(input) {
		var illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
		return illegalCharacters ? true : false;
	},

	invalidityMessage: 'Only letters and numbers are allowed',
	element: document.querySelector('label[for="username"] .input-requirements li:nth-child(2)')
}];

var passwordValidityChecks = [{
	isInvalid: function isInvalid(input) {
		return input.value.length < 8 | input.value.length > 100;
	},

	invalidityMessage: 'This input needs to be between 8 and 100 characters',
	element: document.querySelector('label[for="password"] .input-requirements li:nth-child(1)')
}, {
	isInvalid: function isInvalid(input) {
		return !input.value.match(/[0-9]/g);
	},

	invalidityMessage: 'At least 1 number is required',
	element: document.querySelector('label[for="password"] .input-requirements li:nth-child(2)')
}, {
	isInvalid: function isInvalid(input) {
		return !input.value.match(/[a-z]/g);
	},

	invalidityMessage: 'At least 1 lowercase letter is required',
	element: document.querySelector('label[for="password"] .input-requirements li:nth-child(3)')
}, {
	isInvalid: function isInvalid(input) {
		return !input.value.match(/[A-Z]/g);
	},

	invalidityMessage: 'At least 1 uppercase letter is required',
	element: document.querySelector('label[for="password"] .input-requirements li:nth-child(4)')
}, {
	isInvalid: function isInvalid(input) {
		return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
	},

	invalidityMessage: 'You need one of the required special characters',
	element: document.querySelector('label[for="password"] .input-requirements li:nth-child(5)')
}];

var passwordRepeatValidityChecks = [{
	isInvalid: function isInvalid() {
		return passwordRepeatInput.value != passwordInput.value;
	},

	invalidityMessage: 'This password needs to match the first one'
}];

/* ----------------------------

	Setup CustomValidation

	Setup the CustomValidation prototype for each input
	Also sets which array of validity checks to use for that input

---------------------------- */

var usernameInput = document.getElementById('username');
var passwordInput = document.getElementById('password');
var passwordRepeatInput = document.getElementById('password_repeat');

usernameInput.CustomValidation = new CustomValidation(usernameInput);
usernameInput.CustomValidation.validityChecks = usernameValidityChecks;

passwordInput.CustomValidation = new CustomValidation(passwordInput);
passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

passwordRepeatInput.CustomValidation = new CustomValidation(passwordRepeatInput);
passwordRepeatInput.CustomValidation.validityChecks = passwordRepeatValidityChecks;

/* ----------------------------

	Event Listeners

---------------------------- */

var inputs = document.querySelectorAll('input:not([type="submit"])');

var submit = document.querySelector('input[type="submit"');
var form = document.getElementById('registration');

function validate() {
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].CustomValidation.checkInput();
	}
}


submit.addEventListener('click', validate);
form.addEventListener('submit', function(e) {
   validate();
   e.preventDefault();
});
