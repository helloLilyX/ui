/**
 * Simple ass AJAX lookup
 *
 * Compatible with Bootstrap 4.0.0a4
 *
 * Usage:
 *
 *  $('.form-lookup').Lookup({
 *      url: 'source url'
 *  });
 *
 * Also accepts Bootstrap-style data attributes:
 *  data-provide="lookup" to enable on an input
 *  data-url="https://..." to bind a url
 *  ... etc
 *
 * Note that this expects the backend to conform to JSON-API spec.
 *
 * Upstream query will be:
 *      GET {url}?q={term}
 *      Accept: application/vnd.api+json
 *
 * Downstream responses expect to be formatted as:
 *      200 OK
 *      Content-Type: application/vnd.api+json
 *      {
 *           "meta": {
 *               "total": 55
 *           },
 *           "data": [
 *               {
 *                   "type": "person",
 *                   "id": "200275154",
 *                   "attributes": {
 *                       "title": "McManning, Chase"
 *                   }
 *               }
 *           ]
 *       }
 *
 * It can also supply an access token to the ORIS API through the
 * `token` parameter. Just make sure your token has the correct
 * permissions before attempting to perform lookup against an endpoint.
 */
;(function ($) {

    // var NAME = 'lookup';
    // var DATA_KEY = 'lookup';
    // var EVENT_KEY = '.lookup';
    // var DATA_API_KEY = '.data-api';
    // var JQUERY_NO_CONFLICT = $.fn[NAME];

    // var EVENTS = {
    //     CLICK_DATA_API: 'click'+EVENT_KEY+DATA_API_KEY
    // };

    var VERSION = '1.0.0';

    var DEFAULTS = {
        url: null,                      // Endpoint URL to request AJAX data from

        display: 'attributes.title',    // AJAX object attribute to display in the input upon select

        store: 'id',                    // AJAX object attribute to submit alongside the form.
                                        // If null, whatever is in the lookup input will be
                                        // submitted with the form.

        threshold: 3,                   // Minimum characters required before a search is started

        readonly: true,                 // Whether to go readonly once something is selected

        token: null                     // ORIS-API bearer token, if known.
    };

    /**
     * Utility function to resolve dot notation paths to JSON records.
     *
     * Source: http://stackoverflow.com/a/6394168
     */
    function _resolvePath(path, obj) {
        return path.split('.').reduce(function(o, i) { return o[i]; }, obj);
    }

    var Lookup = function(element, options) {
        $.data(element, 'lookup', this);

        this.o = options;
        this.element = $(element);

        // Configuration and whatnot
        console.log(options.url);

        this._setupDOM();
        this._attachEvents();
    };

    Lookup.prototype = {
        constructor: Lookup,

        _attachEvents: function() {
            this.element.on('keyup', $.proxy(this._change, this));
            this.results.on('click', 'a', $.proxy(this._select, this));
            this.addon.on('click', $.proxy(this.clear, this));
        },

        _setupDOM: function() {

            var $parent = this.element.parent();

            // Setup a hidden input for storing selection data
            if (this.o.store) {
                var name = this.element.attr('name');
                this.store = $('<input type="hidden" name="'+name+'">');

                this.element.attr('name', '');
                $parent.after(this.store);
            }

            this.addon = this.element.next('.input-group-addon');

            this.results = $('<div class="list-group lookup-results"/>');
            $parent.after(this.results);
        },

        _change: function() {

            // Ignore change events if we're readonly
            if (this.element.is('[readonly]')) {
                return;
            }

            var term = this.element.val();
            if (term.length >= this.o.threshold) {
                this.search(term);
            } else {
                this.results.html('');
            }
        },

        _select: function(e) {
            var json = $(e.target).data('json');

            this.element.val(_resolvePath(this.o.display, json));
            this.results.html('');

            this.element.focus();

            // Readonly mode enabled? Disable the input
            if (this.o.readonly) {
                this.element.attr('readonly', 'readonly');
                this.addon.html(
                    '<i class="fa fa-close" aria-hidden="true"></i>'
                );
            }

            // Store key in hidden input, if we choose to do so
            if (this.o.store) {
                this.store.val(_resolvePath(this.o.store, json));
            }

            e.preventDefault();
            return false;
        },

        clear: function(e) {
            this.results.html('');
            this.element.val('');
            this.element.focus();

            if (this.o.readonly) {
                this.element.removeAttr('readonly');
                this.addon.html(
                    '<i class="fa fa-search" aria-hidden="true"></i>'
                );
            }

            if (this.o.store) {
                this.store.val('');
            }

            if (e) {
                e.preventDefault();
            }

            return false;
        },

        search: function(term) {

            this.addon.html(
                '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
            );

            // TODO: Replace mock with actual ajax
            var self = this;
            setTimeout(function() {

                self.addon.html(
                    '<i class="fa fa-search" aria-hidden="true"></i>'
                );

                self._displayResults({
                    meta: {
                        total: 56
                    },
                    data: [
                        {
                            type: "person",
                            id: "junk",
                            attributes: {
                                title: term
                            }
                        },
                        {
                            type: "person",
                            id: "200275154",
                            attributes: {
                                title: "McManning, Chase"
                            }
                        },
                        {
                            type: "person",
                            id: "123456789",
                            attributes: {
                                title: "Ray, John"
                            }
                        }
                    ]
                });
            }, 1000);
        },

        _displayResults: function(json) {
            this.results.html('');

            for (var i = 0; i < json.data.length; i++) {
                this.results.append(
                    $('<a href="#" class="list-group-item list-group-action">' +
                        _resolvePath(this.o.display, json.data[i]) +
                        '</a>'
                    ).data('json', json.data[i])
                );
            }

            if (json.meta && json.meta.total) {
                this.results.append(
                    '<div class="lookup-total">There are <strong>' +
                    (json.meta.total - json.data.length) +
                    '</strong> additional results. Please narrow your search</div>'
                );
            }
        }
    };

    ////////////////////////////
    // jQuery Plugin Interface
    ////////////////////////////

    var plugin = function(option) {
        var args = Array.apply(null, arguments);
        args.shift();

        var ret;
        this.each(function () {
            var $this = $(this),
                data = $this.data('lookup'),
                options = typeof option === 'object' && option;

            if (!data) {
                // Options priority: js args, data-api, defaults
                var opts = $.extend({}, DEFAULTS, $this.data(), options);

                data = new Lookup(this, opts);
                $this.data('', data);
                ret = data;
            }

            if (typeof option === 'string' && typeof data[option] === 'function') {
                ret = data[option].apply(data, args);
            }
        });

        if (ret === undefined || ret instanceof Lookup) {
            return this;
        }

        return ret;
    };

    $.fn.lookup = plugin;
    $.fn.lookup.defaults = DEFAULTS;
    $.fn.lookup.Constructor = Lookup;
    $.fn.lookup.version = VERSION;

    // Fire off construction of any lookups using data-api immediately
    $(document).on(
        'click.lookup.data-api',
        '[data-provide="lookup"]',
        function (e) {
            var $this = $(this);
            if ($this.data('lookup')) {
                return;
            }

            e.preventDefault();
            plugin.call($this, {});
        });

}( jQuery ));
