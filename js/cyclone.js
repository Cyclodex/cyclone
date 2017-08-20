/**
 * Cyclone app
 *
 * Created by Fabian Gander | Cyclodex
 */

// Load angular libraries
require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');
require('angular-clipboard');
require('angular-moment');

// Firebase
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('angularfire');
var firebaseui = require('firebaseui');

// Webpack loads the environment specific config file
if (FIREBASE_PRODUCTION) {
    require('./config/config.production.js');
}
if (!FIREBASE_PRODUCTION) {
    require('./config/config.staging.js');
}

// Cyclone app files
require('./cyclone.module.js');
require('./components/auth.factory.js');
require('./components/nav.component.js');
require('./components/firebase.factory.js');
require('./components/focus.directive.js');
require('./components/order.filter.js');
require('./components/humanizeDate.filter.js');
require('./components/timeTypes.service.js');
require('./stats/stats.component.js');
require('./time/time.controller.js');
require('./version/version.component.js');
require('./components/login.component.js');
require('./task/task.component.js');
require('./task/taskCardList.component.js');
require('./components/autocomplete/autocompleteProject.component.js');
require('./timeline/timeline.component.js');
require('./timeline/timelineCardList.component.js');
require('./components/dateSwitcher/dateSwitcher.component');
require('./components/state.service');

// Testing component:
require('./test/welcome.component.js');
