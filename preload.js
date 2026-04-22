window.searchGoogle = function (query) {
    const url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    window.location.href = url;
};
