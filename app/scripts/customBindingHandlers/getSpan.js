/*global define*/
define([

    'jquery',
    'knockout'

], function( $, ko ) {

    'use strict';

    ko.bindingHandlers.getSpan = {

        /**
         * [init description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @param  {[type]} viewModel           [description]
         * @return {[type]}                     [description]
         */
        init: function( element, valueAccessor, allBindingsAccessor, viewModel ) {

            var $element    = $( element ),
                field       = valueAccessor();

            $element.on('click', function() {

                // Hide original element
                $element.hide();

                var $editElement = $('<input class="builder-editor-field" data-bind="value: ' + field + '" input="text"/>');

                // Clone CSS from old object
                $editElement.css( {
                    'width': $element.css( 'width' ),
                    'font-size': $element.css( 'font-size' ),
                    'font-weight': $element.css( 'font-weight'),
                    'font-family': $element.css( 'font-family' ),
                    'color': $element.css( 'color' ),
                    'background': $element.css( 'background' )
                });

                $element.before( $editElement );

                $editElement.focus();

                ko.applyBindings( viewModel, $editElement[0] );

            });
        },
        /**
         * [update description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @return {[type]}                     [description]
         */
        update: function(element, valueAccessor, allBindingsAccessor) {

            var $element = $( element );

            // Hide editor fields
            $element
                .parent().find('.builder-editor-field').remove();
            $element.show();

        }

    };

});