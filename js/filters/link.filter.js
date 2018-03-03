// Create link icons out of urls in text
var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
angular.module('cycloneApp').filter('createLink', function($sce) {
    function linkify(text) {
        // Make sure only urls are progressed (no other text)
        var urls = text.match(urlRegex);
        var link = '';
        // Generate links out of the urls
        if (urls) {
            angular.forEach(urls, function(url) {
                link += url.replace(urlRegex, function(url) {
                    return '<a target="_blank" tabindex="-1" title="' + url + '" href="' + url + '"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#000000" d="M16,6H13V7.9H16C18.26,7.9 20.1,9.73 20.1,12A4.1,4.1 0 0,1 16,16.1H13V18H16A6,6 0 0,0 22,12C22,8.68 19.31,6 16,6M3.9,12C3.9,9.73 5.74,7.9 8,7.9H11V6H8A6,6 0 0,0 2,12A6,6 0 0,0 8,18H11V16.1H8C5.74,16.1 3.9,14.26 3.9,12M8,13H16V11H8V13Z" /></svg></a>';
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

// Show only the last part of the URL (not edit)
angular.module('cycloneApp').filter('filterLastWord', function($sce) {
    // For url replace we need an escaped value of the URL:
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    return function(text) {
        if (!text) return;

        // Make sure only urls are progressed (no other text)
        var urls = text.match(urlRegex);
        var link = '';
        var shortLinkText = text;
        // Limit displayed text of URLs
        if (urls) {
            angular.forEach(urls, function(url) {
                // Get the last part after the last slash
                link = url.split("/").splice(-1);
                shortLink = '<i>' + link[0] + '</i>';
                // Replace the long link with the short word on the text
                shortLinkText = shortLinkText.replace(new RegExp(escapeRegExp(url)), shortLink);
            });
        }
        //return shortLinkText;
        return $sce.trustAsHtml(shortLinkText);
    }
});