require.config({
    paths: {
        templates: '../templates',
        text: '../components/requirejs-text/text',
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        knockout: '../components/knockout/build/output/knockout-latest',
        'knockout-mapping': '../components/knockout-mapping/knockout.mapping',
        underscore: '../components/underscore/underscore'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'underscore': {
            exports: '_'
        },
        knockout: {
            exports: 'ko'
        }
    }
});

require([

    'app',
    'jquery',

    // Modules
    'modules/heading/heading',
    'modules/image-list/image-list',
    'bootstrap',
    'utils/stringTemplates'

], function ( app, $, Heading, ImageList ) {

    'use strict';

    app.init({
        container: '.app',
        modules: {
            'heading': Heading,
            'imageList': ImageList
        }
    });

});
