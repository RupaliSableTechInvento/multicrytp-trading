var Dashboard = {};
((function() {

    this.init = function() {
        _render.content();
    }

    var _core = {

    }
    var _bind = {
        changedNav_Tab: function() {
            $(headerElms.dashboard_menus + '> div').unbind().click(function() {
                $(headerElms.dashboard_menus + '> div').removeClass('active_tab');
                $(this).addClass('active_tab');
            });

        }

    }

    var _render = {
        content: function() {
            renderMainFrame('templates/user/dashboard.html', 'dashboard', function() {
                console.log("entered dashboard");
                _bind.changedNav_Tab()
            })
        }
    }
}).bind(Dashboard))()