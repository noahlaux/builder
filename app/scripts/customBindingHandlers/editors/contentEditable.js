/*global define*/
define([

    'jquery',
    'knockout'

], function( $, ko ) {

    'use strict';

    ko.bindingHandlers.contentEditable = {

        /**
         * [init description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @param  {[type]} viewModel           [description]
         * @return {[type]}                     [description]
         */
        init: function( element, valueAccessor, allBindingsAccessor, viewModel ) {

            $( element ).attr({
                'contenteditable': true
            }).on({
                'click': function( e ) {
                    $( e.currentTarget ).closest( '.module' ).removeAttr( 'draggable' );
                }
            });

            ko.utils.registerEventHandler( element, 'blur', function() {
                var modelValue      = valueAccessor(),
                    elementValue    = element.innerHTML;

                if ( ko.isWriteableObservable( modelValue ) ) {
                    modelValue( elementValue );
                }

                else { //handle non-observable one-way binding
                    var allBindings = allBindingsAccessor();
                    if ( allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
                }
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
            var value = ko.utils.unwrapObservable( valueAccessor() ) || '';
            element.innerHTML = value;
        }

    };

});