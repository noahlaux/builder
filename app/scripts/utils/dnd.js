 /*global define*/

/**
 * Builder Flickr image service provider plugin
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 0.3
 */

define([
    'app',
    'jquery'

], function( app, $ ) {

    'use strict';

    var module = {
        dragstart: function( e ) {
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

            $('.dragGhostContainer').html( $placeHolderClone ).show();

            var x = $placeHolderClone.width() / 3.2,
                y = $placeHolderClone.height() / 3;

            e.dataTransfer.setDragImage( $placeHolderClone[0], x, y );
            // originalEvent.dataTransfer.addElement( this );

            app.dragged = {
                originalEvent: e,
                viewModel: self
            };

            app.isDragging( true );

            // Apply style to original object
            $( this ).addClass( 'cloned easeinout-quick' );

            return true;
        }
    };

    return module;
});