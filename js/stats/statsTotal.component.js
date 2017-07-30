// Stats total display component
// <stats-total work-total="..."></stats-total>
angular.module('cycloneApp').component('statsTotal', {
  template: require('./statsTotal.tpl.html'),
  bindings: {
      workTotal: '<'
  }
});
