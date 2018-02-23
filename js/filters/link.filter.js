// Filter out specific types of entries
angular.module('cycloneApp').filter('filterLink', function($sce) {
    function linkify(text) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        // Make sure only urls are progressed (no other text)
        var urls = text.match(urlRegex);
        var link = '';
        // Generate links out of the urls
        if (urls) {
            angular.forEach(urls, function(url) {
                link += url.replace(urlRegex, function(url) {
                    return '<a target="_blank" title="' + url + '" href="' + url + '"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#000000" d="M16,6H13V7.9H16C18.26,7.9 20.1,9.73 20.1,12A4.1,4.1 0 0,1 16,16.1H13V18H16A6,6 0 0,0 22,12C22,8.68 19.31,6 16,6M3.9,12C3.9,9.73 5.74,7.9 8,7.9H11V6H8A6,6 0 0,0 2,12A6,6 0 0,0 8,18H11V16.1H8C5.74,16.1 3.9,14.26 3.9,12M8,13H16V11H8V13Z" /></svg></a>';
                });
            });
            return link;
        }
    }

    return function(text) {
        if (!text) return;
        return $sce.trustAsHtml(linkify(text));
    };
});