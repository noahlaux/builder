 /*global define*/

/**
 * Generic module with helpers
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'knockout'

], function( $, _, ko ) {

	'use strict';

    var extend = function( protoProps, staticProps ) {
        var parent = this;
        var child = function(){ return parent.apply(this, arguments); };

        _.extend( child, parent, staticProps );

        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();


        if ( protoProps) {
            _.extend(child.prototype, protoProps);
        }

        child.__super__ = parent.prototype;

        return child;
    };

	var Module = function( attributes, options ) {
        this.initialize.apply( this, arguments );
    };

    _.extend( Module.prototype, {

        /**
         * Element to output module markup
         * @type {HTML object}
         */
        el: null,

        /**
         * Element to hold editor for element
         * @type {HTML object}
         */
        elEditor: null,

        /**
         * [initialize description]
         * @return {[type]} [description]
         */
        initialize: function() {
            console.log('module prototype init, write your own man!');
        },

        /**
         * Render module
         * @return {[type]} [description]
         */
        render: function() {

            if ( this.data.el() ) {

                var $element    = $( this.data.el() ).eq( 0 ),
                    $module     = $( this.template );

                $element.append( $module );

                ko.applyBindings( this.data, $module[0] );
            }

        }
    });

    Module.extend = extend;

    return Module;

});