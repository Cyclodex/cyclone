function CalendarService(firebaseRef, $firebaseArray, AuthService, timeTypesService, moment, $q){
    var user = AuthService.getUser();
    
    return {
        getCurrentMonthData: function() {
            let defer = $q.defer();

            console.log("start");
            let calendar = {};
            const getWeeksOfMonthReferences = firebaseRef.getWeeksOfMonthReferences(user);
            const refWeeksReferences = getWeeksOfMonthReferences.references;
            const details = getWeeksOfMonthReferences.details;
            const date = details.date;
            const month = details.month -1; // zero indexed
            for (var day = 1; day <= details.lastDay; day++) {
                calendar[day] = {};
                date.date(day);
                calendar[day]['date'] = date.valueOf();
                if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
                    calendar[day]['weekend'] = true;
                }
                calendar[day]['dateDetails'] = [];
                calendar[day]['dateDetails']['year'] = date.year();
                calendar[day]['dateDetails']['month'] = date.month() + 1;
                calendar[day]['dateDetails']['date'] = date.date();
            }

            const promises = [];
            refWeeksReferences.forEach(ref => {
                const refOrder = ref.orderByChild("order");
                const refVisArray = this.getCurrentWeekData($firebaseArray(refOrder), month);
                promises.push(refVisArray);
                // calendar = Object.assign(refVisArray, calendar);
            });
            Promise.all(promises).then((data) => {
                console.log("promised all", data);
                data.forEach(week => {
                    // calendar = Object.assign(week, calendar);
                    console.log("each", week);
                });
                console.log(calendar);

                if (calendar) {
                    defer.resolve({
                        calendar: calendar,
                        weekStart: details.weekStart
                    });
                } else {
                    defer.reject('Oops... something went wrong');
                }
            });

            return defer.promise;
        },
        getCurrentWeekData: function (refDayVisArray, month) {
            const output = {};

            refDayVisArray.$loaded(function() {  
                var milisecondsOfOneHour = 60 * 60 * 1000;
  
                // Get the time types
                const types = timeTypesService.getTimeTypes();
                

                if (!refDayVisArray) return;

                refDayVisArray.forEach(function(day, weekDayKey) {
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

                        const dayMoment = moment(data.timestampStart);
                        if (dayMoment.month() !== month){
                            //console.error("day not from this month");
                            return;
                        }

                        const dayKey = dayMoment.date();
                        day["dayNumber"] = dayKey;

                        // Save the date
                        if (!output[dayKey]) {
                            output[dayKey] = {};
                            output[dayKey].uncheckedWarning = false;
                        }

                        // if entry is not checked
                        if (!data.checked && (data.type === 'work' || data.type === 'internal') ){
                            output[dayKey].uncheckedWarning = true;
                        }

                        if (!output[dayKey].date) {
                            output[dayKey]['date'] = data.timestampStart;
                        }

                        output[dayKey]['dayNumber'] = dayKey;
                        output[dayKey]['sum'] = 0;
                        output[dayKey]['sumHours'] = 0;

                        // Save the project
                        if (!output[dayKey].projects) {
                            output[dayKey].projects = [];
                        }
                        if (output[dayKey].projects.indexOf(data.project) === -1) {
                            output[dayKey].projects.push(data.project);
                        }

                        // Sum up every work type
                        types[data.type]['timeSum'] += data.timestampDuration;
                        types[data.type]['timeSumHours'] += data.timestampDuration  / milisecondsOfOneHour;
                    });
                    
                    if (output[day.dayNumber]){
                        for (var timeType in types) {
                            // Count up total of work (ignores private and trust time)
                            if (timeType === 'work' || timeType === 'internal') {
                                // Sum of all work hours
                                output[day.dayNumber]['sum'] += types[timeType].timeSum;
                                output[day.dayNumber]['sumHours'] += types[timeType].timeSumHours;
                            }
                        }
                    }

                });
            });
            return output;
        },
    };
}

angular
    .module('components.calendar')
    .factory('CalendarService', CalendarService);