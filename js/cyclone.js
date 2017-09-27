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
    require('./config/config.production');
}
if (!FIREBASE_PRODUCTION) {
    require('./config/config.staging');
}

// ROOT
require('./root.module');
require('./root.component');
// COMMON
require('./common/app.module');
require('./common/app.component');
require('./common/app.controller');

// Cyclone app files
require('./cyclone.module');
require('./components/components.module'); // components module
require('./components/auth/auth.module'); // components module
require('./components/auth.factory');
require('./components/nav.component');
require('./components/firebase.factory');
require('./components/focus.directive');
require('./components/order.filter');
require('./components/humanizeDate.filter');
require('./components/timeTypes.service');
require('./stats/stats.component');
require('./version/version.component');
require('./components/login.component');
require('./task/task.component');
require('./task/taskCardList.component');
require('./components/autocomplete/autocompleteProject.component');
require('./timeline/timeline.component');
require('./timeline/timeline.controller');
require('./timeline/timelineCardList.component');
require('./components/dateSwitcher/dateSwitcher.component');
require('./components/state.service');
require('./filters/type');
require('./components/helper.service');
require('./components/addTime/addTime.component');
require('./components/addTime/addTime.controller');
require('./components/addTime/addTime.service');
require('./welcome/welcome.component');

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
