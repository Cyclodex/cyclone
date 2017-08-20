// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("firebaseRef", ['Auth', 'moment', '$stateParams', 'stateService',
    function(Auth, moment, $stateParams, stateService) {

        function getReference(user){
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

        return {
            getReference: function(user) {
                return getReference(user);
            }
            // getCurrentDate: function() {
            //     return getCurrentDate();
            // }
        }
    }
]);