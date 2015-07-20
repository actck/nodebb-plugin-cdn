/**
 * Created by Administrator on 7/19/2015.
 */
(function(CDN){
	"use strict";

	CDN.onLoad = function(params ,callback)
	{
		function render(req, res, next)
		{
			//template file name
			res.render('admin/plugins/cdnf', {});
		}

		params.router.get('/admin/plugins/cdn', params.middleware.admin.buildHeader, render);
		params.router.get('/api/admin/plugins/cdn', render);

		console.log(123);
		callback();
	};

	CDN.admin =
	{
		menu : function(custom_header,callback)
		{
			custom_header.plugins.push({
				route: '/plugins/cdn',
				icon: 'fa-picture-o',
				name: 'CDN'
			});
			callback(null, custom_header);
		}
	};



})(module.exports);