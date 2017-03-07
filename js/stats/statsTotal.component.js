// Stats total display component
// Takes 2 parameters the private and work totals to format and display.
// <stats-total work-total="..." private-total="..."></stats-total>
angular.module('cycloneApp').component('statsTotal', {
  template: require('./statsTotal.tpl.html'),
  bindings: {
      workTotal: '<',
      workTypes: '<'
  }
});
