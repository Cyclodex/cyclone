require('./version.service.js');

// Version display component
// <version-display></version-display>
angular.module('cycloneApp').component('versionDisplay', {
  template: require('./version.tpl.html'),
  controller: ['versionService', function versionCtrl(versionService) {
      var $ctrl = this;

      $ctrl.version = versionService.getVersion();
      $ctrl.changelogUrl = versionService.getChanglogUrl();
      $ctrl.issuesUrl = versionService.getIssuesUrl();
  }]
});
