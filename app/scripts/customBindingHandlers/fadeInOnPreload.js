/*global define*/

/**
 * Fade in
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 1.0
 */

define([

    // libs
    'jquery',
    'knockout',

    'utils/preloadImages'

], function( $, ko, preloadImages ) {

    'use strict';

    ko.bindingHandlers.fadeInOnPreload = {

        'update': function( element, valueAccessor, allBindingsAccessor, viewModel ) {

            var $element    = $( element ),
                images      = $.map( valueAccessor(), function( item ) {
                                return item.imageUrl;
                            });

            $element.parent().height( $element.outerHeight( true ) );

            $element.hide();

            viewModel.isFetching( true );

            preloadImages( images, function() {
                viewModel.isFetching( false );
                $element.fadeIn( 'slow', function() {
                    $element.parent().height( 'auto' );
                });
            });

        }
    };
});