/*global define */
define([

    // Libs
    'jquery',
    'underscore',
    'knockout',
    'knockout-mapping',

    'utils/google-analytics',

    'viewModels/modules/image-list',
    'viewModels/modules/heading',
    'viewModels/editors',

    // Layouts
    'text!templates/layouts/default.html',

    // Handlers
    'customBindingHandlers/editors'

], function ( $, _, ko, mapping, GA, ImageList, Heading, Editors, defaultLayout ) {

    'use strict';

    /**
     * [app description]
     * @type {Object}
     */
    var app = {

        /**
         * [gridColumns description]
         * @type {Number}
         */
        gridColumns: 12,

        /**
         * [defaultItemsPrRow description]
         * @type {Number}
         */
        defaultItemsPrRow: 4,

        /**
         * [items description]
         * @type {[type]}
         */
        items: ko.observableArray([]),

        /**
         * [showBoundingBoxes description]
         * @type {[type]}
         */
        showBoundingBoxes: ko.observable( true ),

        /**
         * [layouts description]
         * @type {Object}
         */
        layouts: {
            'default': defaultLayout
        },
        /**
         * Bind available render types
         *
         * @type {Object}
         */
        renderTypes: {
            'imageList': ImageList,
            'heading': Heading
        },

        /**
         * [load description]
         * @return {[type]} [description]
         */
        load: function( options ) {

            return $.ajax({
                url: options.url,
                success: $.proxy( this.renderLayout, this ),
                error: function( err ) {
                    throw( err );
                }
            });

        },

        /**
         * [renderLayout description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        renderLayout: function( data ) {

            var self    = this,
                $layout = $( this.layouts[ data.layout ] );

            // Prepend layout
            $('body > .app').html( $layout );

            // Layout could have knockout sweetness applied to app
            ko.applyBindings( self, $layout[ 0 ] );

            // Render all modules
            var items = _.map( data.items, function( item ) {
                return self.parseRenderType( item );
            });

            // Store all modules for later manipulation and CRUD operations
            self.items( items );

            $('#getData').on('click', function( e ) {
                console.log( $.parseJSON( mapping.toJSON( self.items ) ) );
            });
        },

        /**
         * [parseRenderType description]
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        parseRenderType: function( item ) {

            if ( this.renderTypes[ item.type ] ) {
                return new this.renderTypes[ item.type ]( item );
            } else {
                throw('No RenderType "' + item.type + '" is defined in app');
            }

        },

        /**
         * [init description]
         * @return {[type]} [description]
         */
        init: function() {

            var self = this;

            // Setup google analytics
            GA({ account: null });

            this.showBoundingBoxes.subscribe( function( value ) {
                if ( value ) {
                    $('.placeholder').removeClass( 'no-bounding-box' );
                } else {
                    $('.placeholder').addClass( 'no-bounding-box' );
                }
            });

            // Load data from server
            this.load({
                url:'data/test.json'
            });

            //var bindings = $.extend({}, imageList, imageList2, { app: app } );

            //ko.applyBindings( bindings );

        }
    };

    return app;

});