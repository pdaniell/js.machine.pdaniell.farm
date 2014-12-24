(function() {

    /**
     * A utility class for classes and inheritance.
     *
     * @class ClassUtils
     * @memberof Machine
     *
     **/
    Machine.ClassUtils = function() {};

    /**
     * Extends a class by copying prototype methods.
     * @function
     * @static
     * @param {Object} childClass The child class.
     * @param {Object} parentClass The parent class.
     *
     */
    Machine.ClassUtils.extend = function(childClass, parentClass) {
        for (var key in parentClass.prototype) {
            if (!(key in childClass.prototype)) {
                childClass.prototype[key] = parentClass.prototype[key];
            }
        }

    };



})();