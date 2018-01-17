var timeline = {
    template: require('./timeline.tpl.html'),
    bindings: {
        user: '<',
        timeTypesService: '<'
    }, // Notice the binding on the router! (its currentUser.user)
    controller: 'TimelineController'
};

angular
    .module('components.time')
    .component('timeline', timeline)
    .config(function ($stateProvider) {
        $stateProvider
            .state('time', {
                url: "/time/{year:int}/{month:int}/{day:int}",
                parent: 'app',
                views: {
                    navigation: {
                        component: "navigation",
                    },
                    header: {
                        component: "addTime"
                    },
                    content: {
                        component: "timeline",
                        bindings: { user: 'currentUser.user' },
                    }
                },
                resolve: {
                    // Simplify this ? (check the videos about isAuthenticated stuff)
                    // auth.service !
                    currentUser:
                        ["userPromise", "$state", function(userPromise, $state) {
                            return userPromise.getPromise().then(function(success){
                                return success;
                            }, function(reason){
                                console.log("userPromise Failed: " + reason);
                                // $state.transitionTo('login');
                            }, function(notification){
                                console.log("notification: " + notification);
                            });
                        }]
                    ,
                    timeTypesService: function(timeTypesService) {
                        return timeTypesService.getTimeTypes();
                    }
                }
            });
    });
