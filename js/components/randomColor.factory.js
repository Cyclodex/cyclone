// random color lib/function
angular.module('cycloneApp').factory("randomColor",
    function() {
        var randomColor = require('randomcolor'); // get randomcolor lib and provide function as randomColor()
        return randomColor;
    }
);