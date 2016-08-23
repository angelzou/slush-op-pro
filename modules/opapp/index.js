/**
 * <%= authorName %>
 * <%= authorEmail %>
 */
if (typeof jQuery != 'undefined' && typeof window[jQuery.widgetName] === 'object') {
    (function($) {
        $.extend(window[jQuery.widgetName], {
            // 入口函数
            initAdmin: function() {
                var self = this;

            }
        });
    })(window.jQuery || window.$);
}
