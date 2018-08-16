function CalendarService(firebaseRef, $firebaseArray, AuthService, timeTypesService, moment){

    var user = AuthService.getUser();
    // const refCurrentWeek = firebaseRef.getCurrentWeekReference(user);
    // const refCurrentWeekVis = refCurrentWeek.orderByChild("order");
    // const refDayVisArray = $firebaseArray(refCurrentWeekVis);
    return {
        getCurrentMonthData: function() {
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
            }

            refWeeksReferences.forEach(ref => {
                const refOrder = ref.orderByChild("order");
                const refVisArray = this.getCurrentWeekData($firebaseArray(refOrder), month);
                calendar = Object.assign(refVisArray, calendar);
            });

            return {
                calendar: calendar,
                weekStart: details.weekStart
            }
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
                    
                    // TODO: correct?
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