/**
 * Cyclone app
 *
 * Created by Fabian Gander | Cyclodex
 */
// Load less / css files
require('../less/master.less');

// Load angular libraries
require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');
require('angular-clipboard');
require('angular-logger');
require('angular-moment');
require('angular-loading-bar');

// Analytics
require('angulartics');
require('angulartics-google-analytics');

// Firebase
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('angularfire');
var firebaseui = require('firebaseui');

// Webpack loads the environment specific config file
// if (FIREBASE_PRODUCTION) {
//     require('./config/config.production');
// }
// if (!FIREBASE_PRODUCTION) {
//     require('./config/config.staging');
// }
if (FIREBASE_DB_INSTANCE) {
    require('./config/config.' + FIREBASE_DB_INSTANCE);
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

// TODO refine those
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
require('./components/dateSwitcher/dateSwitcher.component');
require('./components/state.service');
require('./components/helper.service');

// Time
require('./components/time/time.module');
require('./components/time/timeline/timeline.component');
require('./components/time/timeline/timeline.controller');
require('./components/time/timeline-list/timeline-list.component');

// Task
require('./components/time/time-task/time-task.component');
require('./components/time/time-task/time-task.controller');
require('./components/time/time-task-list/time-task-list.component');

// Autocomplete
require('./components/time/autocomplete/autocompleteProject.component');
// AddTime
require('./components/time/addTime/addTime.component');
require('./components/time/addTime/addTime.controller');
require('./components/time/addTime/addTime.service');

// Welcome
require('./welcome/welcome.component');

// Filters
require('./filters/type');

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
