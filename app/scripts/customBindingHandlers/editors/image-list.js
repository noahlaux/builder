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

            var $element    = $( element );
            var $button  = $('<a href="#" class="edit-button btn"><i class="icon-edit"></i></a>');

            $element.prepend( $button );

            var $editElement = $( $.parseHTML( imageListEditor ) );

            $('body').append( $editElement );

            $button.on( 'click', function( e ) {
                var $target = $( e.currentTarget );

                $editElement.css({
                    top: $target.offset().top + 'px',
                    left: $target.offset().left + 'px'
                });

                $editElement.find('form').fadeToggle('fast');
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