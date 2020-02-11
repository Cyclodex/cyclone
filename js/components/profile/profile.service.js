function ProfileService(firebaseRef, $firebaseArray, $firebaseObject, AuthService) {
    var user = AuthService.getUser();
    var refFeatures = firebaseRef.getFeaturesReference(user);

    var service = {};
    service.createDefaultFeatures = function (feature) {
        var refFeature = refFeatures.child('/' + feature.key);
        var objFeature = $firebaseObject(refFeature);
        return objFeature.$loaded()
            .then(function (data) {
                if (data.$value === null) {
                    data.$value = feature.default;
                    data.$save().then(function (refFeature) {
                        // Successfully created default value of feature
                    }, function (error) {
                        console.log("Error:", error);
                    });
                    return data;
                }
                return data;
            });
    };
    service.updateFeatures = function (feature) {
        return feature.$save().then(function (refFeatures) {
            // Success
        }, function (error) {
            console.log("Error:", error);
        });
    };

    // Definition / default of features:
    service.getFeatures = function () {
        // Define the features we have, where the user can enable or disable
        return {
            // User type 1 behaviour
            'copyButton': {
                'name': 'Copy Button',
                'key': 'copyButton',
                'group': 'actions',
                'default': true,
                'description': 'Use this project & task for current timer',
                'icon': 'arrow_upward'
            },
            'attachButton': {
                'name': 'Direct attach',
                'key': 'attachButton',
                'group': 'actions',
                'default': false,
                'description': 'Directly track current timer into this task',
                'icon': 'playlist_add'
            },
            // User type 2 behaviour
            'continueButton': {
                'name': 'Continue Button',
                'key': 'continueButton',
                'group': 'actions',
                'default': false,
                'description': 'Track current timer and continue on this task',
                'icon': 'play_arrow'
            },
            // Statistic bar
            'showWorkTypeStats': {
                'name': 'Stats of work type',
                'key': 'showWorkTypeStats',
                'group': 'stats',
                'default': false,
                'description': 'Shows daily type allocation',
                'beta': true // Makes it not visible
            },
            // Time
            'timeFormat': {
                'name': 'Timeformat',
                'key': 'timeFormat',
                'group': 'time',
                'type': 'radio',
                'default': 'hShort+dec',
                'options': {
                    'dec': '0,00',
                    'hShort': '0h 00m',
                    'hShort+dec': '0h 00m | 0,00',
                    'hLong': '0 hours 0 minutes',
                    'hLong+dec': '0 hours 0 minutes | 0,00',
                },
                'description': 'Timeformat of displayed durations',
            },
            // Copy
            'copyFormat': {
                'name': 'Copyformat',
                'key': 'copyFormat',
                'group': 'copy',
                'type': 'radio',
                'default': 'dec',
                'options': {
                    'disabled': 'Disable copy feature',
                    'timeformat': 'Use the displayed time format',
                    'dec': '0,00',
                    'hShort': '0h 00m',
                    'hLong': '0 hours 0 minutes',
                    'project': 'Project',
                    'task': 'Task',
                    'description': 'Description',
                },
                'description': 'What should be copied when you check a task as tracked (checkbox)',
            },
            // Calendar / Report
            'calendar': {
                'name': 'Report',
                'key': 'calendar',
                'group': 'calendar',
                'default': true,
                'description': 'A rough monthly calendar overview.',
                'icon': 'date_range'
            },
            // Calendar / Report
            'todo': {
                'name': 'TODO',
                'key': 'todo',
                'group': 'todo',
                'default': false,
                'description': 'A basic todo list',
                'icon': 'list_alt'
            },
        }
    };

    // Status and preferences of features for the current user
    // TODO: This is loaded 3 times now, we should make this different, so it only loads once.
    service.getFeatureStates = function () {
        var featureStates = service.getFeatures();
        var featureSettings = $firebaseObject(refFeatures);
        featureSettings.$loaded().then(function () {
            for (var feature in featureStates) {
                var featureValue = featureSettings[feature];
                if (typeof (featureValue) === 'boolean') {
                    // Boolean sets enabled state
                    featureStates[feature].enabled = !!featureSettings[feature];
                } else if (typeof (featureValue) === 'string') {
                    // String sets the value
                    featureStates[feature].value = featureSettings[feature];
                } else {
                    console.warn("Feature " + featureStates[feature].name + ": No user settings found, using defaults");
                    featureStates[feature].value = featureStates[feature].default;
                    featureStates[feature].enabled = !!featureStates[feature].default;
                }
            }
        });
        return featureStates;
    };

    // Check the state of a feature
    service.checkFeature = function (key) {
        return !!userFeatureStates[key];
    };

    var userFeatureStates = service.getFeatureStates;

    return service;
}

angular
    .module('components.profile')
    .factory('ProfileService', ProfileService);