/*global define*/
define([
    'jquery',
    'knockout',

    // Templates
    'text!templates/image-list-editor.html'

], function( $, ko, imageListEditor ) {

    'use strict';

    ko.templates[ 'image-list-editor' ] = imageListEditor;

    ko.bindingHandlers.imageListEditor = {

        /**
         * [init description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @param  {[type]} viewModel           [description]
         * @return {[type]}                     [description]
         */
        init: function( element, valueAccessor, allBindingsAccessor, viewModel ) {

            var $element        = $( element ),
                $button         = $('<a href="#" class="edit-button btn easeinout"><i class="icon-edit"></i></a>'),
                $editElement    = $( $.parseHTML( imageListEditor ) );

            $element.prepend( $button );

            $('body').append( $editElement );

            $button.on( 'click', function( e ) {

                var $target = $( e.currentTarget );

                e.preventDefault();

                $target.parent().toggleClass( 'editing' );

                $editElement
                    .toggleClass( 'editing easeinout' )
                    .css({
                        top: $target.offset().top + 'px',
                        left: $target.offset().left + 'px'
                    });

            });

            // Apply data binding to template
            ko.applyBindings( viewModel, $('body').find( $editElement )[0] );

        },

        /**
         * [update description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @return {[type]}                     [description]
         */
        update: function(element, valueAccessor, allBindingsAccessor) {

        }

    };

});
