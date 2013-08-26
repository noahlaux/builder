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

        var parent  = this,
            child   = function(){
                return parent.apply(this, arguments);
            };

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
        this.app = options.app;

        this.$el = $( attributes.el );
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

            if ( this.$el ) {

                var $element = this.$el.eq( 0 ),
                    $module  = $( this.template );

                $element.append( $module );

                ko.applyBindings( this.data, $module[ 0 ] );
            }

            if ( this.afterRender ) {
                this.afterRender();
            }

        },

        afterRender: function() {

            var self = this;

            // Make modules draggable
            this.$el.find( '.module' )
                .attr( 'draggable', true )
                .on({
                    'dragstart': function( e ) {

                        //originalEvent.dataTransfer.setData( 'data', JSON.stringify( e.currentTarget ) );
                        // originalEvent.dataTransfer.setData('text/builder', originalEvent.target.dataset.value);
                        // originalEvent.dataTransfer.effectAllowed = 'move'; // only allow moves
                        // originalEvent.dataTransfer.items.add(e);

                        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
                        e.dataTransfer.setData('Text', 'Text' );

                        var $element            = $( this ),
                            $clone              = $element.clone().addClass( 'clone' ),
                            $placeHolderClone   = $element.parent().parent().clone().addClass( 'well clone-wrapper' );

                        $placeHolderClone
                            .html( $clone )
                            .css({
                                width: $element.width(),
                                height: $element.height()
                            });

                        $('.dragGhostContainer')
                            .html( $placeHolderClone )
                            .show();

                        var x = $placeHolderClone.width() / 3.2,
                            y = $placeHolderClone.height() / 3;

                        e.dataTransfer.setDragImage( $placeHolderClone[0], x, y );
                        // originalEvent.dataTransfer.addElement( this );

                        self.app.dragged = {
                            originalEvent: e,
                            viewModel: self
                        };

                        self.app.isDragging( true );

                        // Apply style to original object
                        $( this ).addClass( 'cloned easeinout-quick' );

                        return true;
                    },
                    'drag': function() {
                        // TODO really bad solution
                        $('.dragGhostContainer').hide();
                    }
                });
        }
    });

    Module.extend = extend;

    return Module;

});
