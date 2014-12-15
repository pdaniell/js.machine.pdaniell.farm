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


(function() {

    var Machine = {
        version: '0.0.1',
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
     * An alphabet for a machine.
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration literal.
     * @param {String} [attribs.chars] A string containing all the characters in the alphabet
     * @param {String} attribs.blank The blank character
     * @param {Boolean} [attribs.unrestricted=false] A flag which lets all characters to be used in the alphabet. A blank character must still be specified but the chars property will be ignored. 
     **/
    Machine.Alphabet = function(attribs) {
        this._init(attribs);
    }

    Machine.Alphabet.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs.hasOwnProperty("unrestricted") && 
                    attribs.unrestricted == true){ 
                this.unrestricted = true; 
            } else { 
                this.unrestricted = false;
            }

            this.blank = attribs.blank;
            if (this.blank.length != 1) {
                throw new Error("Blank character must have length 1");
            }

            if(attribs.hasOwnProperty("chars")){
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
         * A method to verify whether the argument character is within 
         * the alphabet. If the <pre><code>unrestricted</code></pre> property is 
         * set, the method does nothing more than check that the input is
         * a single character
         * 
         * @method 
         * @param {String} character A string of length 1. 
         * @return {Boolean} True if contained.
        **/
        contains: function(character) {

            if(this.unrestricted == true){
                if (character.length == 1){
                    return true; 
                } else {
                    return false; 
                }

            }

            if (this.alphabetSet.contains(character)){
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
     * A binary notation with characters '0' and '1'. The blank character is '0'.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.TALLY_NOTATION = new Machine.Alphabet({blank:"0", chars:"01"}); 

    /**
     * An unrestricted alphabet where any character can be used. The blank character
     * is the space character.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.UNRESTRICTED = new Machine.Alphabet({blank: " ", unrestricted:true});
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
     * @param {String} character The character the machine is reading.
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

        },

        // Public Methods
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
         * @param {Machine.State} state The condition sate.
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
            if(this.action == null){
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
            if(Machine.Command.isValidAction(action) == true) { 
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
            if(this.argument == null){
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
        removeArgument: function(){
            this.argument = null; 
        }

    };



    var MOVE_RIGHT =

        /** 
         * The machine action to move right on a tape.
         * @constant
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.MOVE_RIGHT = "0";

    var MOVE_LEFT =

        /**
         * The machine action to move left on a tape.
         * @constant
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.MOVE_LEFT = "1";

    var ERASE =

        /**
         * The machine action to erase the current cell on the tape.
         * @costant
         * @type {Object}
         * @memberOf  Machine.Command
         */ 
        Machine.Command.ERASE = "3";

    var WRITE =

        /**
         * The machine action to write a character to the cell on the tape. 
         * (Usually requires an argument.)
         * @constant
         * @type {Object}
         * @memberOf Machine.Command
         */
        Machine.Command.WRITE = "4";


    var NOOP =

        /**
         * The machine action to do nothing
         * @constant
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.NOOP = "5";


    /**
     * The hashset whih contains all the official machine actions. 
     * @constant
     * @type {Machine.HashSet}
     * @memberOf  Machine.Command
     */
    Machine.Command.ActionSet = new Machine.HashSet();
    Machine.Command.ActionSet.add(Machine.Command.MOVE_RIGHT);
    Machine.Command.ActionSet.add(Machine.Command.MOVE_LEFT);
    Machine.Command.ActionSet.add(Machine.Command.ERASE);
    Machine.Command.ActionSet.add(Machine.Command.WRITE);
    Machine.Command.ActionSet.add(Machine.Command.NOOP);

    /** 
     * A static method which assesses whether an object is a valid action.
     * @method 
     *  @memberof Machine.Command
     **/
    Machine.Command.isValidAction = function(command) {
        return Machine.Command.CommandSet.contains(command);
    };


})();
(function() {

    /**
     *
     * This class represents a Deterministic Finite State Automaton (DFA). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Deterministic_finite_automaton}
     * and also suggestions for fruther reading.
     *
     * @class FSA Finite State Automaton
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration
    
     **/
    Machine.FSA = function(attribs) {
        this._init(attributes);
    };



    Machine.FSA.prototype = {

        // Private Methods
        _init: function(attribs) {
            this.validate = attribs.validate;
            this.setAlphabet(attribs.alphabet);
            this.stateTable = new Machine.StateTable();

            this.stateTable.add(attribs.initialState);
            this.setInitialState(attribs.initialState);
            this.currentState = attribs.initialState;
            this.inputString = "";
            this.inputIndex = 0;

            this.tape = new Machine.Tape({
                alphabet: attribs.alphabet,
                chars: ""
            });

            this.transitionFunction = new Machine.TransitionFunction({
                alphabet: this.alphabet,
                stateTable: this.stateTable
            });
        },

        //Public Methods

        /** @method **/
        getAlphabet: function() {
            return this.alphabet;
        },

        /** @method **/
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },


        /** @method **/
        addState: function(state) {
            this.stateTable.add(state);
        },

        /** @method **/
        setInitialState: function(initialState) {
            if (this.stateTable.contains(state) == false) {
                throw new Error("Initial State is not in State Table");
            }

            this.initialState = initialState;

        },

        /** @method **/
        getInitialState: function() {
            return this.initialState;
        },

        /** @method **/ 
        getCurrentState: function(){  
            return this.currentState; 
        }, 

        /** @method **/
        reset: function() {
            this.currentState = this.getInitialState();
            this.inputIndex = 0;
        },

        /** @method **/
        setInput: function(input) {
            this.input = input;

        },

        /** @method **/
        getInput: function() {
            return this.input;
        },

        /** #method **/
        setInputIndex: function(inputIndex) {
            this.inputIndex = inputIndex;
        },

        /** @method **/ 
        incrementInputIndex: function() { 

        },

        /** @method **/
        getInputIndex: function() {
            return this.inputIndex;
        },

        /** @method **/
        getCurrentCharacter: function() {
            return this.getInput(this.getInputIndex());
        },


        /** @method **/
        addTransition: function(currentState, currentCharacter, transitionState){
            var condition = new Machine.Condition({
                state: currentState,
                character:currentCharacter
            }); 

            var command = new Machine.Command({state:transitionState});
            this.transitionFunction.add(condition, command);
        }, 


        /** @method **/ 
        step: function() { 
            var currentCharacter = this.getCurrentCharacter(); 
            var currentState = this.getCurrenState(); 

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
     * @param {Boolean} isAccepting A flag indicating the state is an accepting state.
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
            var state = this.getStateFromLabel(label);
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
        getStateFromLabel: function(label) {
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
        characterDisplay: function() {
            var s = "";

            s = s + "|| Control: ";

            for (var controlKey in this.controlStates.keys()) {
                s = s + controlKey + " | ";
            }

            s = s + "\n || Accepting: ";


            for (var acceptKey in this.acceptingStates.keys()) {
                s = s + acceptKey + " | ";
            }

            s = s + "\n ";

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
            if(attribs.hasOwnProperty("alphabet")){
                this.setAlphabet(attribs.alphabet); 
            } else{ 
                this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            if(attribs.hasOwnProperty("chars")) {
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

            this.chars = StringUtils.replaceCharAt(this.chars, pos, c);
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
            for (var i = 0; i < this.chars.length; i++) {
                s = s + "=====";
            }

            s = s + "\n";

            //tape contents
            s += "|";
            for (var i = 0; i < this.chars.length; i++) {
                var character = this.chars.charAt(i);
                s = s + " " + character;
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
     * @params {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet for the transition function.
     *
     **/
    Machine.TransitionFunction = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype = {
        // Private Methods
        _init: function(attribs) {
            
            //this is where we will ulimately map conditions to commands
            this.map = new Machine.HashTable();

            if(attribs.hasOwnProperty("stateTable")){
                this.stateTable = attribs.stateTable;
            } else {
                this.stateTable = new Machine.StateTable(); 
            }

            if(attribs.hasOwnProperty("alphabet")){
                this.alphabet = attribs.alphabet; 
            } else {
                this.stateTable = new Machine.Alphabet.UNRESTRICTED;
            }


        },


        // Public Methods
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


            this.map.put(JSON.stringify(condition), command);

            return condition;

        },

        /**
         * Removes a transition from the mapping by its domain element.
         * @method
         * @param  {Machine.Condition} condition The condition to remove
         */
        removeTransitionByCondition: function(condition) {
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

                var obj = $.parseJSON(list[i]);
                var state = new State({
                    label: obj.state.label,
                    isAccepting: obj.state.isAccepting,
                    x: obj.state.x,
                    y: obj.state.y,
                    w: obj.state.w,
                    h: obj.state.h,
                    isVisible: obj.state.isVisible
                });

                var condition = new Condition({
                    state: state,
                    character: obj.character
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

        }
    };



})();