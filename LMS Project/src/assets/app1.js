var idleTime;
if (document.location.pathname == "/login") {
   $(document).ready(function () {
         reloadPage();
        $('html').bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
            clearTimeout(idleTime);
            reloadPage();
        });
});
function reloadPage() {
    clearTimeout(idleTime);
    idleTime = setTimeout(function () {
    window.location.href = '/login';
}, 2000000);
}
}
else {
   $(document).ready(function () {
         reloadPage();
        $('html').bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
            clearTimeout(idleTime);
            reloadPage();
        });
});
function reloadPage() {
    clearTimeout(idleTime);
    idleTime = setTimeout(function () {
        window.location.href = '/login';
    }, 2000000);
}
}