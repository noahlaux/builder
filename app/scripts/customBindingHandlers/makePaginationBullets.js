/*global define*/
define([

    'jquery',
    'underscore',
    'knockout'

], function( $, _, ko ) {

    'use strict';

    ko.bindingHandlers.makePaginationBullets = {

        /**
         * [init description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @param  {[type]} viewModel           [description]
         * @return {[type]}                     [description]
         */
        init: function( element, valueAccessor, allBindingsAccessor, viewModel ) {

            var value = ko.utils.unwrapObservable( valueAccessor() ) || 0;

            $( element ).find( 'li' )
                .first()
                .after( getPaginationElements( value, value + 9, viewModel ) );

        },
        /**
         * [update description]
         * @param  {[type]} element             [description]
         * @param  {[type]} valueAccessor       [description]
         * @param  {[type]} allBindingsAccessor [description]
         * @return {[type]}                     [description]
         */
        update: function( element, valueAccessor, allBindingsAccessor, viewModel ) {
            console.log(viewModel.currentPage());
            // var $element    = $( element ),
            //     value       = ko.utils.unwrapObservable( valueAccessor() ) || '',
            //     index       = $element.find( 'li' ).index( $element.find( 'li.active' ) ),
            //     newElements;

            // if ( index > 8 ) {
            //     newElements = getPaginationElements( value, value + 9, viewModel );
            // } else if ( index === 1 && value % 9 === 0 ) {
            //     newElements = getPaginationElements( value - 8, value + 1, viewModel );
            // }

            // if ( newElements ) {

            //     $element.find('.pagination-bullet').remove();

            //     $element.find( 'li' )
            //         .first()
            //         .after( newElements );

            // }

        }

    };

     /**
     * [getPaginationElements description]
     * @param  {Integer} from      [description]
     * @param  {Integer} to        [description]
     * @param  {Object} viewModel [description]
     * @return {Array}           [description]
    */
    function getPaginationElements( from, to, viewModel ) {

        return _.map( _.range( from, to ), function( i ) {
            var $element = $( '<li class="pagination-bullet" data-bind="css: { active: currentPage() == currentPage() + ' + i + ' - (  currentPage() % 10 ) }"><a href="#" data-bind="html: currentPage() + ' + i + ' - ( currentPage() % 9 )"></a></ul>' )
                .on({
                    'click': function( e ) {

                        e.preventDefault();
                        viewModel.currentPage( i );
                    }
                });

            ko.applyBindings( viewModel,  $element[ 0 ] );

            return $element;
        });
    }


});