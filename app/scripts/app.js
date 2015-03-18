/*global define */
define([

    // Libs
    'jquery',
    'underscore',
    'knockout',
    'knockout-mapping',

    // Utils
    'utils/google-analytics',
    'utils/ajax',

    // Service providers
    'serviceproviders/flickr',

    // Modules
    'viewModels/editors',

    // Layouts
    'text!templates/layouts/default.html',

    // Handlers
    'customBindingHandlers/editors'

], function ( $, _, ko, mapping, GA, ajax, Flickr, Editors, defaultLayout ) {

    'use strict';

    /**
     * [app description]
     * @type {Object}
     */
    var app = {

        /**
         * App element container
         * @type {String}
         */
        el: 'body > .app',

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
         * Modules
         * @type {Array}
         */
        modules: ko.observableArray([]),

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
         * [isDragging description]
         * @type {Boolean}
         */
        isDragging: ko.observable( false ),

        /**
         * Bind available render types
         * TODO make into plugin structure instead
         *
         * @type {Object}
         */
        renderTypes: {},

        /*
         * Declare service providers
         * @type {Object}
         */
        serviceProviders: {
            //da430e07b1a66e95b9fede7896098d99
            //3b6a149c5134322e51adf74d4336d5cd
            //8655c21a10049e5b06ea18df2cf6ba15

            'Flickr': new Flickr({ 'api_key': '8655c21a10049e5b06ea18df2cf6ba15' })
        },

        /**
         * [init description]
         * @return {[type]} [description]
         */
        init: function( options ) {

            var self = this;

            self.$el = $( self.el );

            self.renderTypes = options.modules || {};

            // Required for drag and drop access
            $.event.props.push( 'dataTransfer' );

            // Setup google analytics
            GA({ account: null });

            // Make ghost container
            // TODO find a better solution
            self.$el.parent().append( $('<div class="dragGhostContainer" />') );

            self.isDragging.subscribe( function( value ) {

                var $layout       = self.$el.find('.layout'),
                    $placeholders = $layout.find( '.placeholder' );

                if ( value ) {
                    $layout.addClass( 'dragging' );
                    $placeholders.addClass( 'bounding-placeholder' );
                } else {
                    $layout.removeClass( 'dragging' );
                    $placeholders.removeClass( 'bounding-placeholder' );
                }
            });

            // Load data from server
            ajax.fetch('data/test.json')
                .done( $.proxy( self.renderLayout, self ) );

            //var bindings = $.extend({}, imageList, imageList2, { app: app } );

            //ko.applyBindings( bindings );

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
            this.$el.html( $layout );

            // Layout could have knockout sweetness applied to app
            // TODO doesn't seem to work?
            ko.applyBindings( self, $layout[ 0 ] );

            // Store all modules for later manipulation and CRUD operations
            self.modules( self.renderModules( data.items ) );

            // Make placeholders droppable
            this.makeDroppable( this.$el.find( '.placeholder' ) );

            $('#getData').on('click', function( e ) {

                var data = $.map( self.modules(), function( module ) {
                    return module.data;
                });

                console.log( $.parseJSON( mapping.toJSON( data ) ) );
            });
        },

        /**
         * Render all modules
         * @param  {Array} modules
         * @return {Array}
         */
        renderModules: function ( modules ) {
            var self = this;
            return _.map( modules, function( module ) {
                return self.parseRenderType( module );
            });

        },

        /**
         * [parseRenderType description]
         * @param  {Object} module [description]
         * @return {Object}
         */
        parseRenderType: function( module ) {

            if ( !this.renderTypes[ module.type ] ) {
                throw('RenderType "' + module.type + '" is not defined/loaded');
            }

            return new this.renderTypes[ module.type ]( module, { app: this } );
        },

        /**
         * [ description]
         * @param  {[type]} $elements [description]
         * @return {[type]}           [description]
         */
        makeDroppable: function( $elements ) {

            var self                = this,
                $modules            = self.$el.find('.module'),
                $currentPlaceholder = {};

            $elements.add( $modules ).addClass('easeinout');

            $elements.on({
                'drop': $.proxy( this.drop, this ),
                'dragenter': function() {

                    $currentPlaceholder = $( this );

                    self.$el.find( '.placeholder.drag-over' ).removeClass( 'drag-over' );
                    this.classList.add( 'drag-over' );

                    if ( self.$el.find( '.row-fluid' ).index( $currentPlaceholder.closest( '.row-fluid' ) ) === 1 ) {
                        this.scrollIntoView( true );
                    } else {
                        this.scrollIntoView( false );
                    }
                },
                'dragover': function( e ) {

                    if ( e.preventDefault ) {
                        e.preventDefault();
                    }

                    var $target          = $( e.originalEvent.target ),
                        $currentModule   = $target.closest('.module');

                    //$(self.dragged.originalEvent.currentTarget).addClass('animated bounceIn');
                    if ( $currentModule.length > 0 ) {

                        var moduleSplitPoint = $currentModule.position().top + ( $currentModule.height() / 2 );


                        if ( e.originalEvent.pageY < moduleSplitPoint ) {
                            $currentModule.before( self.dragged.originalEvent.currentTarget );
                        } else {
                            $currentModule.after( self.dragged.originalEvent.currentTarget );
                        }
                    }

                    $modules.removeClass('dragover top');

                    $currentModule.addClass('drag-over top');
                    //e.originalEvent.dataTransfer.dropEffect = 'move';

                    return false;
                },
                'dragleave': function( e ) {
                    //debugger;
                    // if ( e.currentTarget !==  self.activePlaceholder ) {
                    //     this.classList.remove( 'placeholder-drag-over' );
                    //     console.log('funk')
                    // }
                    //console.log(this);
                }
            });
        },

        drop: function( e ) {

            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }

            var draggedViewModel    = this.dragged.viewModel,
                draggedTarget       = this.dragged.originalEvent.currentTarget,
                placeholderTarget   = e.currentTarget,
                targetIndex         = $('.placeholder').index( placeholderTarget );

            draggedViewModel.data.el( '.placeholder:eq(' + targetIndex + ')' );

            //$( placeholderTarget ).append( draggedTarget );

            this.$el.find( '.placeholder.drag-over' ).removeClass( 'drag-over' );
            $('.dragGhostContainer').hide();
            $( draggedTarget ).removeClass('cloned');

            this.isDragging( false );

            return false;
        },

    };

    return app;

});
