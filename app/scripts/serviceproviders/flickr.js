/*global define*/

/**
 * Builder Flickr image service provider plugin
 *
 * @author Noah Laux (noahlaux@gmail.com)
 * @version 0.3
 */

define([

    'underscore',
    'utils/ajax'

], function( _, ajax ) {

    'use strict';

    var module = function ( options ) {

        if ( options.api_key ) {
            this.api_key = options.api_key;
        } else {
            throw( 'you should provide api_key from flickr' );
        }

        // Check if we should go with custom method
        this.method = options.method || 'flickr.photos.search';
    };

    module.prototype = {

        /**
         * Name of service provider
         * @type {String}
         */
        name: 'Flickr',

        /**
         * Description of service provider
         * @type {String}
         */
        description: 'Retrives images from Flickr',

        /**
         * [type description]
         * @type {String}
         */
        type: 'image',

        /**
         * Service URL
         *
         * @type {String}
         */
        url: 'https://api.flickr.com/services/rest/?jsoncallback=?',

        /**
         * Default settings
         *
         * @type {Object}
         */
        defaults: {
            'format': 'json',
            'per_page': 24,
            'page': 1
        },

        /**
         * Methods to expose publically
         * TODO refractor to publicMethods
         * @type {Array}
         */
        methods: ['search'],

        /**
         * [search description]
         *
         * @param  {Object} options [description]
         * @return N/A
         */
        search: function( options, callback ) {

            var self = this;

            options = _.extend( this.defaults, {
                'api_key': self.api_key,
                'method': self.method,
                'per_page': options.itemsPrPage,
                page: options.currentPage,
                text: options.search
            });

            ajax.fetch( this.url, options )
                .done( function( data ) {
                    callback( self.serialize( data ));
                })
                .fail( function( err ) {
                    throw( err );
                });

        },

        /**
         * Serialize data
         *
         * @param  {[type]} data [description]
         * @param  {String} size Flickr image sizes
         * @return {Array} Photos
         */
        serialize: function( data, size ) {

            return _.map( data.photos.photo, function( photo ) {
                return {
                    'id': photo.id,
                    'title' : photo.title,
                    'imageUrl' : 'http://farm{0}.static.flickr.com/{1}/{2}_{3}_{4}.jpg'
                        .replace('{0}', photo.farm)
                        .replace('{1}', photo.server)
                        .replace('{2}', photo.id)
                        .replace('{3}', photo.secret)
                        .replace('{4}', size || 'q'),
                    'link' : 'http://www.flickr.com/photos/{0}/{1}/'
                        .replace('{0}', photo.owner)
                        .replace('{1}', photo.id)
                };
            });
        }
    };

    return module;

});
