/**
 * Cyclone app
 *
 * Created by Fabian Gander | Cyclodex
 */

// Load angular libraries
require('angular');
require('angular-route');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');
require('angular-clipboard');
require('angular-moment');

// Other libraries
// Getting this error with randomcolor (a js library only)
// Error: [$injector:unpr] Unknown provider: randomColorProvider <- randomColor
//require('randomcolor');

// Firebase
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('angularfire');

// Cyclone app files
require('./config/config.js');
require('./cyclone.module.js');
require('./components/auth.factory.js');
require('./components/focus.directive.js');
require('./components/order.filter.js');
require('./footer/footer.component.js');
require('./time/time.controller.js');
require('./version/version.component.js');