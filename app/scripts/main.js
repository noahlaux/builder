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
        }
    }
});

require([

    'app',
    'jquery',
    'bootstrap',
    'utils/stringTemplates'

], function ( app, $ ) {

    'use strict';

    app.init();

});