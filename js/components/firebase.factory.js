// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("firebaseRef", ['Auth', 'moment', '$stateParams', 'stateService',
    function(Auth, moment, $stateParams, stateService) {

        function getTimeReference(user){
            // Load the current date (from stateService = URL) to load correct data
            currentDate = stateService.getCurrentDate();
            this.year = currentDate.year();
            this.weekNumber = currentDate.week();
            this.weekDay = currentDate.weekday();

            var ref = firebase.database().ref();
            // console.log("time/" + user.uid + "/" + this.year + "/" + this.weekNumber + "/" + this.todayNumber);
            var reference = ref.child("time/" + user.uid + "/" + this.year + "/" + this.weekNumber + "/" + this.weekDay);
            //console.log("time/" + user.uid + "/" + this.year + "/" + this.weekNumber + "/" + this.weekDay);
            return reference;
        }

        function getCurrentTaskReference(user){
            var ref = firebase.database().ref();
            var reference = ref.child("currentTask/" + user.uid);
            return reference;
        }

        return {
            getTimeReference: function(user) {
                return getTimeReference(user);
            },
            getCurrentTaskReference: function(user) {
                return getCurrentTaskReference(user);
            }
        }
    }
]);