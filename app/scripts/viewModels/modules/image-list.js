/*global define*/

/**
 * List
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 1.0
 */

define([

    // Libs
    'jquery',
    'underscore',
    'knockout',
    'knockout-mapping',

    'utils/viewmodel',
    'utils/flickr',

    // templates
    'text!templates/modules/image-list.html',
    'text!templates/modules/image-list-item.html',

    // Binders
    'customBindingHandlers/fadeInOnPreload',
    'customBindingHandlers/getSpan'

], function( $ , _, ko, mapping, ViewModel, Flickr, imageList, imageListItem ) {

    'use strict';

    ko.templates[ 'image-list-item' ] = imageListItem;

    var viewModel = ViewModel.extend({

        /**
         * [defaults description]
         *
         * @type {Object}
         */
        defaults: {

            /**
             * [id description]
             * @type {String}
             */
            type: 'imageList',

            /**
             * [title description]
             * @type {String}
             */
            title: 'title with <a target="_blank" href="http://flickr.com">flickr</a>',

            /**
             * [showTitle description]
             * @type {Boolean}
             */
            showTitle: true,

            /**
             * Array of items used as dataprovider
             * @type {Array}
             */
            items: [],

            /**
             * [showImageList description]
             * @type {Boolean}
             */
            showImageList: true,

            /**
             * Available options per page to chose from (1 - 30)
             * @type {Array}
             */
            itemsPrPageOptions: (function() {

                var options = [];

                for ( var i = 1; i < 31; i++ ) {
                    options.push( i );
                }

                return options;

            })(),

            /**
             * Items to retreave from server to do pagination
             * Set by change in itemsPerPageOptions getting selected
             * @type {Array}
             */
            itemsPrPage: 12,

            /**
             * Currents page for pagination
             * @type {Number}
             */
            currentPage: 1,

            /**
             * [showPagination description]
             * @type {Boolean}
             */
            showPagination: true,

            /**
             * [itemsPrRow description]
             * @type {Number}
             */
            itemsPrRow: 4,

            /**
             * Show titles on template
             * @type {Boolean}
             */
            showCaptions: true,

            /**
             * [search description]
             * @type {String}
             */
            search: '',

            /**
             * Indicates if module is fetching data
             * @type {Boolean}
             */
            isFetching: false,
             /**
             * Available image services
             * @type {Object}
             */
            imageServices: {

                /**
                 * Contains named options to user
                 * @type {Array}
                 */
                options: [ 'flickr' ],

                /**
                 * Currently selected image service provider
                 * @type {String}
                 */
                selected: 'flickr'
            },

            /**
             * [getSpan description]
             *
             * @return {[type]} [description]
             */
            getSpan: function( index ) {
                // TODO get columns (12) from app settings
                var span = 'span' + parseInt( 12 / this.itemsPrRow(), 10 );
                return ( ( index + 1 ) % this.itemsPrRow() === 0 ) ? span + ' last' : span;
            },

            /**
             * Go to next page
             * @return N/A
             */
            nextPage: function() {
                this.currentPage( this.currentPage() + 1 );
            },

            /**
             * Go to previous page
             * @return N/A
             */
            previousPage: function() {
                if ( this.currentPage() > 1 ) {
                    this.currentPage( this.currentPage() - 1 );
                }
            }
        },

        /**
         * [template description]
         * @type {[type]}
         */
        template: imageList,

        /**
         * [init description]
         * @return {[type]} [description]
         */
        initialize: function( options ) {

            var self        = this,
                fetchProxy  = $.proxy( this.fetch, this );

            // Refecth if fields change
            // TODO could be made more modular and smart? and should'nt be cloned, but defaults are overwritten

            this.data = mapping.fromJS( this.defaults );

            // Mapping data from app
            mapping.fromJS( options, this.data );

            _.each( this.refetchOn, function( item ) {

                // Handle local variable subscriptions
                if ( item.substring( 0, 4 ) === 'this' ) {
                    // TODO This is baaaaaad! How to invoke? self[ item.substr(5) ] no goodz!
                    eval( 'self.' + item.substr( 5 ) ).subscribe( fetchProxy );
                }

            }, this );

            this.fetch();

            this.render();

        },

        refetchOn: [
            'this.data.search',
            'this.data.itemsPrPage',
            'this.data.currentPage',
            'this.data.imageServices.selected'
        ],

        /**
         * Render editor
         * @return {[type]} [description]
         */
        renderEditor: function() {

            if ( this.elEditor ) {

                var $element = $('<form class="well" data-bind="template: { name: \'image-list-editor\' }"></form>');
                // Insert editors
                this.elEditor.append( $element );
                ko.applyBindings( this.data, $element[0] );
            }
        },

        /**
         * [refetch description]
         * @return {[type]} [description]
         */
        fetch: function() {

            var self = this;

            this.data.isFetching( true );

            // fetch data from the selected image provider
            if ( self.methodBindings[ this.data.imageServices.selected() ] ) {

                var serviceProvider = self.methodBindings[ this.data.imageServices.selected() ];

                serviceProvider.search( mapping.toJS( self.data ), function( items ) {
                    self.data.isFetching( false );
                    self.data.items( items );
                });

            } else {
                throw( 'image service provider: ' + this.data.imageServices.selected() + ' does not exists' );
            }

        },

        /**
         * Bind the name to the service provider class module
         * @type {Object}
         */
        methodBindings: {
            'flickr': new Flickr({ 'api_key': 'da430e07b1a66e95b9fede7896098d99' })
        }
    });

    return viewModel;

});