/**
 * Created by actck on 7/7 0007.
 */
define('admin/plugins/cdn', ['settings'], function(Settings) {
    var CDN = {};
	CDN.init = function() {
        Settings.load('cdn', $('.cdn-settings'), function(err, settings) {
            for(var setting in settings) {
				$('#' + setting).val(settings[setting]);
            }
        });

        $('#save').on('click', function(event) {
            Settings.save('cdn', $('.cdn-settings'), function() {
                app.alert({
                    type: 'success',
                    title: 'Reload Required',
                    message: 'Please reload your NodeBB to have your changes take effect',
                    clickfn: function() {
                        socket.emit('admin.reload');
                    }
                })
            });
        });
    };

    return CDN;
});