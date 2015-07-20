/**
 * Created by Administrator on 7/19/2015.
 */
(function(CDN){
	"use strict";
	var meta = module.parent.require('./meta');

	var aUrl = /<a href="\/uploads\/files\/(.+)"(.*)>(.+)<\/a>/g;
	var imgUrl = /<img src="\/uploads\/files\/(.+)"(.*)\/>/g;

	CDN.config = {};

	CDN.onLoad = function(params ,callback) {

		function render(req, res, next)
		{
			//template file name
			res.render('admin/plugins/cdn', {});
		}

		params.router.get('/admin/plugins/cdn', params.middleware.admin.buildHeader, render);
		params.router.get('/api/admin/plugins/cdn', render);
		meta.settings.get("cdn",function(err,options) {
			if(err) {
				return callback(new Error(err))
			}
			CDN.config.url = options['url'];
			CDN.config.enable = options['enable'];
		});

		console.log(123);
		callback();
	};

	CDN.admin = {

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

	CDN.parse = function(data, callback) {

		if (CDN.config.enable !== '1' || !data || !data.postData || !data.postData.content) {
			return callback(null, data);
		}

		console.log('p1');

		console.log(data.postData.content);

		if (data.postData.content.match(aUrl)) {
			console.log('p2');
			var aUrl_r= '<a href="' + CDN.config.url + '/uploads/files/$1"$2>$3</a>';
			data.postData.content = data.postData.content.replace(aUrl, aUrl_r);
		}
		if (data.postData.content.match(imgUrl)) {
			console.log('p2');
			var imgUrl_r= '<img src="' + CDN.config.url + '/uploads/files/$1"$2/>';
			data.postData.content = data.postData.content.replace(imgUrl, imgUrl_r);
		}

		callback(null, data);
	}

})(module.exports);