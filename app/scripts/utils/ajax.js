 /*global define*/

/**
 * Ajax loader
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 1
 */

define([
    'jquery'
], function( $ ) {

    'use strict';

    return {

        /**
         * Fetch data
         *
         * @param {Object} options
         * @return {Object} deffered
         */
        fetch: function( url, options ) {

            return $.ajax({
                url: url,
                data: options,
                dataType: 'json'
            }).promise();
        }

    };

});
