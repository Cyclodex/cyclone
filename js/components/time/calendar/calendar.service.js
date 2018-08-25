function CalendarService(firebaseRef, AuthService, timeTypesService, moment, $q){
    var user = AuthService.getUser();
    
    return {
        getCurrentMonthStructure: function() {
            let defer = $q.defer();

            let calendar = {};
            const { details } = this.getWeeksOfMonthReferences();
            const { date } = details;
            for (var day = 1; day <= details.lastDay; day++) {
                calendar[day] = {};
                date.date(day);
                calendar[day]['date'] = date.valueOf();
                if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
                    calendar[day]['weekend'] = true;
                }
                calendar[day]['dateDetails'] = Object.assign({}, {
                    year: date.year(),
                    month: date.month() + 1,
                    date: date.date()
                });
                console.log( calendar[day]['dateDetails']);
            }

            if (calendar) {
                defer.resolve({
                    calendar: calendar,
                    weekStart: details.weekStart
                });
            } else {
                defer.reject('Oops... something went wrong');
            }

            return defer.promise;
        },
        getWeeksOfMonthReferences: function() {
            return firebaseRef.getWeeksOfMonthReferences(user);
        },
        getCurrentWeekData: function (refDayVisArray, month) {
            let defer = $q.defer();
            const output = {};

            refDayVisArray.$loaded(function() {  
                var milisecondsOfOneHour = 60 * 60 * 1000;
  
                // Get the time types
                const types = timeTypesService.getTimeTypes();

                if (!refDayVisArray) defer.reject('Oops... something went wrong');

                refDayVisArray.forEach(function(day) {
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
                        // Zero indexed month (-1)
                        if (dayMoment.month() !== (month - 1) ) {
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
                defer.resolve( output );
            });

            return defer.promise;
        },
    };
}

angular
    .module('components.calendar')
    .factory('CalendarService', CalendarService);