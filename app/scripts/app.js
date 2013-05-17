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
         * [isDragging description]
         * @type {Boolean}
         */
        isDragging: ko.observable( false ),

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
         * [init description]
         * @return {[type]} [description]
         */
        init: function() {

            var self = this;

            this.$el = $( this.el );

            // Required for drag and drop access
            $.event.props.push( 'dataTransfer' );

            // Setup google analytics
            GA({ account: null });

            this.$el.parent().append( $('<div class="dragGhostContainer" />') );

            this.isDragging.subscribe( function( value ) {

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
            this.load({
                    url:'data/test.json'
                })
                .done( $.proxy( this.renderLayout, this ) );

            //var bindings = $.extend({}, imageList, imageList2, { app: app } );

            //ko.applyBindings( bindings );

        },

        /**
         * [load description]
         * @return {[type]} [description]
         */
        load: function( options ) {

            return $.ajax({
                url: options.url,
                error: function( err ) {
                    throw( err );
                }
            }).promise();

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
            ko.applyBindings( self, $layout[ 0 ] );

            // Render all modules
            var items = _.map( data.items, function( item ) {
                return self.parseRenderType( item );
            });

            // Make placeholders droppable
            this.makeDroppable( this.$el.find( '.placeholder' ) );

            // Store all modules for later manipulation and CRUD operations
            self.items( items );

            $('#getData').on('click', function( e ) {

                var data = $.map( self.items(), function( item ) {
                    return item.data;
                });

                console.log( $.parseJSON( mapping.toJSON( data ) ) );
            });
        },

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

        /**
         * [parseRenderType description]
         * @param  {Object} item [description]
         * @return {Object}
         */
        parseRenderType: function( item ) {

            if ( this.renderTypes[ item.type ] ) {
                return new this.renderTypes[ item.type ]( item, { app: this } );
            } else {
                throw('No RenderType "' + item.type + '" is defined in app');
            }

        }
    };

    return app;

});