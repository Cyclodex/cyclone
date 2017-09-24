function ProfileService(firebaseRef, $firebaseArray, $firebaseObject, AuthService){

    var user = AuthService.getUser();
    var refFeatures = firebaseRef.getFeaturesReference(user);

    return {
        // Verify that the features are all defined, otherwise will set default values for this user
        createDefaultFeatures: function (feature) {
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
        },
        updateFeatures: function (feature) {
            return feature.$save().then(function(refFeatures) {
                // Success
            }, function(error) {
                console.log("Error:", error);
            });
        },
        getFeatures: function (){
            // Define the features we have, where the user can enable or disable
            return {
                'continueButton' : {
                    'name': 'Continue Button',
                    'key' : 'continueButton',
                    'default': false,
                    'description': 'Track current timer and continue on this Task',
                    'icon': 'play_arrow'
                },
                'copyButton' : {
                    'name': 'Copy Button',
                    'key' : 'copyButton',
                    'default': false,
                    'description': 'Use this project & description for current timer',
                    'icon': 'arrow_upward'
                }
            }
        }
    };
}

angular
    .module('components.profile')
    .factory('ProfileService', ProfileService);