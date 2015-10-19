var util = require('util');
var passport = require('passport');
var Factory = require('./factory');
var utils = require('./factories/utils');

function MockStrategy (options, verify) {
  if (!verify) { throw new TypeError('MockStrategy requires a verify callback'); }
  if (!options.callbackURL) { throw new TypeError('MockStrategy requires a callbackURL'); }

  this.name = options.name || 'mock';
  this.verify = verify;
  this._callbackURL = options.callbackURL;
  this._factory = new Factory();

  var factories = require('./factories/factories')
  for (factoryName in factories) {
    this._factory.add(factoryName, factories[factoryName])
    this._factory.add(factoryName.toLowerCase(), factories[factoryName])
  }
}

util.inherits(MockStrategy, passport.Strategy);

/**
 * Call this to configure an options object that will be handed to the MockStrategy's Factory
 *
 * Useful for letting values vary while keeping a few constant for business rule related reasons.
 *
 * @param {*} factoryOptions
 */
MockStrategy.prototype.setFactoryOptions = function(factoryOptions) {
  this._factoryOptions = factoryOptions;
};

MockStrategy.prototype.authenticate = function authenticate (req, options) {
  if (req.query.__mock_strategy_callback) {
    if (this._error) {
      var error = this._error;
      this.__proto__ && delete this.__proto__._error;
      this.fail(error, 401);
    } else {

      var accessToken = this._accessToken || utils.makeToken(40);
      var refreshToken = this._refreshToken || utils.makeToken(40);
      var profile = this._profile;
      if (!profile && this._factory.isDefined(this.name)) {
        profile = this._factory.build(this.name, this._factoryOptions);
      }

      if (this.__proto__) {
        delete this.__proto__._accessToken;
        delete this.__proto__._refreshToken;
        delete this.__proto__._profile;
      }

      this.verify(accessToken, refreshToken, profile, function (err, user) {
        if ( err ) {
          return this.fail(err, 500)
        }
        if ( user === false ) {
          return this.fail('user entry returned false', 401);
        }

        this.success(user);
      }.bind(this));
    }
  } else {
    this.redirect(this._callbackURL + '?__mock_strategy_callback=true');
  }
}

module.exports.Strategy = MockStrategy;
module.exports.OAuth2Strategy = MockStrategy;
