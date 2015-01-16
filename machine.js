'use strict';


/**
 *
 * The MIT License (MIT)
 *
 *   Copyright (c) 2014 Paul Daniell
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 * 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 *
 **/

var Machine = {}; 

(function() {

    Machine = {
        version: '1.0.0-alpha',
        author: 'Paul Daniell'
    };

    // Node 
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Machine;
        }
        exports.Machine = Machine;
    }

    // AMD/Require
    else if (typeof define === 'function' && define.amd) {
        define(function(require) {
            return Machine;
        });
    }


    // Browser Global
    else if (typeof window !== 'undefined') {
        window.Machine = Machine;
    }


    // Web Worker
    else if (typeof self !== 'undefined') {
        self.Machine = Machine;
    }



})();

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
            if(parentClass.prototype.hasOwnProperty(key)){
                if (!(childClass.prototype.hasOwnProperty(key))) {
                    childClass.prototype[key] = parentClass.prototype[key];
                }
            }
        }

        childClass.__super__ = parentClass.prototype;

    };



})();
/**
 * @license jahashtable, a JavaScript implementation of a hash table. It creates a single constructor function called
 * Hashtable in the global scope.
 *
 * http://www.timdown.co.uk/jshashtable/
 * Copyright 2013 Tim Down.
 * Version: 3.0
 * Build date: 17 July 2013
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


(function() {
    var Hashtable = (function(UNDEFINED) {
        var FUNCTION = "function",
            STRING = "string",
            UNDEF = "undefined";

        // Require Array.prototype.splice, Object.prototype.hasOwnProperty and encodeURIComponent. In environments not
        // having these (e.g. IE <= 5), we bail out now and leave Hashtable null.
        if (typeof encodeURIComponent == UNDEF ||
            Array.prototype.splice === UNDEFINED ||
            Object.prototype.hasOwnProperty === UNDEFINED) {
            return null;
        }

        function toStr(obj) {
            return (typeof obj == STRING) ? obj : "" + obj;
        }

        function hashObject(obj) {
            var hashCode;
            if (typeof obj == STRING) {
                return obj;
            } else if (typeof obj.hashCode == FUNCTION) {
                // Check the hashCode method really has returned a string
                hashCode = obj.hashCode();
                return (typeof hashCode == STRING) ? hashCode : hashObject(hashCode);
            } else {
                return toStr(obj);
            }
        }

        function merge(o1, o2) {
            for (var i in o2) {
                if (o2.hasOwnProperty(i)) {
                    o1[i] = o2[i];
                }
            }
        }

        function equals_fixedValueHasEquals(fixedValue, variableValue) {
            return fixedValue.equals(variableValue);
        }

        function equals_fixedValueNoEquals(fixedValue, variableValue) {
            return (typeof variableValue.equals == FUNCTION) ?
                variableValue.equals(fixedValue) : (fixedValue === variableValue);
        }

        function createKeyValCheck(kvStr) {
            return function(kv) {
                if (kv === null) {
                    throw new Error("null is not a valid " + kvStr);
                } else if (kv === UNDEFINED) {
                    throw new Error(kvStr + " must not be undefined");
                }
            };
        }

        var checkKey = createKeyValCheck("key"),
            checkValue = createKeyValCheck("value");

        /*----------------------------------------------------------------------------------------------------------------*/

        function Bucket(hash, firstKey, firstValue, equalityFunction) {
            this[0] = hash;
            this.entries = [];
            this.addEntry(firstKey, firstValue);

            if (equalityFunction !== null) {
                this.getEqualityFunction = function() {
                    return equalityFunction;
                };
            }
        }

        var EXISTENCE = 0,
            ENTRY = 1,
            ENTRY_INDEX_AND_VALUE = 2;

        function createBucketSearcher(mode) {
            return function(key) {
                var i = this.entries.length,
                    entry, equals = this.getEqualityFunction(key);
                while (i--) {
                    entry = this.entries[i];
                    if (equals(key, entry[0])) {
                        switch (mode) {
                            case EXISTENCE:
                                return true;
                            case ENTRY:
                                return entry;
                            case ENTRY_INDEX_AND_VALUE:
                                return [i, entry[1]];
                        }
                    }
                }
                return false;
            };
        }

        function createBucketLister(entryProperty) {
            return function(aggregatedArr) {
                var startIndex = aggregatedArr.length;
                for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
                    aggregatedArr[startIndex + i] = entries[i][entryProperty];
                }
            };
        }

        Bucket.prototype = {
            getEqualityFunction: function(searchValue) {
                return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
            },

            getEntryForKey: createBucketSearcher(ENTRY),

            getEntryAndIndexForKey: createBucketSearcher(ENTRY_INDEX_AND_VALUE),

            removeEntryForKey: function(key) {
                var result = this.getEntryAndIndexForKey(key);
                if (result) {
                    this.entries.splice(result[0], 1);
                    return result[1];
                }
                return null;
            },

            addEntry: function(key, value) {
                this.entries.push([key, value]);
            },

            keys: createBucketLister(0),

            values: createBucketLister(1),

            getEntries: function(destEntries) {
                var startIndex = destEntries.length;
                for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
                    // Clone the entry stored in the bucket before adding to array
                    destEntries[startIndex + i] = entries[i].slice(0);
                }
            },

            containsKey: createBucketSearcher(EXISTENCE),

            containsValue: function(value) {
                var entries = this.entries,
                    i = entries.length;
                while (i--) {
                    if (value === entries[i][1]) {
                        return true;
                    }
                }
                return false;
            }
        };

        /*----------------------------------------------------------------------------------------------------------------*/

        // Supporting functions for searching hashtable buckets

        function searchBuckets(buckets, hash) {
            var i = buckets.length,
                bucket;
            while (i--) {
                bucket = buckets[i];
                if (hash === bucket[0]) {
                    return i;
                }
            }
            return null;
        }

        function getBucketForHash(bucketsByHash, hash) {
            var bucket = bucketsByHash[hash];

            // Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
            return (bucket && (bucket instanceof Bucket)) ? bucket : null;
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        function Hashtable() {
            var buckets = [];
            var bucketsByHash = {};
            var properties = {
                replaceDuplicateKey: true,
                hashCode: hashObject,
                equals: null
            };

            var arg0 = arguments[0],
                arg1 = arguments[1];
            if (arg1 !== UNDEFINED) {
                properties.hashCode = arg0;
                properties.equals = arg1;
            } else if (arg0 !== UNDEFINED) {
                merge(properties, arg0);
            }

            var hashCode = properties.hashCode,
                equals = properties.equals;

            this.properties = properties;

            this.put = function(key, value) {
                checkKey(key);
                checkValue(value);
                var hash = hashCode(key),
                    bucket, bucketEntry, oldValue = null;

                // Check if a bucket exists for the bucket key
                bucket = getBucketForHash(bucketsByHash, hash);
                if (bucket) {
                    // Check this bucket to see if it already contains this key
                    bucketEntry = bucket.getEntryForKey(key);
                    if (bucketEntry) {
                        // This bucket entry is the current mapping of key to value, so replace the old value.
                        // Also, we optionally replace the key so that the latest key is stored.
                        if (properties.replaceDuplicateKey) {
                            bucketEntry[0] = key;
                        }
                        oldValue = bucketEntry[1];
                        bucketEntry[1] = value;
                    } else {
                        // The bucket does not contain an entry for this key, so add one
                        bucket.addEntry(key, value);
                    }
                } else {
                    // No bucket exists for the key, so create one and put our key/value mapping in
                    bucket = new Bucket(hash, key, value, equals);
                    buckets.push(bucket);
                    bucketsByHash[hash] = bucket;
                }
                return oldValue;
            };

            this.get = function(key) {
                checkKey(key);

                var hash = hashCode(key);

                // Check if a bucket exists for the bucket key
                var bucket = getBucketForHash(bucketsByHash, hash);
                if (bucket) {
                    // Check this bucket to see if it contains this key
                    var bucketEntry = bucket.getEntryForKey(key);
                    if (bucketEntry) {
                        // This bucket entry is the current mapping of key to value, so return the value.
                        return bucketEntry[1];
                    }
                }
                return null;
            };

            this.containsKey = function(key) {
                checkKey(key);
                var bucketKey = hashCode(key);

                // Check if a bucket exists for the bucket key
                var bucket = getBucketForHash(bucketsByHash, bucketKey);

                return bucket ? bucket.containsKey(key) : false;
            };

            this.containsValue = function(value) {
                checkValue(value);
                var i = buckets.length;
                while (i--) {
                    if (buckets[i].containsValue(value)) {
                        return true;
                    }
                }
                return false;
            };

            this.clear = function() {
                buckets.length = 0;
                bucketsByHash = {};
            };

            this.isEmpty = function() {
                return !buckets.length;
            };

            var createBucketAggregator = function(bucketFuncName) {
                return function() {
                    var aggregated = [],
                        i = buckets.length;
                    while (i--) {
                        buckets[i][bucketFuncName](aggregated);
                    }
                    return aggregated;
                };
            };

            this.keys = createBucketAggregator("keys");
            this.values = createBucketAggregator("values");
            this.entries = createBucketAggregator("getEntries");

            this.remove = function(key) {
                checkKey(key);

                var hash = hashCode(key),
                    bucketIndex, oldValue = null;

                // Check if a bucket exists for the bucket key
                var bucket = getBucketForHash(bucketsByHash, hash);

                if (bucket) {
                    // Remove entry from this bucket for this key
                    oldValue = bucket.removeEntryForKey(key);
                    if (oldValue !== null) {
                        // Entry was removed, so check if bucket is empty
                        if (bucket.entries.length == 0) {
                            // Bucket is empty, so remove it from the bucket collections
                            bucketIndex = searchBuckets(buckets, hash);
                            buckets.splice(bucketIndex, 1);
                            delete bucketsByHash[hash];
                        }
                    }
                }
                return oldValue;
            };

            this.size = function() {
                var total = 0,
                    i = buckets.length;
                while (i--) {
                    total += buckets[i].entries.length;
                }
                return total;
            };
        }

        Hashtable.prototype = {
            each: function(callback) {
                var entries = this.entries(),
                    i = entries.length,
                    entry;
                while (i--) {
                    entry = entries[i];
                    callback(entry[0], entry[1]);
                }
            },

            equals: function(hashtable) {
                var keys, key, val, count = this.size();
                if (count == hashtable.size()) {
                    keys = this.keys();
                    while (count--) {
                        key = keys[count];
                        val = hashtable.get(key);
                        if (val === null || val !== this.get(key)) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },

            putAll: function(hashtable, conflictCallback) {
                var entries = hashtable.entries();
                var entry, key, value, thisValue, i = entries.length;
                var hasConflictCallback = (typeof conflictCallback == FUNCTION);
                while (i--) {
                    entry = entries[i];
                    key = entry[0];
                    value = entry[1];

                    // Check for a conflict. The default behaviour is to overwrite the value for an existing key
                    if (hasConflictCallback && (thisValue = this.get(key))) {
                        value = conflictCallback(key, thisValue, value);
                    }
                    this.put(key, value);
                }
            },

            clone: function() {
                var clone = new Hashtable(this.properties);
                clone.putAll(this);
                return clone;
            }
        };

        Hashtable.prototype.toQueryString = function() {
            var entries = this.entries(),
                i = entries.length,
                entry;
            var parts = [];
            while (i--) {
                entry = entries[i];
                parts[i] = encodeURIComponent(toStr(entry[0])) + "=" + encodeURIComponent(toStr(entry[1]));
            }
            return parts.join("&");
        };

        return Hashtable;
    })();

    /**
     * @class
     * @constructor
     **/
    Machine.HashTable = Hashtable; 
})();

/**
 * Copyright 2013 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * HashSet
 *
 * This is a JavaScript implementation of HashSet, similar in concept to those found in Java or C#'s standard libraries.
 * It is distributed as part of jshashtable and depends on jshashtable.js. It creates a single constructor function
 * called HashSet in the global scope.
 *
 * Depends on: jshashtable.js
 * Author: Tim Down <tim@timdown.co.uk>
 * Version: 3.0
 * Build date: 17 July 2013
 * Website: http://www.timdown.co.uk/jshashtable/
 */
(function() {


    /**
     * @class
     * @constructor
     **/
    Machine.HashSet = function(param1, param2) {
        var hashTable = new Machine.HashTable(param1, param2);

        /** @method **/
        this.add = function(o) {
            hashTable.put(o, true);
        };

        /** @method **/
        this.addAll = function(arr) {
            for (var i = 0, len = arr.length; i < len; ++i) {
                hashTable.put(arr[i], true);
            }
        };

        /** @method **/
        this.values = function() {
            return hashTable.keys();
        };

        /** @method **/
        this.remove = function(o) {
            return hashTable.remove(o) ? o : null;
        };


        /** @method **/
        this.contains = function(o) {
            return hashTable.containsKey(o);
        };


        /** @method **/
        this.clear = function() {
            hashTable.clear();
        };


        /** @method **/
        this.size = function() {
            return hashTable.size();
        };

        /** @method **/
        this.isEmpty = function() {
            return hashTable.isEmpty();
        };

        /** @method **/
        this.clone = function() {
            var h = new HashSet(param1, param2);
            h.addAll(hashTable.keys());
            return h;
        };


        /** @method **/
        this.intersection = function(hashSet) {
            var intersection = new HashSet(param1, param2);
            var values = hashSet.values(),
                i = values.length,
                val;
            while (i--) {
                val = values[i];
                if (hashTable.containsKey(val)) {
                    intersection.add(val);
                }
            }
            return intersection;
        };

        /** @method **/
        this.union = function(hashSet) {
            var union = this.clone();
            var values = hashSet.values(),
                i = values.length,
                val;
            while (i--) {
                val = values[i];
                if (!hashTable.containsKey(val)) {
                    union.add(val);
                }
            }
            return union;
        };

        /** @method **/
        this.isSubsetOf = function(hashSet) {
            var values = hashTable.keys(),
                i = values.length;
            while (i--) {
                if (!hashSet.contains(values[i])) {
                    return false;
                }
            }
            return true;
        };

        /** @method **/
        this.complement = function(hashSet) {
            var complement = new HashSet(param1, param2);
            var values = this.values(),
                i = values.length,
                val;
            while (i--) {
                val = values[i];
                if (!hashSet.contains(val)) {
                    complement.add(val);
                }
            }
            return complement;
        };
    }


})();

(function() {

    /**
     * A utility class with static color codes. 
     * 
     * @class ANSI
     * @memberof Machine
     *
     **/
    Machine.ANSI = function() {};


    /** @static */
    Machine.ANSI.ANSI_RESET = "\u001B[0m";

    /** @static */
    Machine.ANSI.ANSI_BLACK = "\u001B[30m";


    /** @static */
    Machine.ANSI.ANSI_LIGHT_GRAY= "\u001B[37m";

    /** @static */
    Machine.ANSI.ANSI_DARK_GRAY= "\u001B[90m";

    
    /** @static */
    Machine.ANSI.ANSI_RED = "\u001B[31m";

    /** @static */
    Machine.ANSI.ANSI_GREEN = "\u001B[32m";

    /** @static */
    Machine.ANSI.ANSI_YELLOW = "\u001B[33m";

    /** @static */
    Machine.ANSI.ANSI_BLUE = "\u001B[34m";

    /** @static */
    Machine.ANSI.ANSI_PURPLE = "\u001B[35m";

    /** @static */
    Machine.ANSI.ANSI_CYAN = "\u001B[36m";

    /** @static */
    Machine.ANSI.ANSI_WHITE = "\u001B[37m";

    /** @static  */
    Machine.ANSI.ANSI_BOLD = "\u001B[1m"; 

    /** @static  */
    Machine.ANSI.ANSI_BOLD_RESET = "\u001B[21m"; 

    
    Machine.ANSI.ANSI_INVERT = "\u001B[7m"; 

    /** @static  */
    Machine.ANSI.ANSI_INVERT_RESET = "\u001B[27m"; 

    



    Machine.ANSI.colorize = function(input, color) { 

        var s = "" + color; 
        s  = s + input; 
        s  = s + Machine.ANSI.ANSI_RESET;
        return s; 
    }; 

    Machine.ANSI.embolden = function(input) { 
        return Machine.ANSI.ANSI_BOLD + 
                input + 
                Machine.ANSI.ANSI_BOLD_RESET; 

    }

     Machine.ANSI.invert = function(input) { 
        return Machine.ANSI.ANSI_INVERT + 
                input + 
                Machine.ANSI.ANSI_INVERT_RESET; 

    }

})(); 




(function() {

    /**
     * A utility class for manipulating strings.
     *
     * @class StringUtils
     * @memberof Machine
     *
     **/
    Machine.StringUtils = function() {};


    /**
     * Creates a text border of a given length and color.
     * @function
     * @static
     * @memberOf  Machine.StringUtils
     * @param {Number} length The length of a border.
     * @param {String} color An ANSI Color {@link Machine.ANSI}
     * @return {String}   The border string.
     */
    Machine.StringUtils.border = function(length, color) {
        var s = "";
        for (var i = 0; i < length; i++) {
            s += "*"
        }
        return Machine.ANSI.colorize(s + "\n", color);
    };


    /**
     * A replace at index psoition utility function.
     * @function
     * @static
     * @param {String} str The string to modify
     * @param {Number} index  The position to modify
     * @param {String} character The replacement character
     *
     */
    Machine.StringUtils.replaceAt = function(str, index, character) {
        return str.substr(0, index) + character + str.substr(index + character.length);
    }


    /**
     * Replaces the empty string of length zero with an epsilon character
     * of length 1. Useful for debug output. 
     * 
     * @function
     * @static
     * @param {String} ch The input character
     * @return {String} The input character or epsilon if the string is empty
     **/
    Machine.StringUtils.transformEpsilon = function(ch) {
        if (ch == Machine.Alphabet.EPSILON_STRING) {
            return "ε"
        } else {
           return ch; 
        }

    }

})();
(function() {


    /**
     * An alphabet for a machine.
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration literal.
     * @param {String} [attribs.chars] A string containing all the characters in the alphabet
     * @param {String} [attribs.blank=" "] The blank character
     * @param {Boolean} [attribs.unrestricted=false] A flag which lets all characters to be used in the alphabet. A blank character must still be specified but the chars property will be ignored. 
     * @param {Boolean} [attribs.allowsEpsilon=true] Allows the epsilon string (i.e. the empty string) as a valid member of the alphabet.
     **/
    Machine.Alphabet = function(attribs) {
        this._init(attribs);
    }

    Machine.Alphabet.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs && attribs.hasOwnProperty("unrestricted") && 
                    attribs.unrestricted == true){ 
                this.unrestricted = true; 
            } else { 
                this.unrestricted = false;
            }

            if(attribs && attribs.hasOwnProperty("blank")){
                
                if (attribs.blank.length != 1) {
                    throw new Error("Blank character must have length 1");
                }

                this.blank = attribs.blank;
            }  else { 
                this.blank = " "; 
            }

            if(attribs && attribs.hasOwnProperty("allowsEpsilon")) {
                this.allowsEpsilon = attribs.allowsEpsilon; 
            } else { 
                this.allowsEpsilon = true; 
            }

            if(attribs && attribs.hasOwnProperty("chars")){
                this._setAlphabet(attribs.chars);
            }
        },

        _setAlphabet: function(chars) {
            this.alphabetSet = new Machine.HashSet(); 

            for (var i = 0; i < chars.length; i++) {
                var character = chars.charAt(i);
                this.alphabetSet.add(character);
            }

            this.alphabetSet.add(this.blank);

        },


        // Public Methods 

        /** 
         * Returns the value of the allowsEpsilon property. 
         * @returns {Boolean} True if the allowsEpsilon property is set. 
         */
         getAllowsEpsilon: function() { 
            return this.allowsEpsilon; 
         }, 

         /**
          * Sets the allowsEpsilon property. 
          * @param {Boolean} allowsEpsilon The value of the allows epsilon value. 
          * 
          */
         setAllowsEpsilon: function(allowsEpsilon){
            this.allowsEpsilon = allowsEpsilon; 
         },

        /**
         * A method to verify whether the argument character is within 
         * the alphabet. If the <pre><code>unrestricted</code></pre> property is 
         * set, the method does nothing more than check that the input is
         * a single character (or the epsilon string is permiited. )
         * 
         * @method 
         * @param {String} character A string of length 1. 
         * @return {Boolean} True if accep.
        **/
        contains: function(character) {

            if(this.unrestricted == true){
                if (character.length == 1 || (this.getAllowsEpsilon() == true && character == Machine.Alphabet.EPSILON_STRING) ){
                    return true; 
                } else {
                    return false; 
                }

            }

            if (this.alphabetSet.contains(character) || 
                (this.getAllowsEpsilon()== true && character == Machine.Alphabet.EPSILON_STRING)){
                return true;
            }

            return false;
                
        },

        /** 
         * A method to test for stiring compatibility with the alphabet.
         * 
         * @method 
         * @param {String} s A candidate string to test for compatibility.
         * @return {Boolean} True if compatible.
         **/
        isCompatibleWith: function(s){
            for (var i = 0; i < s.length; i++){
                if(this.contains(s.charAt(i)) == false){    
                    return false;                
                }
            }
            return true;

        },

        /**
         * Returns the blank character.
         * @method 
         * 
         * 
         * @return {String} The blank character
         */
        getBlank: function() {
            return this.blank;

        },

        /**
         * Sets the blank character.
         * @method
         * @param {String} blank A character.
         */
        setBlank: function(blank){ 
            this.blank = blank; 
            this.addCharacter(this.blank); 
        },


        /**
         * Adds a character to the alphabet. 
         * @method
         * @param {String} character The character to add.
         */
        addCharacter: function(character){
            this.alphabetSet.add(character);
        }, 


        /**
         * Removes a character from the alphabet. 
         * @method
         * @param  {character} character The character to remove
         */
        removeCharacter: function(character){
            this.alphabetSet.remove(character);
        }

    };

    /**
     * A constant to represent the empty string character. 
     *  
     * @const 
     * 
     * @memberOf Machine.Alphabet
     */
    Machine.Alphabet.EPSILON_STRING = ""; 

    /**
     * A binary notation with characters '0' and '1'. The blank character is '0'.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.TALLY_NOTATION = new Machine.Alphabet({blank:"0", chars:"01", allowsEpsilon: false}); 

    /**
     * An unrestricted alphabet where any character can be used. The blank character
     * is the space character. This alphabet allows for using the epsilong string.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.UNRESTRICTED = new Machine.Alphabet({blank: " ", unrestricted:true, allowsEpsilon:true});


    /**
     * An unrestricted alphabet where any character can be used. The blank character
     * is the space character. This alphabet alphabet does not permit use of the epsilon string.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.UNRESTRICTED_NOEPSILON = new Machine.Alphabet({blank: " ", unrestricted:true, allowsEpsilon:false});



})();

(function() {

    /**
     *
     * This abstract class is a base class for common machine methods. This class
     * shouldn't be constructed. 
     *
     *
     * @class BaseMachine
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet.
     **/
    Machine.BaseMachine = function(attribs) {
        this._init(attribs);
    };



    Machine.BaseMachine.prototype = {

        //Private Methods
        _init: function(attribs) {

            if (attribs && attribs.hasOwnProperty("alphabet")) {
                this.setAlphabet(attribs.alphabet);
            } else {
                this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            // Create an empty state table
            // We'll add to it later
            this.stateTable = new Machine.StateTable();

            // The starting state
            this.initialState = null;


            // The current state of te machine. Since the state table
            // is empty this has to be null
            this.currentState = null;

            // The indicator that either the DFA has processed the last
            // cell of its input and it is in a control (i.e. non-accepting state)
            // or the DFA had remaining input for which there was no suitable
            // transition condition. 
            this.isHalted = false;


            // Step counter: we haven't done anything yet so set 
            // the step count to 0
            this.stepCount = 0;

            // Now we initialize the Transition Function. 
            this.transitionFunction = new Machine.TransitionFunction({
                alphabet: this.getAlphabet(),
                stateTable: this.getStateTable()
            });

            // Here we add some event listeners objects
            this.onAddState = function(state){};  
            this.onRemoveState = function(state){}; 
            this.onAddTransition = function(condition, command){}; 
            this.onRemoveTransition = function(condition){}; 
            this.onStep = function(condition, command, stepCount){};
            this.onHalt = function(state, stepCount){}; 


        },


        //Public Methods

        /**
         * Retrieves the alphabet for this machine. Typically, this alphabet 
         * is for the input language.
         * @method
         * @return {Machine.Alphabet} The alphabet
         */
        getAlphabet: function() {
            return this.alphabet;
        },

        /**
         * Sets the alphabet for the machine. Typically, this alphabet is
         * for the input language.
         * Beware: there are no internal 
         * consistency checks for replacing a state table in situ. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet.
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /**
         * Retrieves the state table. 
         * @method 
         * @return {Machine.StateTable} The state table.
         * 
         */
        getStateTable: function(){
            return this.stateTable; 
        },

        /**
         * Sets the state table. Using this method
         * is not recommended since there are no internal
         * checks for consistency. 
         * @method
         * @param {Machine.StateTable} stateTable The state table. 
         */
        setStateTable: function(stateTable){ 
            this.stateTable = stateTable;
        }, 


        /**
         * Retrieves the transition function.
         * @method 
         * @return {Machine.TransitionFunction} The transition function.
         * 
         */
        getTransitionFunction: function(){
            return this.transitionFunction;  
        },

        /**
         * Sets the transition function. Using this method
         * is not recommended since there are no internal
         * checks for consistency. 
         * @method
         * @param {Machine.TransitionFunction} transitionFunction The transition function.
         */
        setTransitionFunction: function(transitionFunction){ 
            this.transitionFunction = transitionFunction; 
        }, 


        /** 
         * Retrieves the initial state. 
         * @method 
         * @return {Machine.State} The initial state.
         */
        getInitialState: function() {
            return this.initialState;
        },

        /**
         * Sets the initial state. If the current state is set 
         * @method
         * @param {Machine.State} initialState The initial state.
         */
        setInitialState: function(initialState) {
            if (this.stateTable.contains(initialState) == false) {
                throw new Error("Initial State is not in State Table");
            }

            this.initialState = initialState;
            if(this.getCurrentState() == null) { 
                this.setCurrentState(initialState); 
            }

        },


        /**
         * Sets the initial state with a label. 
         * @method 
         * @param {String} initialStateLabel The initial state.
         */
        setInitialStateByLabel: function(initialStateLabel) {
            var state = this.stateTable.getStateByLabel(initialStateLabel); 
            this.setInitialState(state); 
        },


        /** 
         * Returns the current state. 
         * @method
         * 
         * @return {Machine.State} The current state.
         */
        getCurrentState: function(){  
            return this.currentState; 
        }, 

        /**
         * Sets the current state.
         * @method
         * @param {Machine.State} currentState The new current state.
         */
         setCurrentState: function(currentState){
            if (this.stateTable.contains(currentState) == false) {
                throw new Error("Initial State is not in State Table");
            }

            this.currentState = currentState;   
         }, 

        /**
         * Sets the current state label.
         * @method
         * @param {Machine.State} currentStateLabel The new current state.
         */
         setCurrentStateByLabel: function(currentStateLabel){
            var state = this.stateTable.getStateByLabel(currentStateLabel); 
            this.setCurrentState(state); 
         }, 


        /**
         * Returns whether the machine is in a halting state. 
         * @method 
         * @return {Boolean} True if in halted state.
         */
         getIsHalted: function()  {
            return this.isHalted; 
         }, 


         /**
          * Sets the value of the halted state of the machine.
          * @method
          * @param {Boolean} isHalted The new halted state.
          * 
          */
         setIsHalted: function(isHalted){
            this.isHalted = isHalted;
         },


         /**
          * Returns the step counter.
          * @method 
          * @return {Number} The step count.
          * 
          */
         getStepCount: function(){
            return this.stepCount;
         }, 

         /**
          * Sets the step count
          * @method
          * @param {Number} stepCount The step count.
          */
         setStepCount: function(stepCount){
            this.stepCount = stepCount;
         },

        /**
         * Adds a state to the machine using primitives.  
         * @method  
         * @param {String}  stateLabel  The name of the state
         * @param {Boolean} isAccepting Whether of not the state is an accepting state.
         */
        addStateByLabel: function(stateLabel, isAccepting) {
            var state = new Machine.State({label:stateLabel, isAccepting:isAccepting}); 
            this.addState(state); 
        },


        /**
         * Adds a non-accepting (control) state to the machine using primitives. 
         * @method
         * @param {String}  stateLabel  The name of the state
         */
        addControlStateByLabel: function(stateLabel) {
            var state = new Machine.State({label:stateLabel, isAccepting:false}); 
            this.addState(state); 
        },


        /**
         * Adds a state using a state object.
         * @method
         * @param {Machine.State}  state  The state object
         */
        addState: function(state) {
            this.stateTable.add(state);
            this.onAddState.call(state); 
        },


        /**
         * Remove state by label. 
         * @method
         * @param {String} stateLabel The name for the label
         */
        removeStateByLabel:function(stateLabel) { 

            var state = this.stateTable.getStateByLabel(stateLabel); 
            // - ---------------TODO ------------------------------
            //  We have to remove the state but also associate transitions
            //
            this.onRemoveState.call(state); 
        }, 

        
        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            this.setCurrentState(this.getInitialState());
            this.setStepCount(0);
            this.setIsHalted(false); 
        },


        /**
         * Adds a transition
         * @method 
         * @param {Machine.Condition} condition The transition condition
         * @param {Machine.command} command The transition command
         */
        addTransition: function(condition, command){
            this.getTransitionFunction().add(condition, command); 
            this.onAddTransition.call(condition,command); 
        }, 


        /**
         * Removes a transition. 
         * @method 
         * @param {Machine.Condition} [varname] [description]
         * 
         */
        removeTransition:function(condition){
            this.getTransitionFunction.removeTransitionByCondition(condition); 
            this.onRemoveTransition.call(condiiton); 
        },



    };



})();
(function() {


    /**
     * A class which usually encapsulates which state a machine is in
     * and which character it is reading in on the input tape. 
     * 
     * @class Condition
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.State} attribs.state The state the machine is in.
     * @param {String} attribs.character The character the machine is reading.
     *
     **/
    Machine.Condition = function(attribs) {
        this._init(attribs);
    };


    Machine.Condition.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs.state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.state = attribs.state;
            this.character = attribs.character;

            if(attribs.hasOwnProperty("stackElement")) { 
                this.stackElement = attribs.stackElement; 
            } else { 
                this.stackElement = null; 
            }

        },

        // Public Methods
        
        /**
         * Retrieves the stack element
         * @method
         * @return {String} The stack element
         */
        getStackElement: function() {
            return this.stackElement;
        },

        /**
         * Sets the stack element
         * @method
         * @param {String} stackElement The stack element
         */
        setStackElement: function(stackElement){
            this.stackElement = stackElement; 
        }, 

        /**
         * Returns whether the condition has a stack element. 
         * @method
         * @returns {Boolean} True if the condition has a stack element. 
         */
        hasStackElement: function(){
            if(this.stackElement == null){
                return false; 
            }

            return true; 

        },

        /**
         * Retrieves the condition state. 
         * @method
         * @return {Machine.State} The condition state.
         */
        getState: function() {
            return this.state;
        },

        /**
         * Sets the condition state.
         * @method
         * @param {Machine.State} state The condition state.
         */
        setState: function(state){
            if(state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.state = state; 
        }, 

        /**
         * Retrieves the condition character.
         * @method
         * @return {String} The condition character.
         */ 
        getCharacter: function() {
            return this.character;
        },

        /**
         * Sets the condition character.
         * @method
         * @param {String} character The condition character.
         */
        setCharacter: function(character){
            this.character = character; 
        }, 

        /**
         * Returns a human readable string of the condition.
         * @method
         * @returns {String} The human readable string.
         */
        characterDisplay: function(){

            var e = Machine.StringUtils.transformEpsilon; 

            if(this.hasStackElement()){
                return this.getState().getLabel() + "," + e(this.getCharacter()) + "," + e(this.getStackElement()); 
            } else { 
                 return this.getState().getLabel() + "," + e(this.getCharacter()); 
            }

        }

    };



})();
(function() {


    /**
     * This class encapsulates the information for what a machine should
     * do when it is in a particular machine condition. The parameters
     * of the command are machine dependent and different types of machines
     * should be expected to have different kinds of commands.
     *
     * @class Command
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.State} attribs.state The state a machine should be in after executing the command
     * @param {Object} [attribs.action] The action the machine should execute. It should be a member of {@link Machine.Command.CommandSet}.
     * @param {String} [attribs.argument] A parameter for the action. Usually this is a character associatied with the {@link Machine.Command.WRITE} action.
     *
     **/
    Machine.Command = function(attribs) {
        this._init(attribs);
    };



    Machine.Command.prototype = {

        // Private Methods
        _init: function(attribs) {

            if (attribs.state instanceof Machine.State == false) {
                throw new Error("attribs.state not of type Machine.State");
            }


            this.state = attribs.state;

            if (attribs.hasOwnProperty("action") &&
                Machine.Command.isValidAction(attribs.action)) {
                this.action = attribs.action;
            } else {
                this.action = null;
            }

            if (attribs.hasOwnProperty("argument")) {
                this.argument = attribs.argument;
            } else {
                this.argument = null;
            }

        },


        // Public Methods

        /**
         * Returns the command state.
         * @method
         * @return {Machine.State} The state to go to after the command has been executed.
         */
        getState: function() {
            return this.state;
        },

        /**
         * Sets the command state.
         * @method
         * @param {Machine.State} state The command state.
         */
        setState: function(state) {

            if (state instanceof Machine.State == false) {
                throw new Error("attribs.state not of type Machine.State");
            }
            this.state = state;
        },

        /**
         * Checks whether this command has an action.
         * @method
         * @return {Boolean} True if the command has an action.
         */
        hasAction: function() {
            if (this.action == null) {
                return false;
            }
            return true;
        },

        /**
         * Retrieves the action of the command.
         * @method
         * @return {Object} The command action or null.
         */
        getAction: function() {
            return this.action;
        },

        /**
         * Sets the action of the command.
         * @method
         * @param {Object} action The command action.
         */
        setAction: function(action) {
            if (Machine.Command.isValidAction(action) == true) {
                this.action = action;
            }
        },

        /**
         * Removes the command action.
         * @method
         */
        removeAction: function() {
            this.action = null;
        },

        /**
         * Checks whether this command has an action argument.
         * @method
         * @return {Boolean} True if argument is present.
         */
        hasArgument: function() {
            if (this.argument == null) {
                return false;
            }
            return true;
        },

        /**
         * Retrieves the action argument
         * @method
         * @return {String} The action argument.
         */
        getArgument: function() {
            return this.argument;
        },

        /**
         * Sets the action argument.
         * @method
         * @param {String} argument The argument, a character usualy.
         */
        setArgument: function(argument) {
            this.argument = argument;
        },

        /**
         * Removes the action argument.
         * @method
         */
        removeArgument: function() {
            this.argument = null;
        },

        /**
         * Returns a human readable string representing the command.
         * @method
         * @returns {String} The human readable string.
         */
        characterDisplay: function() {
            if (this.hasAction() == true && this.hasArgument() == true) {

                var ch = "";
                if (this.getArgument() == Machine.Alphabet.EPSILON_STRING) {
                    ch = "ε"
                } else {
                    ch = this.getArgument();
                }

                return this.getState().getLabel() + "," +
                 Machine.Command.getActionCode(this.getAction()) + "," + ch;

            } else if (this.hasAction() == true && this.hasArgument() == false) {
                
                return this.getState().getLabel() + "," + 
                Machine.Command.getActionCode(this.getAction());

            } else if (this.hasAction() == false && this.hasArgument() == false) {
                
                return this.getState().getLabel();

            } else {
                throw new Error("Invalid commmand: argument with unspecified action.");

            }
        }

    };



    var MOVE_RIGHT =

        /** 
         * The machine action to move right on a tape.
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.MOVE_RIGHT = "0";

    var MOVE_LEFT =

        /**
         * The machine action to move left on a tape.
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.MOVE_LEFT = "1";

    var ERASE =

        /**
         * The machine action to erase the current cell on the tape.
         * @costant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.ERASE = "3";

    var WRITE =

        /**
         * The machine action to write a character to the cell on the tape.
         * (Usually requires an argument.)
         * @constant
         * @static
         * @type {Object}
         * @memberOf Machine.Command
         */
        Machine.Command.WRITE = "4";


    var NOOP =

        /**
         * The machine action to do nothing
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.NOOP = "5";

    var STACK_CHANGE = 


        /**
         * The machien action to push an element on a stack. 
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.STACK_CHANGE = "6"; 


    /**
     * The hashset whih contains all the official machine actions.
     * @constant
     * @static
     * @type {Machine.HashTable}
     * @memberOf  Machine.Command
     */
    Machine.Command.ACTION_MAP = new Machine.HashTable();
    Machine.Command.ACTION_MAP.put(Machine.Command.MOVE_RIGHT, "R");
    Machine.Command.ACTION_MAP.put(Machine.Command.MOVE_LEFT, "L");
    Machine.Command.ACTION_MAP.put(Machine.Command.ERASE, "Er");
    Machine.Command.ACTION_MAP.put(Machine.Command.WRITE, "Wr");
    Machine.Command.ACTION_MAP.put(Machine.Command.NOOP, "Np");
    Machine.Command.ACTION_MAP.put(Machine.Command.STACK_CHANGE, "St");


    /**
     * The hashset which contains long descriptions of machines as actions.
     * @static
     * @type {Machine.HashTable}
     * @memberOf  Machine.Command
     */
    Machine.Command.DESCRIPTION_MAP = new Machine.HashTable();
    Machine.Command.DESCRIPTION_MAP.put("RIGHT", Machine.Command.MOVE_RIGHT);
    Machine.Command.DESCRIPTION_MAP.put("LEFT", Machine.Command.MOVE_LEFT);
    Machine.Command.DESCRIPTION_MAP.put("ERASE", Machine.Command.ERASE);
    Machine.Command.DESCRIPTION_MAP.put("WRITE", Machine.Command.WRITE);
    Machine.Command.DESCRIPTION_MAP.put("NOOP", Machine.Command.NOOP);
    Machine.Command.DESCRIPTION_MAP.put("STACKCHANGE", Machine.Command.STACK_CHANGE);

    /**
     * A static method which returns an action from a description.
     * 
     * @method
     * @static
     * @memberOf  Machine.Command
     * @param {String} @description The description of the action
     */
    Machine.Command.getActionFromDescription = function(descr) {
        if(Machine.Command.DESCRIPTION_MAP.containsKey(descr.trim().toUpperCase()) == false){
            throw new Error("Invalid action description key:" + descr); 
        }

        return Machine.Command.DESCRIPTION_MAP.get(descr.trim().toUpperCase());
    };




    /** 
     * A static method which assesses whether an object is a valid action.
     * @method
     * @static
     *  @memberof Machine.Command
     **/
    Machine.Command.isValidAction = function(command) {
        return Machine.Command.ACTION_MAP.containsKey(command);
    };


    /**
     * A static method which returns a short description code for a
     * machine action.
     * @method
     * @static
     * @memberOf  Machine.Command
     */
    Machine.Command.getActionCode = function(command) {
        if (Machine.Command.isValidAction(command) == false) {
            throw new Error("Invalid action");
        }

        return Machine.Command.ACTION_MAP.get(command);

    };


})();
(function() {

    /**
     *
     * This class represents a Deterministic Finite  Automaton (DFA). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Deterministic_finite_automaton}
     * and also suggestions for further reading.
     *
     *
     * @class DFA
     * @constructor
     * @memberof Machine
     * @augments {Machine.BaseMachine}
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet.    
     * @param {Boolean} [attribs.allowEpsilonTransitions=false] Permit epsilon transitions 
     **/
    Machine.DFA = function(attribs) {
        this._init(attribs);
    };



    Machine.DFA.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs){
                Machine.BaseMachine.prototype._init.call(this, attribs); 
            } else {
                Machine.BaseMachine.prototype._init.call(this); 
            }


            if(attribs && attribs.hasOwnProperty("allowEpsilonTransitions")){
                this.setAllowEpsilonTransitions(attribs.allowEpsilonTransitions); 
            } else { 
                this.setAllowEpsilonTransitions(true); 
            }


            // The indicator that the DFA has processed its last cell of 
            // input and it is in an accepting state
            this.isAccepted = false; 


            // Now iniitialize the tape. 
            this.tape = new Machine.Tape({
                alphabet: this.getAlphabet(), 
                chars: ""
            });

            // There is only one pointer on a DFA tape
            // We initialize it here at posiiton 0
            this.pointerPosition = 0; 

            //Some custom listener functions for DFA class
            this.onAccept = function(state, stepCount, indexPointer){}; 
            this.onReject = function(state, stepCount, indexPointer){};
            this.onPointerChange = function(position){};  

        },

        //Public Methods

        /**
         * Retrives whether or not this machine allows epsilon  
         * transitions. 
         * @returns {Boolean} True if epsilon transitions allowed
         */
        
        getAllowEpsilonTransitions: function() { 
            return this.allowEpsilonTransitions; 
        }, 

        /**
         * Sets whether or not this machine allows epsilon transitions. 
         * @param {Boolean} allowEpsilonTransitions True if epsilon transitions allowed.
         */
        setAllowEpsilonTransitions: function(allowEpsilonTransitions){

            this.allowEpsilonTransitions = allowEpsilonTransitions; 
        }, 


        /**
         * Returns whether the DFA is in an accepting state. 
         * @method 
         * @return {Boolean} True if in accepted state.
         */
         getIsAccepted: function()  {
            return this.isAccepted; 
         }, 


         /**
          * Sets the value of the accepted state of the DFA.
          * @method
          * @param {Boolean} isAccepted The new accepted state.
          * 
          */
         setIsAccepted: function(isAccepted){
            this.isAccepted = isAccepted;
         },


         /**
          * Returns the tape pointer position. 
          * @method 
          * @return {Number} The pointer position.
          * 
          */
         getPointerPosition: function(){
            return this.pointerPosition;
         }, 

         /**
          * Sets the pointer position. 
          * @method
          * @param {Number} pointerPosition The pointer position.
          */
         setPointerPosition: function(pointerPosition){
            this.pointerPosition = pointerPosition; 
            this.onPointerChange.call(this.pointerPosition);
         },


         /**
          * Returns the tape object. 
          * @method
          * @return {Machine.Tape} The input tape.
          */
         getTape: function() { 
            return this.tape;
         }, 


         /** 
          * Sets the tape object. Beware when using this 
          * method, there are no checks of internal consistency
          * with other aspects of the DFA. 
          * 
          * @method
          * @param {Machine.Tape} tape The tape
          */
         setTape: function(tape){
            this.tape = tape; 
         }, 

         /**
          * Sets the input string on the tape for the DFA and
          * sends the pointer back to the beginning of th string.
          * 
          * @method
          * @param {String} input The input string
          * 
          */
         setInputString: function(input) { 
                this.getTape().setChars(input);
                this.setPointerPosition(0); 

         },

        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            Machine.BaseMachine.prototype.reset.call(this); 
            this.setPointerPosition(0);
            this.setIsAccepted(false); 
        },




        /** 
         * Adds a transition.
         * @method
         * @param {Mahine.State} conditionState The condition state.
         * @param {String} conditionCharacter The condition character.
         * @param {Machine.State} transitionState  The state to transition to.
         */
        addTransitionByStatesAndCharacter: function(conditionState, currentCharacter, transitionState){

            if(this.getAllowEpsilonTransitions() == false && currentCharacter == Machine.Alphabet.EPSILON_STRING){ 
                throw new Error("Epsilon transitions not permitted in this machine"); 
            }


            var condition = new Machine.Condition({
                state: conditionState,
                character:currentCharacter
            }); 

            var command = new Machine.Command({state:transitionState});
            this.addTransition(condition,command); 
        }, 

        /** 
         * Adds a transition by state label.
         * @method
         * @param {String} conditionStateLabel The condition state label.
         * @param {String} conditionCharacter The condition character.
         * @param {String} transitionStateLabel  The state label to transition to.
         */
        addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, transitionStateLabel){
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel); 
            var transitionState = this.getStateTable().getStateByLabel(transitionStateLabel); 
            this.addTransitionByStatesAndCharacter(conditionState, currentCharacter, transitionState); 
        }, 


        /**
         * Removes a transition by label and character
         * @method 
         * @param {String} conditionStateLabel The condition state label
         * @param {String} conditionCharacter The condition character
         */
        removeTransitionByStateLabelsAndCharacter: function(conditionStateLabel, conditionCharacter){ 
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel); 
            var condition = new Machine.Condition({state:condiitonState, 
                character:conditionCharacter}); 
            this.removeTrandition(condition);
        }, 



        /**
         * Checks to see if the machine should halt and configures the machine
         * accordingly. 
         * 
         * @method
         * @return {Boolean} True if the machine has halted
         */
        halt: function(){ 
            if(this.getPointerPosition() >= this.getTape().length() && this.getTransitionFunction().hasEpsilonTransition(this.getCurrentState()) == false ){
                
                this.setIsHalted(true); 
                // We have run out of characters to read
                // Are we in an accepting state?
                if(this.getCurrentState().getIsAccepting() == true){
                    this.setIsAccepted(true);
                    this.onAccept.call(this.getCurrentState(),this.getStepCount(), this.getPointerPosition());
                } else {
                    this.setIsAccepted(false); 
                    this.onReject.call(this.getCurrentState(),this.getStepCount(), this.getPointerPosition());

                }

                this.onHalt.call(this.getCurrentState(),this.getStepCount(), this.getPointerPosition());
                return true; 
            }

            return false; 


        },

        /** 
         * Executes one step of the DFA. 
         * @method
         * @return {Boolean} True if halted
         */
        step: function() { 
            if(this.getIsHalted() == true)  {
                //The DFA is halted so there is nothing do so, so return. 
                return true; 

            }

            // Increment the stepCount
            this.setStepCount(this.getStepCount() + 1); 
            var currentState = this.getCurrentState(); 

            if(this.halt() == true){
                return true; 
            }


            var currentCharacter = null; 
            var condition = null; 



            if (this.getTransitionFunction().hasEpsilonTransition(currentState)) {
                //take the epsilon transition

                currentCharacter = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);


            } else {
                currentCharacter = this.getTape().charAt(this.getPointerPosition());  


                condition = new Machine.Condition (
                {
                    state: currentState, 
                    character: currentCharacter
                }); 
            }

            var command = this.getTransitionFunction().getCommand(condition); 

            if(command == null){ 
                // There was no transition for the appropriate condition
                // so we have to halt and reject.
                this.setIsHalted(true); 
                this.setIsAccepted(false); 
                this.onReject.call(currentState,this.getStepCount(), this.getPointerPosition());
                this.onHalt.call(currentState,this.getStepCount(), this.getPointerPosition());
                return true; 
            }


            // Now we come to the nondegenerate case

            // Increment the pointer position as long as we are not reading an epsilon string
            if(currentCharacter != Machine.Alphabet.EPSILON_STRING){
                this.setPointerPosition(this.getPointerPosition() + 1); 
            }

            // Change the state
            this.setCurrentState(command.getState()); 

            // Fire the event
            this.onStep.call(condition, command, this.getStepCount(), this.getPointerPosition());


            // Check again for halting conditions

            if(this.halt() == true){
                return true; 
            }


            return false; 

        }, 


        /**
         * Runs the DFA with a specified maximum number of steps.
         * @method
         * @param {Number} maxSteps The maximum number of steps to execute
         * @returns {Boolean} True if the machine has halted
         */
        run: function(maxSteps){ 
            for(var i=0; i < maxSteps; i++){
                var returned = this.step(); 
                if(returned == true){
                    return true;                    
                }
            }

            return false; 
        }, 


        /**
         * Creates a human readable string describing the DFA. 
         * @method 
         * @return {String} The human readable string.
         */
        characterDisplay: function() { 
            var s = Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED); 

            s = s + Machine.ANSI.colorize(this.getTape().characterDisplay(this.getPointerPosition()), 
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";

            s = s + Machine.ANSI.colorize(this.getStateTable().characterDisplay(this.getCurrentState().getLabel()), 
                Machine.ANSI.ANSI_BLUE);

            s = s + Machine.ANSI.colorize("#" + this.getStepCount() + " Halted: "  
                + Machine.ANSI.invert(this.getIsHalted()) + " Accepted: " 
                + Machine.ANSI.invert(this.getIsAccepted()) + "\n", Machine.ANSI.ANSI_LIGHT_GRAY);
          
            var currentState = this.getCurrentState(); 
            var character = null; 
            var condition = null; 

            if(this.getTransitionFunction().hasEpsilonTransition(currentState)){

                character = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);

            } else{

                character = this.getTape().charAt(this.getPointerPosition()); 
                condition = new Machine.Condition({state:currentState, character:character}); 
            }

            s = s + Machine.ANSI.colorize(this.getTransitionFunction().characterDisplay(condition), Machine.ANSI.ANSI_GREEN); 

            s = s +Machine.StringUtils.border((this.getTape().length() * 5)+ 10, Machine.ANSI.ANSI_RED); 




            return s; 

        }





    };

    Machine.ClassUtils.extend(Machine.DFA, Machine.BaseMachine); 



})();
(function() {

    /**
     *
     * This class represents a (Deterministic) Finite State Transducer(FST)). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Finite_state_transducer}
     * and also suggestions for further reading.
     *
     *
     * @class FST
     * @constructor
     * @memberof Machine
     * @augments {Machine.BaseMachine}
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The input alphabet.    
     * @param {Machine.Alphabet} [attribs.outputAlphabet={@link Machine.Alphabet.UNRESTRICTED}] The output alphabet.
     * @param {Boolean} [attribs.allowEpsilonTransitions=true] Permit epsilon transitions 
     **/
    Machine.FST = function(attribs) {
        this._init(attribs);
    };



    Machine.FST.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs){
                Machine.BaseMachine.prototype._init.call(this, attribs); 
            } else {
                Machine.BaseMachine.prototype._init.call(this); 
            }


            if (attribs && attribs.hasOwnProperty("outputAlphabet")) {
                this.setOutputAlphabet(attribs.outputAlphabet);
            } else {
                this.setOutputAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            if(attribs && attribs.hasOwnProperty("allowEpsilonTransitions")){
                this.setAllowEpsilonTransitions(attribs.allowEpsilonTransitions); 
            } else { 
                this.setAllowEpsilonTransitions(true); 
            }


            // The indicator that the FST has processed its last cell of 
            // input and it is in an accepting state
            this.isAccepted = false; 


            // Now iniitialize the input tape. 
            this.inputTape = new Machine.Tape({
                alphabet: this.getAlphabet(), 
                chars: ""
            });

            // Now initialize the output tape

            this.outputTape = new Machine.Tape({
                alphabet: this.getOutputAlphabet(), 
                chars: ""
            });

            // There are two pointers for a FST
            // We initialize ithe input pointer at posiiton 0
            this.inputPointerPosition = 0; 

            // And the output pointer
            this.outputPointerPosition = 0; 


            //Some custom listener functions for FST class
            this.onAccept = function(state, stepCount, indexPointer){}; 
            this.onReject = function(state, stepCount, indexPointer){};
            this.onInputPointerChange = function(position){};  
            this.onOutputPointerChange = function(position){};  

        },

        //Public Methods


        /**
         * Retrives whether or not this machine allows epsilon output 
         * transitions. 
         * @returns {Boolean} True if epsilon transitions allowed
         */
        
        getAllowEpsilonTransitions: function() { 
            return this.allowEpsilonTransitions; 
        }, 

        /**
         * Sets whether or not this machine allows epsilon transitions. 
         * @param {Boolean} allowEpsilonTransitions True if epsilon transitions allowed.
         */
        setAllowEpsilonTransitions: function(allowEpsilonTransitions){

            this.allowEpsilonTransitions = allowEpsilonTransitions; 
        }, 

        /**
         * Retrieves the output alphabet for this machine. 
         * @method
         * @return {Machine.Alphabet} The output alphabet
         */
        getOutputAlphabet: function() {
            return this.outputAlphabet;
        },

        /**
         * Sets the output alphabet for the machine. 
         * 
         * @method
         * @param {Machine.Alphabet} outputAlphabet The output alphabet.
         */
        setOutputAlphabet: function(outputAlphabet) {
            this.outputAlphabet = outputAlphabet;
        },


        
        /**
         * Returns whether the FST is in an accepting state. 
         * @method 
         * @return {Boolean} True if in accepted state.
         */
         getIsAccepted: function()  {
            return this.isAccepted; 
         }, 


         /**
          * Sets the value of the accepted state of the FST.
          * @method
          * @param {Boolean} isAccepted The new accepted state.
          * 
          */
         setIsAccepted: function(isAccepted){
            this.isAccepted = isAccepted;
         },


         /**
          * Returns the input tape pointer position. 
          * @method 
          * @return {Number} The pointer position.
          * 
          */
         getInputPointerPosition: function(){
            return this.inputPointerPosition;
         }, 

         /**
          * Sets the input pointer position. 
          * @method
          * @param {Number} inputPointerPosition The pointer position.
          */
         setInputPointerPosition: function(inputPointerPosition){
            this.inputPointerPosition = inputPointerPosition; 
            this.onInputPointerChange.call(this.inputPointerPosition);
         },

         /**
          * Returns the output tape pointer position. 
          * @method 
          * @return {Number} The pointer position.
          * 
          */
         getOutputPointerPosition: function(){
            return this.outputPointerPosition;
         }, 

         /**
          * Sets the output pointer position. 
          * @method
          * @param {Number} pointerPosition The pointer position.
          */
         setOutputPointerPosition: function(outputPointerPosition){
            this.outputPointerPosition = outputPointerPosition; 
            this.onOutputPointerChange.call(this.outputPointerPosition);
         },



         /**
          * Returns the input tape object. 
          * @method
          * @return {Machine.Tape} The input tape.
          */
         getInputTape: function() { 
            return this.inputTape;
         }, 


         /** 
          * Sets the input tape object. Beware when using this 
          * method, there are no checks of internal consistency
          * with other aspects of the FST. 
          * 
          * @method
          * @param {Machine.Tape} inputTape The tape
          */
         setInputTape: function(inputTape){
            this.inputTape = inputTape; 
         }, 

         /**
          * Returns the output tape object. 
          * @method
          * @return {Machine.Tape} The output tape.
          */
         getOutputTape: function() { 
            return this.outputTape;
         }, 


         /** 
          * Sets the output tape object. Beware when using this 
          * method, there are no checks of internal consistency
          * with other aspects of the FST. 
          * 
          * @method
          * @param {Machine.Tape} outputTape The tape
          */
         setOutputTape: function(outputTape){
            this.outputTape = outputTape; 
         }, 

         /**
          * Sets the input string on the tape for the FST and
          * sends the input pointer back to the beginning of the string.
          * 
          * @method
          * @param {String} input The input string
          * 
          */
         setInputString: function(input) { 
                this.getInputTape().setChars(input);
                this.setInputPointerPosition(0); 

         },


         /**
          * Sets the output string on the tape for the FST and
          * sends the output pointer back to the beginning of the string.
          * 
          * @method
          * @param {String} output The output string
          * 
          */
         setOutputString: function(output) { 
                this.getOutputTape().setChars(output);
                this.setInputPointerPosition(0); 

         },


        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            Machine.BaseMachine.prototype.reset.call(this); 
            this.setInputPointerPosition(0);
            this.setOutputString(""); 
            this.setOutputPointerPosition(0); 
            this.setIsAccepted(false); 
        },




        /** 
         * Adds a transition.
         * @method
         * @param {Mahine.State} conditionState The condition state.
         * @param {String} conditionCharacter The condition character.
         * @param {Machine.State} transitionState  The state to transition to.
         * @param {String} outputCharacter The output character.
         */
        addTransitionByStatesAndCharacter: function(conditionState, currentCharacter, transitionState, outputCharacter){

            if(outputCharacter == Machine.Alphabet.EPSILON_STRING && this.getAllowEpsilonTransitions() == false) { 
                throw new Error("Epsilon transitions not permitted for this machine"); 
            }

            var condition = new Machine.Condition({
                state: conditionState,
                character:currentCharacter
            }); 

            var command = new Machine.Command({state:transitionState, action: Machine.Command.WRITE, argument:outputCharacter});
            this.addTransition(condition,command); 
        }, 

        /** 
         * Adds a transition by state label.
         * @method
         * @param {String} conditionStateLabel The condition state label.
         * @param {String} conditionCharacter The condition character.
         * @param {String} transitionStateLabel  The state label to transition to.
         * @param {String} outputCharacter The output character.
         */
        addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, transitionStateLabel, outputCharacter){
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel); 
            var transitionState = this.getStateTable().getStateByLabel(transitionStateLabel); 
            this.addTransitionByStatesAndCharacter(conditionState, currentCharacter, transitionState, outputCharacter); 
        }, 


        /**
         * Removes a transition by label and character
         * @method 
         * @param {String} conditionStateLabel The condition state label
         * @param {String} conditionCharacter The condition character
         */
        removeTransitionByStateLabelsAndCharacter: function(conditionStateLabel, conditionCharacter){ 
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel); 
            var condition = new Machine.Condition({state:condiitonState, 
                character:conditionCharacter}); 
            this.removeTrandition(condition);
        }, 


        /**
         * Checks to see if the machine should halt and configures the machine
         * accordingly. 
         * 
         * @method
         * @return {Boolean} True if the machine has halted
         */
        halt: function(){ 
            var currentState = this.getCurrentState(); 


            if(this.getInputPointerPosition() >= this.getInputTape().length() && this.getTransitionFunction().hasEpsilonTransition(currentState) == false){
                
                this.setIsHalted(true); 
                // We have run out of characters to read
                // Are we in an accepting state?
                if(currentState.getIsAccepting() == true){
                    this.setIsAccepted(true);
                    this.onAccept.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                } else {
                    this.setIsAccepted(false); 
                    this.onReject.call(currentState,this.getStepCount(), this.getInputPointerPosition());

                }

                this.onHalt.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                return true; 
            }

        }, 


        /** 
         * Executes one step of the DFA. 
         * @method
         * @return {Boolean} True if halted
         */
        step: function() { 
            if(this.getIsHalted() == true)  {
                //The DFA is halted so there is nothing do so, so return. 
                return true; 

            }

            // Increment the stepCount
            this.setStepCount(this.getStepCount() + 1); 
            var currentState = this.getCurrentState(); 


            if(this.halt() == true){
                return true; 
            }


            var currentCharacter = null; 
            var condition = null; 

            if (this.getTransitionFunction().hasEpsilonTransition(currentState)) {
                //take the epsilon transition

                currentCharacter = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);


            } else {


                currentCharacter = this.getInputTape().charAt(this.getInputPointerPosition());  


                condition = new Machine.Condition (
                    {
                        state: currentState, 
                        character: currentCharacter
                    }); 


            }

            var command = this.getTransitionFunction().getCommand(condition); 

            if(command == null){ 
                // There was no transition for the appropriate condition
                // so we have to halt and reject.
                this.setIsHalted(true); 
                this.setIsAccepted(false); 
                this.onReject.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                this.onHalt.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                return true; 
            }


            // Now we come to the nondegenerate case

            // Increment the pointer position 
            if(currentCharacter != Machine.Alphabet.EPSILON_STRING){
                this.setInputPointerPosition(this.getInputPointerPosition() + 1); 
            }

            // Because this is a finite state transducer, we assume that 
            // the action is Machine.Command.WRITE
            if(command.getArgument() != Machine.Alphabet.EPSILON_STRING){
                this.getOutputTape().alter(this.getOutputPointerPosition(), command.getArgument());
                this.setOutputPointerPosition(this.getOutputPointerPosition() + 1);
            } else if(command.getArgument() == Machine.Alphabet.EPSILON_STRING && this.getAllowEpsilonTransitions() == false) { 
                throw new Error("Epsilon transitions not permitted for this machine."); 
            }

            // Change the state
            this.setCurrentState(command.getState()); 


            // Check again for halting conditions
            if(this.halt() == true){
                return true; 
            }


            // Fire the event
            this.onStep.call(condition, command, this.getStepCount(), this.getInputPointerPosition());

            return false; 

        }, 


        /**
         * Runs the DFA with a specified maximum number of steps.
         * @method
         * @param {Number} maxSteps The maximum number of steps to execute
         * @returns {Boolean} True if the machine has halted
         */
        run: function(maxSteps){ 
            for(var i=0; i < maxSteps; i++){
                var returned = this.step(); 
                if(returned == true){
                    return true;                    
                }
            }

            return false; 
        }, 


        /**
         * Creates a human readable string describing the DFA. 
         * @method 
         * @return {String} The human readable string.
         */
        characterDisplay: function() { 
            var s = Machine.StringUtils.border((this.getInputTape().length() * 5) + 10, Machine.ANSI.ANSI_RED); 

            s = s + Machine.ANSI.colorize(this.getInputTape().characterDisplay(this.getInputPointerPosition()), 
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";

            s = s + Machine.ANSI.colorize(this.getOutputTape().characterDisplay(this.getOutputPointerPosition()), 
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";            

            s = s + Machine.ANSI.colorize(this.getStateTable().characterDisplay(this.getCurrentState().getLabel()), 
                Machine.ANSI.ANSI_BLUE);

            s = s + Machine.ANSI.colorize("#" + this.getStepCount() + " Halted: "  
                + Machine.ANSI.invert(this.getIsHalted()) + " Accepted: " 
                + Machine.ANSI.invert(this.getIsAccepted()) + "\n", Machine.ANSI.ANSI_LIGHT_GRAY);
          
            var currentState = this.getCurrentState(); 
            //var character = this.getInputTape().charAt(this.getInputPointerPosition()); 
            //var condition = new Machine.Condition({state:currentState, character:character}); 

            var character = null; 
            var condition = null; 

            if(this.getTransitionFunction().hasEpsilonTransition(currentState)){

                character = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);

            } else{

                character = this.getInputTape().charAt(this.getInputPointerPosition()); 
                condition = new Machine.Condition({state:currentState, character:character}); 
            }




            s = s + Machine.ANSI.colorize(this.getTransitionFunction().characterDisplay(condition), Machine.ANSI.ANSI_GREEN); 

            s = s +Machine.StringUtils.border((this.getInputTape().length() * 5)+ 10, Machine.ANSI.ANSI_RED); 




            return s; 

        }





    };

    Machine.ClassUtils.extend(Machine.FST, Machine.BaseMachine); 



})();
(function() {

    /**
     *
     * This class represents a Deterministic Pushdown Auitomaton (DPDA). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Pushdown_automaton}
     * and also suggestions for further reading.
     *
     *
     * @class DPDA
     * @constructor
     * @memberof Machine
     * @augments {Machine.BaseMachine}
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The input alphabet.
     * @param {Machine.Alphabet} [attribs.stackAlphabet={@link Machine.Alphabet.UNRESTRICTED}] The stack alphabet.
     * @param {String} [attribs.initialStackSymbol=<blank>] The initial stack symbol to push on to the stack.
     *
     **/
    Machine.DPDA = function(attribs) {
        this._init(attribs);
    };


    /**
     * Accepting mode by state.
     *
     * @constant
     * @static
     * @type {String}
     * @memberOf  Member.DPDA
     */
    Machine.DPDA.ACCEPT_BY_STATE = "0";



    /**
     * Accepting mode by stack
     *
     * @constant
     * @static
     * @type {String}
     * @memberOf  Member.DPDA
     */
    Machine.DPDA.ACCEPT_BY_STACK = "1";

    /**
     * The hashset whih contains all the official PDA acceptance modes.
     * @constant
     * @static
     * @type {Machine.HashTable}
     * @memberOf  Machine.DPDA
     */
    Machine.DPDA.ACCEPTANCE_MODES_SET = new Machine.HashTable();
    Machine.DPDA.ACCEPTANCE_MODES_SET.put(Machine.DPDA.ACCEPT_BY_STATE, "State");
    Machine.DPDA.ACCEPTANCE_MODES_SET.put(Machine.DPDA.ACCEPT_BY_STACK, "Stack");

    Machine.DPDA.prototype = {

        // Private Methods
        _init: function(attribs) {

            if (attribs) {
                Machine.BaseMachine.prototype._init.call(this, attribs);
            } else {
                Machine.BaseMachine.prototype._init.call(this);
            }

            if (attribs && attribs.hasOwnProperty("stackAlphabet")) {
                this.setStackAlphabet(attribs.stackAlphabet);
            } else {
                this.setStackAlphabet(Machine.Alphabet.UNRESTRICTED);
            }


            this.acceptanceMode = null;


            // The indicator that the DPDA has processed its last cell of 
            // input and it is in an accepting state
            this.isAccepted = false;

            this.stack = new Machine.Stack({
                alphabet: this.getStackAlphabet()
            });

            if (attribs && attribs.hasOwnProperty("initialStackSymbol")) {
                this.setInitialStackSymbol(attribs.initialStackSymbol);
            } else {
                this.setInitialStackSymbol(this.getStackAlphabet().getBlank());
            }



            // Now iniitialize the tape. 
            this.tape = new Machine.Tape({
                alphabet: this.getAlphabet(),
                chars: ""
            });

            // There is only one pointer on a DPDA tape
            // We initialize it here at posiiton 0
            this.pointerPosition = 0;

            //Some custom listener functions for DPDA class
            this.onAccept = function(state, stepCount, indexPointer) {};
            this.onReject = function(state, stepCount, indexPointer) {};
            this.onPointerChange = function(position) {};
            this.onStackPop = function(character) {};
            this.onStackPush = function(str) {};


            this.stackPush(this.getInitialStackSymbol());
        },

        //Public Methods

        /**
         * Retieves the acceptance mode of the DPDA.
         * @returns {String} The acceptance mode.
         *
         */
        getAcceptanceMode: function() {
            return this.acceptanceMode;
        },


        /**
         * Retieves the acceptance mode name of the DPDA.
         * @returns {String} The acceptance mode name
         *
         */
        getAcceptanceModeName: function() {
            return Machine.DPDA.ACCEPTANCE_MODES_SET.get(this.getAcceptanceMode());
        },

        /**
         * Sets the acceptance mode.
         * @param {String} acceptanceMode The acceptance mode.
         *
         */
        setAcceptanceMode: function(acceptanceMode) {
            this.acceptanceMode = acceptanceMode;
        },

        /**
         * Retieves the initial stack character.
         * @method
         * @returns {String} The initial stack character.
         */
        getInitialStackSymbol: function() {
            return this.initialStackSymbol;
        },

        /**
         * Sets the initial stack character.
         * @method
         * @param {String} initialStackSymbol The initial stack character
         */
        setInitialStackSymbol: function(initialStackSymbol) {
            if (this.getStackAlphabet().contains(initialStackSymbol) == false) {
                throw new Error("Invalid initial stack character");
            }

            this.initialStackSymbol = initialStackSymbol;
        },


        /**
         * Retrieves the output alphabet for this machine.
         * @method
         * @return {Machine.Alphabet} The output alphabet
         */
        getStackAlphabet: function() {
            return this.stackAlphabet;
        },

        /**
         * Sets the stack alphabet for the machine.
         *
         * @method
         * @param {Machine.Alphabet} stackAlphabet The output alphabet.
         */
        setStackAlphabet: function(stackAlphabet) {
            this.stackAlphabet = stackAlphabet;
        },

        /**
         * Retrieves the stack alphabet.
         * @method
         * @return {Machine.Stack} The DPDA's stack.
         */
        getStack: function() {
            return this.stack;
        },


        /**
         * Sets the stack.
         * @method
         * @param {MachineStack} stack The machine stack
         *
         */
        setStack: function(stack) {
            this.stack = stack;
        },


        /**
         * Pops something from the stack.
         * @method
         * @return {String} The character popped from the stack.
         */
        stackPop: function() {
            var c = this.getStack().pop();
            this.onStackPop.call(c);
            return c;
        },

        /**
         * Peeks at the stack.
         * @method
         * @return {String} The topmost character from the stack.
         */
        stackPeek: function() {
            var c = this.getStack().peek();
            return c;
        },



        /**
         * Pushes something onto the stack.
         * @method
         * @param {String} str The string to push onto the stack
         */
        stackPush: function(str) {
            if (this.getStackAlphabet().isCompatibleWith(str) == false) {
                throw new Error("Invalid stack string.");
            }
            this.getStack().push(str);
            this.onStackPush.call(str);
        },


        /**
         * Returns whether the DPDA is in an accepting state.
         * @method
         * @return {Boolean} True if in accepted state.
         */
        getIsAccepted: function() {
            return this.isAccepted;
        },


        /**
         * Sets the value of the accepted state of the DPDA.
         * @method
         * @param {Boolean} isAccepted The new accepted state.
         *
         */
        setIsAccepted: function(isAccepted) {
            this.isAccepted = isAccepted;
        },


        /**
         * Returns the tape pointer position.
         * @method
         * @return {Number} The pointer position.
         *
         */
        getPointerPosition: function() {
            return this.pointerPosition;
        },

        /**
         * Sets the pointer position.
         * @method
         * @param {Number} pointerPosition The pointer position.
         */
        setPointerPosition: function(pointerPosition) {
            this.pointerPosition = pointerPosition;
            this.onPointerChange.call(this.pointerPosition);
        },


        /**
         * Returns the tape object.
         * @method
         * @return {Machine.Tape} The input tape.
         */
        getTape: function() {
            return this.tape;
        },


        /** 
         * Sets the tape object. Beware when using this
         * method, there are no checks of internal consistency
         * with other aspects of the DPDA.
         *
         * @method
         * @param {Machine.Tape} tape The tape
         */
        setTape: function(tape) {
            this.tape = tape;
        },

        /**
         * Sets the input string on the tape for the DPDA and
         * sends the pointer back to the beginning of th string.
         *
         * @method
         * @param {String} input The input string
         *
         */
        setInputString: function(input) {
            this.getTape().setChars(input);
            this.setPointerPosition(0);

        },

        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            Machine.BaseMachine.prototype.reset.call(this);
            this.setPointerPosition(0);
            this.getStack().clear();
            this.stackPush(this.getInitialStackSymbol());
            this.setIsAccepted(false);
        },



        /** 
         * Adds a transition.
         * @method
         * @param {Mahine.State} conditionState The condition state.
         * @param {String} conditionCharacter The condition character.
         * @param {String} conditionStackElement The condition stack element character.
         * @param {String} transitionStackString The transition stack string  to push.
         * @param {Machine.State} transitionState  The state to transition to.
         */
        addTransitionByStatesAndCharacter: function(conditionState, currentCharacter, conditionStackElement, transitionStackString, transitionState) {
            var condition = new Machine.Condition({
                state: conditionState,
                character: currentCharacter,
                stackElement: conditionStackElement
            });

            var command = new Machine.Command({
                state: transitionState,
                action: Machine.Command.STACK_CHANGE,
                argument: transitionStackString
            });
            this.addTransition(condition, command);
        },

        /** 
         * Adds a transition by state label.
         * @method
         * @param {String} conditionStateLabel The condition state label.
         * @param {String} conditionCharacter The condition character.
         * @param {String} conditionStackElement The condition stack element character.
         * @param {String} transitionStackString The transition stack string to push.
         * @param {String} transitionStateLabel  The state label to transition to.
         */
        addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, conditionStackElement, transitionStackString, transitionStateLabel) {
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel);
            var transitionState = this.getStateTable().getStateByLabel(transitionStateLabel);
            this.addTransitionByStatesAndCharacter(conditionState, currentCharacter, conditionStackElement, transitionStackString, transitionState);
        },


        /**
         * Removes a transition by label and character
         * @method
         * @param {String} conditionStateLabel The condition state label
         * @param {String} conditionCharacter The condition character
         * @param {String} conditionStackElement The condition stack element character.
         */
        removeTransitionByStateLabelsAndCharacter: function(conditionStateLabel, conditionCharacter, conditionStackElement) {
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel);
            var condition = new Machine.Condition({
                state: condiitonState,
                character: conditionCharacter,
                stackElement: stackElement
            });
            this.removeTrandition(condition);
        },

        /**
         * Checks to see if the machine should halt and configures the machine
         * accordingly.
         *
         * @method
         * @return {Boolean} True if the machine has halted
         */
        halt: function() {

            var currentState = this.getCurrentState(); 
            var topmostStackCharacter = this.stackPeek(); 


            // Acceptance in a DPDA happens when the input is expired and the machine is in an accepting state
            // or the input has been emptied, the stack has been emptied and there are no remaining epsilon transitions
            // 
            // When the DPDA has run out input it can still take epsilon transitions
            if (this.getPointerPosition() >= this.getTape().length() && (this.getTransitionFunction().hasEpsilonTransition(currentState) == false ||
                    topmostStackCharacter == Machine.Alphabet.EPSILON_STRING)) {

                this.setIsHalted(true);
                // We have run out of characters to read
                // Are we in an accepting state?
                if (currentState.getIsAccepting() == true) {
                    this.setIsAccepted(true);
                    this.onAccept.call(currentState, this.getStepCount(), this.getPointerPosition());

                    this.setAcceptanceMode(Machine.DPDA.ACCEPT_BY_STATE);
                } else if (this.getStack().isEmpty() == true) {
                    this.setIsAccepted(true);
                    this.onAccept.call(currentState, this.getStepCount(), this.getPointerPosition());

                    this.setAcceptanceMode(Machine.DPDA.ACCEPT_BY_STACK);
                } else {
                    this.setIsAccepted(false);
                    this.onReject.call(currentState, this.getStepCount(), this.getPointerPosition());

                }

                this.onHalt.call(currentState, this.getStepCount(), this.getPointerPosition());
                return true;
            }

        },



        /** 
         * Executes one step of the DPDA.
         * @method
         * @return {Boolean} True if halted
         */
        step: function() {
            if (this.getIsHalted() == true) {
                //The DPDA is halted so there is nothing do so, so return. 
                return true;

            }

            // Increment the stepCount
            this.setStepCount(this.getStepCount() + 1);
            var currentState = this.getCurrentState();
            var topmostStackCharacter = this.stackPeek();

            // Check for halting conditions
            if(this.halt() == true){
                return true; 
            }



            var currentCharacter = null;
            var condition = null;

            if (this.getTransitionFunction().hasEpsilonTransition(currentState)) {
                //take the epsilon transition

                currentCharacter = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);


            } else {

                currentCharacter = this.getTape().charAt(this.getPointerPosition());
                condition = new Machine.Condition({
                    state: currentState,
                    character: currentCharacter,
                    stackElement: topmostStackCharacter
                });
            }



            var command = this.getTransitionFunction().getCommand(condition);

            if (command == null) {
                // There was no transition for the appropriate condition
                // so we have to halt and reject.
                this.setIsHalted(true);
                this.setIsAccepted(false);
                this.onReject.call(currentState, this.getStepCount(), this.getPointerPosition());
                this.onHalt.call(currentState, this.getStepCount(), this.getPointerPosition());
                return true;
            }


            // We always pop try to pop one character, per convention
            if (condition.getStackElement() != Machine.Alphabet.EPSILON_STRING) {
                var popCharacter = this.stackPop();
            }



            if (command.getAction() == Machine.Command.STACK_CHANGE && command.getArgument() != Machine.Alphabet.EPSILON_STRING) {
                this.stackPush(command.getArgument());
            }



            // Increment the pointer position 
            if (this.getTransitionFunction().hasEpsilonTransition(currentState) == false) {
                this.setPointerPosition(this.getPointerPosition() + 1);
            }

            // Change the state
            this.setCurrentState(command.getState());


            //Check for halting conditions again
            if(this.halt() == true){
                return true; 
            }



            // Fire the event
            this.onStep.call(condition, command, this.getStepCount(), this.getPointerPosition());

            return false;

        },



        /**
         * Runs the DPDA with a specified maximum number of steps.
         * @method
         * @param {Number} maxSteps The maximum number of steps to execute
         * @returns {Boolean} True if the machine has halted
         */
        run: function(maxSteps) {
            for (var i = 0; i < maxSteps; i++) {
                var returned = this.step();
                if (returned == true) {
                    return true;
                }
            }

            return false;
        },


        /**
         * Creates a human readable string describing the DPDA.
         * @method
         * @return {String} The human readable string.
         */
        characterDisplay: function() {
            var s = Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED);

            s = s + Machine.ANSI.colorize(this.getTape().characterDisplay(this.getPointerPosition()),
                Machine.ANSI.ANSI_YELLOW);

            var mode = "";
            if (this.getIsAccepted()) {
                mode = "[" + this.getAcceptanceModeName() + "]";
            }

            s = s + "\n";

            s = s + Machine.ANSI.colorize(this.getStateTable().characterDisplay(this.getCurrentState().getLabel()),
                Machine.ANSI.ANSI_BLUE);

            s = s + Machine.ANSI.colorize("#" + this.getStepCount() + " Halted: " + Machine.ANSI.invert(this.getIsHalted()) + " Accepted: " + Machine.ANSI.invert(this.getIsAccepted() + mode) + "\n", Machine.ANSI.ANSI_LIGHT_GRAY);

            s = s + Machine.ANSI.colorize(this.getStack().characterDisplay() + "\n", Machine.ANSI.ANSI_BLUE);


            var currentState = this.getCurrentState();
            var topMostStackCharacter = this.stackPeek();
            var currentCharacter = null;
            var condition = null;

            if (this.getTransitionFunction().hasEpsilonTransition(currentState)) {
                //take the epsilon transition

                currentCharacter = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);


            } else {

                currentCharacter = this.getTape().charAt(this.getPointerPosition());
                condition = new Machine.Condition({
                    state: currentState,
                    character: currentCharacter,
                    stackElement: topMostStackCharacter
                });
            }



            s = s + Machine.ANSI.colorize(this.getTransitionFunction().characterDisplay(condition), Machine.ANSI.ANSI_GREEN);

            s = s + Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED);



            return s;

        }



    };

    Machine.ClassUtils.extend(Machine.DPDA, Machine.BaseMachine);



})();
(function() {

    /**
     *
     * This class represents a Deterministic Finite  Automaton (TM). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Deterministic_finite_automaton}
     * and also suggestions for further reading.
     *
     *
     * @class TM
     * @constructor
     * @memberof Machine
     * @augments {Machine.BaseMachine}
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet.
     **/
    Machine.TM = function(attribs) {
        this._init(attribs);
    };



    Machine.TM.prototype = {

        // Private Methods
        _init: function(attribs) {

            if (attribs) {
                Machine.BaseMachine.prototype._init.call(this, attribs);
            } else {
                Machine.BaseMachine.prototype._init.call(this);
            }



            // The indicator that the TM has processed its last cell of 
            // input and it is in an accepting state
            this.isAccepted = false;


            // Now iniitialize the tape. 
            this.tape = new Machine.Tape({
                alphabet: this.getAlphabet(),
                chars: ""
            });

            // There is only one pointer on a TM tape
            // We initialize it here at posiiton 0
            this.pointerPosition = 0;

            //Some custom listener functions for TM class
            this.onAccept = function(state, stepCount, indexPointer) {};
            this.onReject = function(state, stepCount, indexPointer) {};
            this.onPointerChange = function(position) {};

        },

        //Public Methods



        /**
         * Returns whether the TM is in an accepting state.
         * @method
         * @return {Boolean} True if in accepted state.
         */
        getIsAccepted: function() {
            return this.isAccepted;
        },


        /**
         * Sets the value of the accepted state of the TM.
         * @method
         * @param {Boolean} isAccepted The new accepted state.
         *
         */
        setIsAccepted: function(isAccepted) {
            this.isAccepted = isAccepted;
        },


        /**
         * Returns the tape pointer position.
         * @method
         * @return {Number} The pointer position.
         *
         */
        getPointerPosition: function() {
            return this.pointerPosition;
        },

        /**
         * Sets the pointer position.
         * @method
         * @param {Number} pointerPosition The pointer position.
         */
        setPointerPosition: function(pointerPosition) {
            this.pointerPosition = pointerPosition;
            this.onPointerChange.call(this.pointerPosition);
        },


        /**
         * Returns the tape object.
         * @method
         * @return {Machine.Tape} The input tape.
         */
        getTape: function() {
            return this.tape;
        },


        /** 
         * Sets the tape object. Beware when using this
         * method, there are no checks of internal consistency
         * with other aspects of the TM.
         *
         * @method
         * @param {Machine.Tape} tape The tape
         */
        setTape: function(tape) {
            this.tape = tape;
        },


        /**
         * Retrieve the contents of the Turing machine tape. 
         * @method 
         * @returns {String} The Turing machine tape
         */
        getTapeContents: function() {
            return this.getTape().getChars(); 
        }, 

        /**
         * Sets the input string on the tape for the TM and
         * sends the pointer back to the beginning of th string.
         *
         * @method
         * @param {String} input The input string
         *
         */
        setInputString: function(input) {
            this.getTape().setChars(input);
            this.setPointerPosition(0);

        },

        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            Machine.BaseMachine.prototype.reset.call(this);
            this.setPointerPosition(0);
            this.setIsAccepted(false);
        },



        /** 
         * Adds a transition.
         * @method
         * @param {Mahine.State} conditionState The condition state.
         * @param {String} conditionCharacter The condition character.
         * @param {Machine.State} transitionState  The state to transition to.
         */
        addTransitionByStatesAndCharacter: function(conditionState, currentCharacter, transitionAction, transitionArgument, transitionState) {

            if (currentCharacter == Machine.Alphabet.EPSILON_STRING) {
                throw new Error("Epsilon modifications not permitted in this machine");
            }

            if(transitionAction == Machine.Command.WRITE 
                && (transitionArgument == null || transitionArgument.length != 1 || this.getAlphabet().contains(transitionArgument) == false)) {
                throw new Error("Invalid argument for Turing Machine write:" + transitionArgument);                
            }


            var condition = new Machine.Condition({
                state: conditionState,
                character: currentCharacter
            });

            var command = new Machine.Command({
                state: transitionState, 
                action: transitionAction, 
                argument: transitionArgument
            });
            this.addTransition(condition, command);
        },

        /** 
         * Adds a transition by state label.
         * @method
         * @param {String} conditionStateLabel The condition state label.
         * @param {String} conditionCharacter The condition character.
         * @param {String} transitionStateLabel  The state label to transition to.
         */
        addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, transitionActionDescription, transitionArgument, transitionStateLabel) {
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel);
            var transitionState = this.getStateTable().getStateByLabel(transitionStateLabel);
            var transitionAction = Machine.Command.getActionFromDescription(transitionActionDescription);
            this.addTransitionByStatesAndCharacter(conditionState, currentCharacter, transitionAction, transitionArgument, transitionState);
        },


        /**
         * Removes a transition by label and character
         * @method
         * @param {String} conditionStateLabel The condition state label
         * @param {String} conditionCharacter The condition character
         */
        removeTransitionByStateLabelsAndCharacter: function(conditionStateLabel, conditionCharacter) {
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel);
            var condition = new Machine.Condition({
                state: condiitonState,
                character: conditionCharacter
            });
            this.removeTrandition(condition);
        },

        /**
         * Checks to see if the machine should halt and configures the machine
         * accordingly. 
         * 
         * @method
         * @return {Boolean} True if the machine has halted
         */
        halt: function(){ 

            // we first check to see if we're already in an accepting state. 
            // This is usually the case when the initial state is already an
            // accepting state. We don't want to try to check to see if there
            // is a condition to advance a command. 


            var currentState = this.getCurrentState(); 

            if (currentState.getIsAccepting() == true) {
                this.setIsHalted(true);
                this.setIsAccepted(true);
                this.onAccept.call(currentState, this.getStepCount(), this.getPointerPosition());
                this.onHalt.call(currentState, this.getStepCount(), this.getPointerPosition());
                return true;
            }


        }, 

        /** 
         * Executes one step of the TM.
         * @method
         * @return {Boolean} True if halted
         */
        step: function() {
            if (this.getIsHalted() == true) {
                //The TM is halted so there is nothing do so, so return. 
                return true;

            }

            // Increment the stepCount
            this.setStepCount(this.getStepCount() + 1);
            var currentState = this.getCurrentState();


            // Check to see whether we are in a haltable situation
            if(this.halt() == true){
                return true; 
            }



            var currentCharacter = this.getTape().charAt(this.getPointerPosition());


            var condition = new Machine.Condition({
                state: currentState,
                character: currentCharacter
            });


            var command = this.getTransitionFunction().getCommand(condition);

            if (command == null) {
                // There was no transition for the appropriate condition
                // so we have to halt and reject.
                this.setIsHalted(true);
                this.setIsAccepted(false);
                this.onReject.call(currentState, this.getStepCount(), this.getPointerPosition());
                this.onHalt.call(currentState, this.getStepCount(), this.getPointerPosition());
                return true;
            }





            // Left Move
            if (command.getAction() == Machine.Command.MOVE_LEFT) {

                if (this.getPointerPosition() == 0) {
                    this.getTape().prepend(this.getAlphabet().getBlank());
                } else {
                    this.setPointerPosition((this.getPointerPosition()-1));
                }

            }


            // Right Move
            else if (command.getAction() == Machine.Command.MOVE_RIGHT) {
                if (this.getPointerPosition() >= this.getTape().length() - 1) {
                    this.getTape().append(this.getAlphabet().getBlank());
                }
                this.setPointerPosition(this.getPointerPosition() + 1);

            }

            // Erase
            else if (command.getAction() == Machine.Command.ERASE) {
                this.getTape().alter(this.getPointerPosition(), this.getAlphabet().getBlank()); 

            }

            // Write
            else if (command.getAction() == Machine.Command.WRITE) {

                var character = command.getArgument();
                if (character == null) {
                    throw  new Error("Missing parameter for write.");
                }

                this.getTape().alter(this.getPointerPosition(), character);

            } else if (command.getAction() == Machine.Command.NOOP) {
                //Nothing
            }



            // Change the state
            this.setCurrentState(command.getState());


            // Are we ready to halt? If so check for the appropriate condition.
            if(this.halt() == true){
                return true; 
            }



            // Fire the event
            this.onStep.call(condition, command, this.getStepCount(), this.getPointerPosition());

            return false;

        },


        /**
         * Runs the TM with a specified maximum number of steps.
         * @method
         * @param {Number} maxSteps The maximum number of steps to execute
         * @returns {Boolean} True if the machine has halted
         */
        run: function(maxSteps) {
            for (var i = 0; i < maxSteps; i++) {
                var returned = this.step();
                if (returned == true) {
                    return true;
                }
            }

            return false;
        },


        /**
         * Creates a human readable string describing the TM.
         * @method
         * @return {String} The human readable string.
         */
        characterDisplay: function() {
            var s = Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED);

            s = s + Machine.ANSI.colorize(this.getTape().characterDisplay(this.getPointerPosition()),
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";

            s = s + Machine.ANSI.colorize(this.getStateTable().characterDisplay(this.getCurrentState().getLabel()),
                Machine.ANSI.ANSI_BLUE);

            s = s + Machine.ANSI.colorize("#" + this.getStepCount() + " Halted: " + Machine.ANSI.invert(this.getIsHalted()) + " Accepted: " + Machine.ANSI.invert(this.getIsAccepted()) + "\n", Machine.ANSI.ANSI_LIGHT_GRAY);

            var currentState = this.getCurrentState();
         
            var character = this.getTape().charAt(this.getPointerPosition());
            var condition = new Machine.Condition({
                    state: currentState,
                    character: character
                });
            

            s = s + Machine.ANSI.colorize(this.getTransitionFunction().characterDisplay(condition), Machine.ANSI.ANSI_GREEN);

            s = s + Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED);



            return s;

        }



    };

    Machine.ClassUtils.extend(Machine.TM, Machine.BaseMachine);



})();
(function() {

    /**
     * A class to represent a stack used in
     *
     * @class Stack
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.Alphabet} [attribs.alphabet] The stack alphabet.
     
     *
     **/
    Machine.Stack = function(attribs) {
        this._init(attribs);
    };

    Machine.Stack.prototype = {
        // Private Methods
        _init: function(attribs) {
            this.data = [];
            if (attribs && attribs.hasOwnProperty("alphabet")) {
                    this.setAlphabet(attribs.alphabet); 
             } else {
                    this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }


        },

        //Public Methods 
        //
        /**
         * Retrieves the alphabet for this DFA. 
         * @method
         * @return {Machine.Alphabet} The alphabet
         */
        getAlphabet: function() {
            return this.alphabet;
        },

        /**
         * Sets the alphabet for the DFA.Beware: there are no internal 
         * consistency checks for replacing a state table in situ. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet.
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /**
         * Returns whether or not the stack is empty 
         * @returns {Boolean} True if the stack is empty
         */
        isEmpty: function() { 
            if(this.data.length <= 0){
                return true;
            }

            return false; 
        }, 

        /**
         * Returns the topmost element of the stack without removing it.
         * @peek
         * @return {String} The character
         */
        peek:function() { 
            if(this.data.length > 0) { 
                return this.data[this.data.length-1]; 
            } else { 
                return Machine.Alphabet.EPSILON_STRING;
            }
        },


        /**
         * Removes and returns the topmost element of the stack. 
         * @method
         * @return {String} The character
         */
        pop: function() {
            if(this.data.length > 0) { 
                return this.data.pop(); 
            } else { 
                return Machine.Alphabet.EPSILON_STRING; 
            }
        }, 

        /**
         *  Adds a string to the stack. Note that the last element
         *  of the string is added to the stack first. 
         *  @method
         *  @param {String} str The stack string to push
         * 
         */
        push: function(str){
            
            if(str === Machine.Alphabet.EPSILON_STRING) { 
                return; 
            }

            if(this.getAlphabet().isCompatibleWith(str) == false)  {
                throw new Error("Invalid string for stack push."); 
            } 

            for(var i = str.length -1; i >=0; i--){           
                var ch = str.charAt(i); 
                this.data.push(ch); 
            }
        },

        /**
         *  Adds a topmost element to the stack. 
         *  @method
         *  @param {String} character The stack character to push
         * @return {String} The popped character
         */
        poppush: function(character){
            var o = this.pop(); 
            if(this.getAlphabet().contains(character) == false)  {
                throw new Error("Invalid character for stack element"); 
            }            
            this.data.push(character); 
            return o; 
        },

        /**
         * Clears the stack so that it no longer contains any units. 
         * @method
         */
         clear: function() { 
            this.data = []; 
         }, 

        /**
         * A useful method which returns the state of the tape as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function() {
            var s = "";

            //header
            for (var i = 0; i < this.data.length; i++) {
                s = s + "____";
            }

            s = s + "\n";

            //tape contents
            if(this.data.length == 0){
                s += Machine.ANSI.invert("|Ø|"); 
            } else{
                s += "|";
            }
            for (var i = 0; i < this.data.length; i++) {
                var character = this.data[i];

                if(i == (this.data.length-1)){
                    s  = s +  Machine.ANSI.invert("*" + character);
                } else {
                    s = s + " " + character;
                }
                s = s + " |";
            }

            //footer 
            s = s + "\n";
            for (var i = 0; i < this.data.length; i++) {
                s = s + "‾‾‾‾";
            }

            return s;
        }


    };

})();
(function() {

    /**
     * A class to represent a state in a finite state machine.
     * 
     * @class State
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {String} attribs.label The label for the state. 
     * @param {Boolean} attribs.isAccepting A flag indicating the state is an accepting state.
     *
     **/
    Machine.State = function(attribs) {
        this._init(attribs);
    };


    Machine.State.prototype = { 

        // Private Methods
        _init: function(attribs){
            this.label = attribs.label; 
            this.isAccepting = attribs.isAccepting; 
        }, 


        // Public Methods
        /**
         * Returns whether or not the state is accepting.
         * @method
         * @return {Boolean} True if it is accepting.
         */     
        getIsAccepting: function(){ 
            return this.isAccepting; 
        },

        /**
         * Specifies whether the state is accepting.
         * @method
         * @param {Boolean} isAccepting True if it is accpeting.
         */ 
        setIsAccepting: function(isAccepting){
            this.isAccepting = isAccepting;         
        },

        /**
         * Retrieves the label of the state.
         * @method
         * @return {String} A name for the state.
         */
        getLabel: function(){ 
            return this.label; 
        }, 

        /**
         * Sets the label for the state.
         * @method
         * @param {String} label A name for the state.
         */
        setLabel: function(label){
            this.label = label;         
        }
    };





})();

(function() {

    /**
     * A class which represents a set of states. Importantly the table
     * requires that the labels of states are unique.
     * 
     * @class StateTable
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.StateTable = function(attribs) {
        this._init(attribs);
    };


    Machine.StateTable.prototype = {
        // Private Methods
        _init: function(attribs) {
            this.stateMap = new Machine.HashTable();
            this.acceptingStates = new Machine.HashSet();
            this.controlStates = new Machine.HashSet();

        },


        // Public Methods
        /**
         * Adds a state to the table.
         * @method
         * @param {Machine.State} state The state to add to the table
         */
        add: function(state) {

            if (state instanceof Machine.State == false) {
                throw "Object invalid for adding to state table.";
            }

            if (state.getIsAccepting() == true) {
                this.acceptingStates.add(state);
            } else {
                this.controlStates.add(state);
            }

            this.stateMap.put(state.getLabel(), state);
        },

        /**
         * Removes a state from the state table.
         * @method
         * @param  {String} label The label of the state
         */
        remove: function(label) {
            var state = this.getStateByLabel(label);
            this.stateMap.remove(label);
            if (this.acceptingStates.contains(state)) {
                this.acceptingStates.remove(state);
            }


            if (this.controlStates.contains(state)) {
                this.controlStates.remove(state);
            }

        },

        /**
         * Returns a hashset of the control states (i.e. the non-acccepting states). 
         * @method
         * @return {Machine.HashSet} The set of control states.
         */
        getControlStates: function() {
            return this.controlStates;
        },


        /**
         * Returns a hashset of the accepting states.
         * @method
         * @return {Machine.HashSet} The set of accepting states.
         */
        getAcceptingStates: function() {
            return this.acceptingStates;
        },

        /**
         * Gets a state object from a (string) label.
         * @method
         * @param  {String} label A name for the state
         * @return {Machine.State}       The state object
         */
        getStateByLabel: function(label) {
            if (label == null) return false;
            return this.stateMap.get(label);
        },

        /**
         * Checks whether a state is in this table.
         * @method
         * @param  {Machine.State} state The candidate state.
         * @return {Boolean}       True if the state is in the table.
         */
        contains: function(state) {
            if (state == null) return false;

            if (this.stateMap.containsValue(state)) {
                return true;
            }
            return false;
        },

        /**
         * Returns the size of the state table.
         * @return {Number} The size of the state table.
         */
        length: function() {
            return this.stateMap.keys().length;
        },

        /**
         * Returns a list of the state labels.
         * @return {List} A list of the state table.
         */
        labels: function() {
            return this.stateMap.keys();
        },

        /**
         * A useful method which returns a summary of the state table as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function(label) {
            var s = "";

            s = s + Machine.ANSI.embolden("Control: ");

            for (var i  = 0; i < this.controlStates.values().length; i++) {
                s = s + this.controlStates.values()[i].getLabel() 
                if(label == this.controlStates.values()[i].getLabel()) { 
                    s = s + "*"; 
                }
                s = s +  " | ";
            }

            s = s + Machine.ANSI.embolden("Accepting: ");



            for (var i  = 0; i < this.acceptingStates.values().length; i++) {
                s = s + this.acceptingStates.values()[i].getLabel() 
                if(label == this.acceptingStates.values()[i].getLabel()) { 
                    s = s + "*"; 
                }
                s = s + " | ";
            }

            s = s + "\n";

            return s; 

        }


    };



})();
(function() {

    /**
     * A class by which to represent a machine tape, i.e. a sequence of characters
     * divided into cells.
     * 
     * @class Tape
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet for the tape.
     *
     **/
    Machine.Tape = function(attribs) {
        this._init(attribs);
    };


    Machine.Tape.prototype = {


        // Private Methods
        _init: function(attribs) {
            if(attribs && attribs.hasOwnProperty("alphabet")){
                this.setAlphabet(attribs.alphabet); 
            } else{ 
                this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            if(attribs && attribs.hasOwnProperty("chars")) {
                this.setChars(attribs.chars); 
            } else {
                this.setChars(""); //set it to the empty string
            }
        },


        // Public Methods


        /**
         * Retrieves the alphabet for the tape. 
         * @method
         * @return {Machine.Alphabet} The alphabet.
         */
        getAlphabet: function() {
            return this.alphabet;
        },


        /**
         * Retrieve the entire character content of the tape as a single string.
         * @method
         * @return {String} The contents of the tape.
         */
        getChars: function() {
            return this.chars;
        },


        /**
         * Sets the alphabet for the tape. 
         * @method
         * @param  {Machine.Alphabet} alphabet The new alphabet.
         */
        setAlphabet: function(alphabet) {
            if (alphabet instanceof Machine.Alphabet == false) {
                throw new Error("Invalid type for alphabet");
            }

            this.alphabet = alphabet;
        },

        /**
         * Sets the character content for the tape. This will be validated
         * against the specified alphabet.
         * @method
         * @param {String} chars [description]
         */
        setChars: function(chars) {
            if (this.alphabet.isCompatibleWith(chars) == false) {
                throw new Error("Incompatible alphabet for contents.");
            }

            this.chars = chars;
        },

        
        /**
         * Returns the length of the character content on the tape.
         * @method
         * @return {Number} The length of the tape.
         */
        length: function() {
            return this.chars.length;
        },


        /**
         * Returns the character at the specified point in the tape.
         * @method
         * @param  {Number} index A 0-based index.
         * @return {String}       The character at the tape.
         */
        charAt: function(index) {
            return this.chars.charAt(index);
        },


        /**
         * Returns whether there is a character at the specified point in the tape.
         * @method
         * @param  {Number}  pos A 0-based index
         * @return {Boolean}     True if a character exists at the position
         */
        hasCharAt: function(pos) {
            if (pos < 0) {
                return false;
            }

            if (pos >= this.chars.length) {
                return false;
            }

            return true;


        },

        /**
         * Prepend a string (a finite sequence of character) to the tape.
         * @method
         * @param  {String} s The string to prepend
         */
        prepend: function(s) {
            if(this.getAlphabet().isCompatibleWith(s) == false){
                throw new Error("String incompatible with alphabet"); 
            }
            this.chars = s + this.chars;
        },

        /**
         * Append a string (a finite sequence of character) to the tape.
         * @method
         * @param  {String} s The string to append
         */
        append: function(s) {
            if(this.getAlphabet().isCompatibleWith(s) == false){
                throw new Error("String incompatible with alphabet"); 
            }
            this.setChars(this.chars + s);
        },

        /**
         * Alter the tape at a specified position on the tape.
         * @method
         * @param  {Number} pos A 0-based index
         * @param  {String} c   A character to modify
         */
        alter: function(pos, c) {
            if(this.getAlphabet().contains(c) == false) {
                throw new Error("Incompatible character"); 
            }

            if (c.length != 1) {
                throw new Error("Invalid length.");
            }

            this.chars = Machine.StringUtils.replaceAt(this.chars, pos, c);
        },

        /**
         * A useful method which returns the state of the tape as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function(pointerPosition) {
            var s = "";

            //header
            for (var i = 0; i < this.chars.length; i++) {
                s = s + "=====";
            }

            s = s + "\n";

            //tape contents
            s += "|";
            for (var i = 0; i < this.chars.length; i++) {
                var character = this.chars.charAt(i);
                if(i == pointerPosition) { 
                    s = s + Machine.ANSI.invert("*" + character);
                } else {
                    s = s + " " + character;
                }
                s = s + " |";
            }

            //footer 
            s = s + "\n";
            for (var i = 0; i < this.chars.length; i++) {
                s = s + "=====";
            }

            return s;
        }


    };


})();
(function() {

    /**
     * A class to represent a transition function, which maps objects of
     * the class {@link Machine.Condition} to objects of the class {@link}
     * 
     * 
     * @class TransitionFunction
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.StateTable} [attribs.stateTable] Start with an already initialized state table. 
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet for the transition function.
     * @param {Boolean} [attribs.requireTotal=false] Makes the retrieve commmand methods throw an error if a condition is missing; otherwise they return null
     * @param {Boolean} [attribs.allowEpsilonTransitions=true] Allow epsilon transitions in the transition function
     *
     **/
    Machine.TransitionFunction = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype = {
        // Private Methods
        _init: function(attribs) {
            
            // this is where we will ulimately map conditions to commands
            this.map = new Machine.HashTable();

            // the epsilon transition map
            this.epsilonMap = new Machine.HashTable();  

            if(attribs && attribs.hasOwnProperty("stateTable")){
                this.stateTable = attribs.stateTable;
            } else {
                this.stateTable = new Machine.StateTable(); 
            }

            if(attribs && attribs.hasOwnProperty("alphabet")){
                this.alphabet = attribs.alphabet; 
            } else {
                this.alphabet = Machine.Alphabet.UNRESTRICTED;
            }

            if(attribs && attribs.hasOwnProperty("requireTotal")){
                this.requireTotal = attribs.requireTotal; 
            } else {
                this.requireTotal = false; 
            }

            if(attribs && attribs.hasOwnProperty("allowEpsilonTransitions")){
                this.setAllowEpsilonTransitions(attribs.allowEpsilonTransitions); 
            } else {
                this.setAllowEpsilonTransitions(true); 

            }



        },


        // Public Methods
        // 

        /**
         * Retrives the epsilon map, which is a mapping between states and
         * epsilon conditions. 
         * 
         * @returns {Machine.HashTable} The epsilon map.
         */
        
        getEpsilonMap: function() { 
            return this.epsilonMap; 
        }, 

        /**
         * Sets the epsilon map, a mapping between states and the epsilon 
         * conditions. 
         * 
         * @param {Machine.HashTable} epsilonMap The epsilon map. 
         */
        setEpilsonMap: function(epsilonMap){

            this.epsilonMap = epsilonMap; 
        }, 
 


        /**
         * Retrives whether or not this function allows epsilon  
         * transitions. 
         * @returns {Boolean} True if epsilon transitions allowed
         */
        
        getAllowEpsilonTransitions: function() { 
            return this.allowEpsilonTransitions; 
        }, 

        /**
         * Sets whether or not this function allows epsilon transitions. 
         * @param {Boolean} allowEpsilonTransitions True if epsilon transitions allowed.
         */
        setAllowEpsilonTransitions: function(allowEpsilonTransitions){

            this.allowEpsilonTransitions = allowEpsilonTransitions; 
        }, 
 
        /**
         * Adds a transition to the function using two objects. 
         *         
         * @param {Machine.Condition} condition The condition for the mapping.
         * @param {Machine.Command} command   The command for the mapping.
         */
        add: function(condition, command) {

            if (condition instanceof Machine.Condition == false) {
                throw new Error("Invalid condition.");
            }

            if (this.stateTable.contains(condition.getState()) == false) {
                throw new Error ("Invalid state for condition.");
            }

            if (this.alphabet.contains(condition.getCharacter()) == false) {
                throw new Error("Invalid character for condition given alphabet");
            }


            if (command instanceof Machine.Command == false) {
                throw  new Error("Invalid command.");
            }


            if (this.stateTable.contains(command.getState()) == false) {
                throw new Error("Invalid state for command.");
            }

            if (command.hasAction() &&
                command.getAction() == Machine.Command.WRITE &&
                this.alphabet.contains(command.getArgument()) == false) {
                throw new Error("Invalid argument for command.");
            }

            if(condition.getCharacter() == Machine.Alphabet.EPSILON_STRING){
                //we first check to make sure this is permitted 
                //
                if(this.getAllowEpsilonTransitions() == false){
                    throw new Error("Epsilon transitions not permitted in this function"); 
                }

                // Now make sure that there aren't existing 
                // transitions. You can only add an epsilon transition when
                // 
                var conditions = this.getConditions(); 

                for(var i = 0; i < conditions.length; i++){
                    var candidateCondition = conditions[i]; 
                    if(candidateCondition.getState().getLabel() 
                        == condition.getState().getLabel()) { 
                        // this state already has an associated transition condition
                        // so we are not going to be able to add an epsilon transition 
                        throw new Error("Unable to add epsilon transition because other transitions exist. Delete those first."); 
                   }
                }

                // Now we made sure no other conditions are associated with the state
                // So add the condition to the epsilon map
                
                this.getEpsilonMap().put(JSON.stringify(condition.getState()), condition); 

            } else {
                // we're trying to add a non-epsilon transition
                // but we shouldn't be able to do it 
                // if there is a already an epsilon transition associated with the state
                if(this.hasEpsilonTransition(condition.getState()) == true){
                    throw new Error("Unable to add transition because there are existing epsilon transitions");
                }
            }


            this.map.put(JSON.stringify(condition), command);

            return condition;

        },


        /**
         * Returns whether or not a given state has an epsilon transition; 
         * @method 
         * @param {Machine.State} state The condition state
         * @return {Boolean} True if this state 
         * 
         */
        hasEpsilonTransition: function(state){
            return this.getEpsilonMap().containsKey(JSON.stringify(state)); 
        },


        /**
         * Returns the condition for an epsilon transition for a given state; 
         * @method
         * @param {Machine.State} state The condition state
         * @return {Machine.Condition} The condition or null
         */
        getEpsilonTransitionCondition: function(state){ 
            return this.getEpsilonMap().get(JSON.stringify(state)); 
        },


        /**
         * Removes a transition from the mapping by its domain element.
         * @method
         * @param  {Machine.Condition} condition The condition to remove
         */
        removeTransitionByCondition: function(condition) {

            if(this.hasEpsilonTransition(condition.getState()) == true) { 
                this.getEpsilonMap().remove(JSON.stringify(condition.getState())); 
            }

            this.map.remove(JSON.stringify(condition));
        },


        /**
         * Get the command for this condition.
         * @method 
         * @param  {Machine.Condition} condition  The conditions
         * @return {Machine.command}           The command
         */
        getCommand: function(condition) {
            if (this.map.containsKey(JSON.stringify(condition)) == false && this.requireTotal == true) {
                throw "Missing transition condition.";
            }

            return this.map.get(JSON.stringify(condition));
        },

        /**
         * Retrieves the alphabet for this transition function.
         * @method
         * @return {Machine.Alphabet} The alphabet.
         */
        getAlphabet: function() {
            return this.alphabet;
        },

        /**
         * Retrieves the require total property. If this property
         * is true, the {@link Machine.TransitionFunction.getCommand} function
         * throws an error if it is missing a condition key. OTherwise, it returns 
         * null on a key miss.
         * @method 
         * @return {Boolean} True if the function is required to be total.
         */
        getRequireTotal: function() { 
            return this.requireTotal; 
        }, 


        /**
         * Sets the require total property. If this property
         * is true, the {@link Machine.TransitionFunction.getCommand} function
         * throws an error if it is missing a condition key. OTherwise, it returns 
         * null on a key miss.
         * @method 
         * @param {Boolean} requireTotal The require total property
         */
        setRequireTotal: function(requireTotal) { 
            this.requireTotal = requireTotal;
        }, 



        /**
         * Retrieves the state table for the transition function.
         * @method
         * @return {Machine.StateTable} The state table.
         */
        getStateTable: function() {
            return this.stateTable;
        },

        /**
         * Retrieves the list of the conditions mapped by the transition function.  I.e. this retrieves the domain of the function.
         * @method
         * @return {Array} An array of {@link Machine.Condition} objects.
         */
        getConditions: function() {
            var list = this.map.keys();
            var toReturn = [];
            for (var i = 0; i < list.length; i++) {


                var obj = JSON.parse(list[i]);
                var state = new Machine.State({
                    label: obj.state.label,
                    isAccepting: obj.state.isAccepting,
                });

                var condition = new Machine.Condition({
                    state: state,
                    character: obj.character, 
                    stackElement: obj.stackElement
                });
                toReturn[i] = condition;
            }
            return toReturn;


        },

        /**
         * Sets the alphabet for this transition function. 
         * Be  cautious using this function as it provides no internal validation for consistency. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /**
         * Sets the state table for the transition function. 
         * Be cautious using this fuction as it provides no interna validation for consistency.
         * @param {Machine.StateTable} stateTable The state table
         */
        setStateTable: function(stateTable) {
            this.stateTable = stateTable;
        },


        /**
         * A useful method which returns the state of the transition function as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        getTransitionDescriptions: function() {
            var descriptions = [];

            this.map.each(function(key, val) {
                var result = JSON.parse(key);
                var str = "(" + result.state.label + ":" + result.character + ")" + "->" + val.toString();

                descriptions.push(str);
            });
            return descriptions;

        }, 

        /**
         * A useful method which returns the transition function as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function(highlightCondition) {
            var s = ""; 
            var conditions = this.getConditions().reverse(); 
            for(var i = 0; i < conditions.length; i++){ 
                var condition = conditions[i]; 
                var command = this.getCommand(condition); 
                if (condition.getState().getLabel() == highlightCondition.getState().getLabel() &&
                    condition.getCharacter() == highlightCondition.getCharacter() && condition.getStackElement() == highlightCondition.getStackElement())
                 { 
                    s += Machine.ANSI.invert("(" + condition.characterDisplay() + ":"  + command.characterDisplay() + ")"); 
                } else {
                    s += "(" + condition.characterDisplay()  + ":"  + command.characterDisplay()  + ")"; 
                }

            }

            return s + "\n"; 

        }

    };



})();