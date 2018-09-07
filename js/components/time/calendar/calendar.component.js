var calendar = {
    template: require('./calendar.tpl.html'),
    bindings: {
        user: '<',
        timeTypesService: '<'
    }, // Notice the binding on the router! (its currentUser.user)
    controller: 'CalendarController'
};

angular
    .module('components.calendar')
    .component('calendar', calendar)
    .config(function ($stateProvider) {
        $stateProvider
            .state('calendar', {
                url: "/calendar/{year:int}/{month:int}",
                parent: 'app',
                views: {
                    navigation: {
                        component: "navigation",
                    },
                    header: {
                        // component: "addTime"
                    },
                    content: {
                        component: "calendar",
                        bindings: { user: 'currentUser.user' },
                    }
                },
                resolve: {
                    // Simplify this ? (check the videos about isAuthenticated stuff)
                    // auth.service !
                    currentUser: ["userPromise", function(userPromise) {
                        return userPromise.getPromise().then(function(success){
                            return success;
                        }, function(reason){
                            console.log("userPromise Failed: " + reason);
                        }, function(notification){
                            console.log("notification: " + notification);
                        });
                    }],
                    timeTypesService: ["timeTypesService", function(timeTypesService) {
                        return timeTypesService.getTimeTypes();
                    }],
                }
            });
    });
