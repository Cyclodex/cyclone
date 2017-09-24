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
require('angular-loading-bar');

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

// ROOT
require('./root.module');
require('./root.component');
// COMMON
require('./common/app.module');
require('./common/app.component');
require('./common/app.controller');

// Cyclone app files
require('./cyclone.module.js');
require('./components/components.module'); // components module
require('./components/auth/auth.module'); // components module
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
require('./filters/type.js');
require('./components/helper.service.js');
require('./components/addTime/addTime.component.js');
require('./welcome/welcome.component.js');

// Project
require('./components/project/project.module');
require('./components/project/project.service');
require('./components/project/project-detail/project-detail.component');
require('./components/project/project-detail/project-detail.controller');
require('./components/project/project-new/project-new.component');
require('./components/project/project-new/project-new.controller');
require('./components/project/projects-crud/projects-crud.component');
require('./components/project/projects-crud/projects-crud.controller');

//Profile
require('./components/profile/profile.module');
require('./components/profile/profile.service');
require('./components/profile/profile-crud/profile-crud.component');
require('./components/profile/profile-crud/profile-crud.controller');
require('./components/profile/profile-detail/profile-detail.component');
require('./components/profile/profile-detail/profile-detail.controller');

// Auth
require('./components/auth/auth.service'); // Auth components
