// Stats types display component
// <stats-types work-types="..."></stats-types>
angular.module('cycloneApp').component('statsTypes', {
  template: require('./statsTypes.tpl.html'),
  bindings: {
      workTypes: '<'
  }
});
