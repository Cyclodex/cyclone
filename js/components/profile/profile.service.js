function ProfileService(firebaseRef, $firebaseArray, $firebaseObject, AuthService){
    var user = AuthService.getUser();
    var refFeatures = firebaseRef.getFeaturesReference(user);

    var service = {};
    service.createDefaultFeatures = function (feature) {
            var refFeature = refFeatures.child('/' + feature.key);
            var objFeature = $firebaseObject(refFeature);
            return objFeature.$loaded()
                .then(function(data) {
                    if (data.$value === null) {
                        data.$value = feature.default;
                        data.$save().then(function(refFeature) {
                            // Successfully created default value of feature
                        }, function(error) {
                            console.log("Error:", error);
                        });
                        return data;
                    }
                    return data;
                });
        };
    service.updateFeatures = function (feature) {
            return feature.$save().then(function(refFeatures) {
                // Success
            }, function(error) {
                console.log("Error:", error);
            });
        };

    // Definition / default of features:
    service.getFeatures = function (){
            // Define the features we have, where the user can enable or disable
            return {
                // User type 1 behaviour
                'copyButton' : {
                    'name': 'Copy Button',
                    'key' : 'copyButton',
                    'default': true,
                    'description': 'Use this project & task for current timer',
                    'icon': 'arrow_upward'
                },
                'attachButton' : {
                    'name': 'Direct attach',
                    'key' : 'attachButton',
                    'default': false,
                    'description': 'Directly track current timer into this task',
                    'icon': 'playlist_add'
                },
                // User type 2 behaviour
                'continueButton' : {
                    'name': 'Continue Button',
                    'key' : 'continueButton',
                    'default': false,
                    'description': 'Track current timer and continue on this task',
                    'icon': 'play_arrow'
                },
                // Statistic bar
                'showWorkTypeStats' : {
                    'name': 'Stats of work type',
                    'key' : 'showWorkTypeStats',
                    'default': false,
                    'description': 'Shows daily type allocation',
                    'beta': true // Makes it not visible
                }
            }
        };

    // State of features for current user
    service.getFeatureStates = function (){
        var featureStates = service.getFeatures();
        var featureSettings = $firebaseObject(refFeatures);
        featureSettings.$loaded().then(function(){
            for (var feature in featureStates) {
                featureStates[feature].enabled = !!featureSettings[feature];
            }
        });
        return featureStates;
    };

    // Check the state of a feature
    service.checkFeature = function(key){
        return !!userFeatureStates[key];
    };

    var userFeatureStates = service.getFeatureStates;

    return service;
}

angular
    .module('components.profile')
    .factory('ProfileService', ProfileService);