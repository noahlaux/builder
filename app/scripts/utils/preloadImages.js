/*global define*/
define([
    'jquery'
], function( $ ) {

    'use strict';

    /**
     * Preload images and invoke a callback
     *
     * @param  {Array}   images   [description]
     * @param  {Function} callback [description]
     * @return N/A
     */
    return function ( images, callback ) {

        // Local reference
        var _images = images;

        $( images ).each( function() {
            $( '<img>' )
                .attr({ src: this })
                .load( handleLoad )
                .error( handleLoad );
        });

        function handleLoad() {

            // Delete entry from checklist
            _images.splice( _images.indexOf( this.src ), 1 );

            // If we're at last image
            if ( _images.length === 0 ) {
                callback();
            }

        }

    };
});