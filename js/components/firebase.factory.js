// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("firebaseRef", ['Auth', 'moment',
    function(Auth, moment) {

        // Note: This is defining the type and values also for the stats.
        this.year = moment().year();
        this.weekNumber = moment().week();
        this.weekDay = moment().weekday();
        this.todayNumber = this.weekDay;
        this.currentDate = new Date;

        function getReference(user){
            var ref = firebase.database().ref();
            var reference = ref.child("time/" + user.uid + "/" + this.year + "/" + this.weekNumber + "/" + this.todayNumber);
            return reference;
        }

        return {
            getReference: function(user) {
                return getReference(user);
            },
            sayHello : function(name) {
                return "Hi " + name + "!";
            }
        }
    }
]);