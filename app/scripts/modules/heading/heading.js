/*global define*/

/**
 * List
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 1.0
 */

define([

    // Libs
    'knockout-mapping',

    'utils/viewmodel',

    // templates
    'text!./heading.html'

], function( mapping, ViewModel, heading ) {

    'use strict';

    var viewModel = ViewModel.extend({

        /**
         * [defaults description]
         *
         * @type {Object}
         */
        defaults: {

            /**
             * Module type
             * @type {String}
             */
            type: 'heading',

            /**
             * Text for heading
             * @type {String}
             */
            text: 'title with <a target="_blank" href="http://flickr.com">link</a>',

            /**
             * Turns visibility on/off
             * @type {Boolean}
             */
            show: true
        },

        /**
         * Template for view model
         * @type {String}
         */
        template: heading,

        /**
         * Initialize
         * @return N/A
         */
        initialize: function( options ) {

            this.data = mapping.fromJS( this.defaults );

            // Mapping data from app
            mapping.fromJS( options, this.data );

            this.render();

        }
    });

    return viewModel;

});
