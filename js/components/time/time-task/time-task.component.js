var timeTask = {
    template: require('./time-task.tpl.html'),
    bindings: {
        user: '<',
        timeTypesService: '<',
        firebaseRef: '<',
        helperService: '<'
    }, // Notice the binding on the router! (its currentUser.user)
    controller: 'TimeTaskController'
};

angular
    .module('components.time')
    .component('timeTask', timeTask)
    .config(function ($stateProvider) {
        // Task
        $stateProvider
            .state('task', {
                url: "/task/{year:int}/{month:int}/{day:int}",
                parent: 'app', // Make a new parent to have the addTime component stable there
                views: {
                    navigation: {
                        component: "navigation",
                    },
                    header: {
                        component: "addTime"
                    },
                    content: {
                        component: "timeTask",
                        bindings: { user: 'currentUser.user' },
                    }
                },
                resolve: {
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
                    ,
                    firebaseRef: function(firebaseRef) {
                        return firebaseRef;
                    },
                    helperService: function(helperService) {
                        return helperService;
                    }
                }
            });
    });