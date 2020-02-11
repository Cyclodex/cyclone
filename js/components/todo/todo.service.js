function TodoService(firebaseRef, $firebaseArray, $firebaseObject, AuthService) {

    var user = AuthService.getUser();
    var ref = firebaseRef.getTodoReference(user);

    return {
        createNewTodo: function (todo) {
            // TODO: To set the entry on an defined key! (more useful here)
            // var result = ref.child('/' + todo.name).set(todo);
            //console.log(result); // Hmm this is a promise... and further logic breaks

            // The normal add will create a unique firebase ID
            return $firebaseArray(ref).$add(todo);
        },
        getTodoById: function (id) {
            return $firebaseObject(ref.child(id));
        },
        getTodoList: function () {
            return $firebaseArray(ref);
        },
        updateTodo: function (todo) {
            return todo.$save();
        },
        deleteTodo: function (todo) {
            return todo.$remove();
        },
        // For the CRUD:
        // TODO: Maybe we could load the 'getTodoList' including the $loaded in here, to reference the array correctly.
        saveTodo: function (todo, todoFirebaseArray) {
            return todoFirebaseArray.$save(todo);
        },
        removeTodo: function (todo, todoFirebaseArray) {
            return todoFirebaseArray.$remove(todo);
        }
    };
}

angular
    .module('components.todo')
    .factory('TodoService', TodoService);