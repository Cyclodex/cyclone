// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("firebaseRef", ['stateService',
    function (stateService) {

        function getTimeReference(user) {
            // Load the current date (from stateService = URL) to load correct data
            currentDate = stateService.getCurrentDate();
            this.year = currentDate.year();
            this.weekNumber = currentDate.week();
            this.weekDay = currentDate.weekday();

            var ref = firebase.database().ref();
            var reference = ref.child("time/" + user.uid + "/" + this.year + "/" + this.weekNumber + "/" + this.weekDay);
            return reference;
        }

        function getCurrentTaskReference(user) {
            var ref = firebase.database().ref();
            var reference = ref.child("userSettings/" + user.uid + "/currentTask");
            return reference;
        }

        function getProjectReference(user) {
            var ref = firebase.database().ref();
            var reference = ref.child("userSettings/" + user.uid + "/projects");
            return reference;
        }

        function getFeaturesReference(user) {
            var ref = firebase.database().ref();
            var reference = ref.child("userSettings/" + user.uid + "/features");
            return reference;
        }

        function getStartTimesReference(user) {
            var ref = firebase.database().ref();
            var reference = ref.child("userSettings/" + user.uid + "/startTimes");
            return reference;
        }

        function getWeeksOfMonthReferences(user) {
            const weekDate = stateService.getMonthDetails();
            const year = weekDate.year;
            const references = [];

            weekDate.weeks.forEach(weekNumber => {
                const ref = firebase.database().ref();
                references.push(ref.child("time/" + user.uid + "/" + year + "/" + weekNumber));
            });

            return {
                details: weekDate,
                references: references
            }
        }

        function getTodoReference(user) {
            var ref = firebase.database().ref();
            var reference = ref.child("todo/" + user.uid);
            return reference;
        }

        return {
            getTimeReference: function (user) {
                return getTimeReference(user);
            },
            getCurrentTaskReference: function (user) {
                return getCurrentTaskReference(user);
            },
            getProjectReference: function (user) {
                return getProjectReference(user);
            },
            getFeaturesReference: function (user) {
                return getFeaturesReference(user);
            },
            getStartTimesReference: function (user) {
                return getStartTimesReference(user);
            },
            getWeeksOfMonthReferences: function (user) {
                return getWeeksOfMonthReferences(user);
            },
            getTodoReference: function (user) {
                return getTodoReference(user);
            },
        }
    }
]);