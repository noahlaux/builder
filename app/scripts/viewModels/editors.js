/*global define*/

/**
 * List
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 1.0
 */

define([

    'app',

    // Libs
    'jquery',
    'knockout',

    // templates
    'text!templates/general-options.html'

], function( app, $ , ko, generalOptionsTemplate ) {

    'use strict';

    ko.templates[ 'general-options' ] = generalOptionsTemplate;

    return function ( options ) {

        var module = {

            /**
             * [el description]
             * @type {[type]}
             */
            el: options.el || null,

            /**
             * [items description]
             * @type {[type]}
             */
            items: ko.observableArray([]),

            /**
             * [isFetching description]
             * @type {Boolean}
             */
            isFetching: ko.observable( false ),

            /**
             * [init description]
             * @return {[type]} [description]
             */
            init: function() {
                this.render();
            },

            /**
             * Render module
             * @return {[type]} [description]
             */
            render: function() {

                if ( this.el ) {
                    // Insert editors
                    var $module = $( generalOptionsTemplate );

                    this.el.append( $module );

                    ko.applyBindings( options.app, $module[0] );
                }

                //ko.applyBindings( bindings );
            },

        };

        return module;

    };

});