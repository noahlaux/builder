/*global define*/
define([], function() {

    'use strict';

    var module ={
        /**
         * Initialize
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        init: function( options ) {

            if ( !options.account ) {
                console.error('You should provide an account id for GA');
                return false;
            }

            var _gaq=[['_setAccount', options.account],['_trackPageview']];

            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));

        }
    };

    return module.init;
 });