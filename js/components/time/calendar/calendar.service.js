function CalendarService(firebaseRef, $firebaseArray, AuthService, timeTypesService){

    var user = AuthService.getUser();
    const refCurrentWeek = firebaseRef.getCurrentWeekReference(user);
    const refCurrentWeekVis = refCurrentWeek.orderByChild("order");
    const refDayVisArray = $firebaseArray(refCurrentWeekVis);
    const printInfo = {};

    return {
        getCurrentWeekData: function () {
            console.log(refDayVisArray);

            refDayVisArray.$watch(function(event) {
                var milisecondsOfOneHour = 60 * 60 * 1000;
  
                // Get the time types
                const types = timeTypesService.getTimeTypes();
                if (!refDayVisArray) return;

                refDayVisArray.forEach(function(day, dayKey) {
                    // Set default values we need
                    for (var timeType in types) {
                        types[timeType].timeSum = 0;
                        types[timeType].timeSumHours = 0;
                    }

                    angular.forEach(day, function(data) {
                        // Check if entries type is supported (we also have system which is not part of graphs)
                        if (!data || !data.type || types[data.type] === undefined) {
                            //console.warn('Ignoring type "' + data.type + '" for sum visualization.');
                            return;
                        }

                        // Save the date
                        if (!printInfo[dayKey]) {
                            printInfo[dayKey] = {};
                        }
                        if (!printInfo[dayKey].date) {
                            printInfo[dayKey]['date'] = data.timestampStart;
                        }

                        // Sum up every work type
                        types[data.type]['timeSum'] += data.timestampDuration;
                        types[data.type]['timeSumHours'] += data.timestampDuration  / milisecondsOfOneHour;
                    });

                    printInfo[dayKey]['sum'] = 0;
                    printInfo[dayKey]['sumHours'] = 0;
                    for (var timeType in types) {
                        // Count up total of work (ignores private and trust time)
                        if (timeType === 'work' || timeType === 'internal') {
                            // Sum of all work hours
                            printInfo[dayKey]['sum'] += types[timeType].timeSum;
                            printInfo[dayKey]['sumHours'] += types[timeType].timeSumHours;
                        }
                    }
                });
            });
            console.log(printInfo);
            return printInfo;
        },
    };
}

angular
    .module('components.calendar')
    .factory('CalendarService', CalendarService);