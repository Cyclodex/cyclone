var profileDetail = {
    bindings: {
        feature: '<',
        onUpdate: '&'
    },
    template: require('./profile-detail.tpl.html'),
    controller: 'ProfileDetailController'
};

angular
    .module('components.profile')
    .component('profileDetail', profileDetail);
