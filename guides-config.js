// Hub guide articles — add new entries here
window.hubGuides = [
    {
        title: 'How to Beat 2048',
        url: 'https://2048hub.com/guides/how-to-beat-2048/'
    },
    {
        title: '10 Best 2048 Variants in 2026',
        url: 'https://2048hub.com/guides/10-2048-variants-2026/'
    }
];

window.renderHubGuides = function(container) {
    if (!container || !window.hubGuides || !window.hubGuides.length) return;

    container.innerHTML = window.hubGuides.map(function(guide, index) {
        var sep = index > 0 ? '<span class="hub-guides-sep" aria-hidden="true"> · </span>' : '';
        return sep + '<a href="' + guide.url + '">' + guide.title + '</a>';
    }).join('');
};
