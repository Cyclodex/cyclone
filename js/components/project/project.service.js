function ProjectService(firebaseRef, $firebaseArray, $firebaseObject, AuthService){

    var user = AuthService.getUser();
    var ref = firebaseRef.getProjectReference(user);

    return {
        createNewProject: function (project) {
            // TODO: To set the entry on an defined key! (more useful here)
            // var result = ref.child('/' + project.name).set(project);
            //console.log(result); // Hmm this is a promise... and further logic breaks

            // The normal add will create a unique firebase ID
            return $firebaseArray(ref).$add(project);
        },
        getProjectById: function (id) {
            return $firebaseObject(ref.child(id));
        },
        getProjectList: function () {
            return $firebaseArray(ref);
        },
        updateProject: function (project) {
            return project.$save();
        },
        deleteProject: function (project) {
            return project.$remove();
        },
        // For the CRUD:
        // TODO: Maybe we could load the 'getProjectList' including the $loaded in here, to reference the array correctly.
        saveProject: function (project, projectFirebaseArray) {
            return projectFirebaseArray.$save(project);
        },
        removeProject: function (project, projectFirebaseArray) {
            return projectFirebaseArray.$remove(project);
        }
    };
}

angular
    .module('components.project')
    .factory('ProjectService', ProjectService);