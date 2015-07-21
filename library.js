/**
 * Created by Actck on 7/20/2015 10:47 PM.
 * Contact by actck@hotmail.com
 * Git to view by https://github.com/actck
 */
(function(CDN){
	"use strict";
	var meta = module.parent.require('./meta');

	var rep_tag_a = /<a href="\/uploads\/files\/(.+)"(.*)>(.+)<\/a>/g;
	var rep_tag_img = /<img src="\/uploads\/files\/(.+)"(.*)\/>/g;
	var rep_pf_pic_url = /^\/uploads\/profile\/(.+)/;

	CDN.config = {};

	CDN.onLoad = function(params ,callback) {
		function render(req, res, next) {
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
		callback();
	};

	CDN.admin = {
		menu : function(custom_header,callback) {
			custom_header.plugins.push({
				route: '/plugins/cdn',
				icon: 'fa-picture-o',
				name: 'CDN'
			});
			callback(null, custom_header);
		}
	};

	//parse post content in topic page
	CDN.parsePostContent = function(data, callback) {

		if (CDN.config.enable !== '1' || !data || !data.postData || !data.postData.content) {
			return callback(null, data);
		}

		//console.log('post content-->' + data.postData.content);

		if (data.postData.content.match(rep_tag_a)) {
			var aUrl_r = '<a href="' + CDN.config.url + '/uploads/files/$1"$2>$3</a>';
			data.postData.content = data.postData.content.replace(rep_tag_a, aUrl_r);
		}
		if (data.postData.content.match(rep_tag_img)) {
			var imgUrl_r = '<img src="' + CDN.config.url + '/uploads/files/$1"$2/>';
			data.postData.content = data.postData.content.replace(rep_tag_img, imgUrl_r);
		}
		callback(null, data);
	};

	//parse poster info in topic page
	CDN.parsePoster = function(data, callback) {
		if (CDN.config.enable !== '1' || !data || !data) {
			return callback(null, data);
		}

		//console.log("poster info-->" + JSON.stringify(data));

		var url = CDN.config.url + '/upload/profile/$1';
		if(data.picture && data.picture.match(rep_pf_pic_url)) {
			data.picture = data.picture.replace(rep_pf_pic_url, url);
		}

		callback(null, data);
	};

	//parse "account/profile" page
	CDN.parseProfilePage = function(data, callback) {
		if (CDN.config.enable !== '1' || !data || !data.userData) {
			return callback(null, data);
		}

		//console.log("profile info-->" + JSON.stringify(data.userData));

		var url = CDN.config.url + '/upload/profile/$1';

		if(data.userData.picture && data.userData.picture.match(rep_pf_pic_url)) {
			data.userData.picture = data.userData.picture.replace(rep_pf_pic_url, url);
		}
		if(data.userData.uploadedpicture && data.userData.uploadedpicture.match(rep_pf_pic_url)) {
			data.userData.uploadedpicture = data.userData.uploadedpicture.replace(rep_pf_pic_url, url);
		}
		if(data.userData.posts) {
			for(var pKey in data.userData.posts) {
				var poster = data.userData.posts[pKey].user;
				if(poster && poster.picture && poster.picture.match(rep_pf_pic_url)) {
					data.userData.posts[pKey].user.picture = poster.picture.replace(rep_pf_pic_url, url);
				}
			}
		}

		callback(null, data);
	}

	//parse user info every where
	CDN.parseUser = function(data, callback) {
		if (CDN.config.enable !== '1' || !data) {
			return callback(null, data);
		}

		console.log("parseUser info-->" + JSON.stringify(data));

		var url = CDN.config.url + '/upload/profile/$1';
		for(var uKey in data) {
			var user = data[uKey];
			if(user && user.picture && user.picture.match(rep_pf_pic_url)) {
				data[uKey].picture = user.picture.replace(rep_pf_pic_url, url);
			}
		}
		callback(null, data);
	};

	CDN.parseTest = function(data, callback) {
		/*		if (CDN.config.enable !== '1' || !data || !data) {
		 return callback(null, data);
		 }*/

		console.log("test info-->" + JSON.stringify(data));

		/*var url = CDN.config.url + '/upload/profile/$1';
		 if(data.picture && data.picture.match(rep_pf_pic_url)) {
		 data.picture = data.picture.replace(rep_pf_pic_url, url);
		 }*/

		callback(null, data);
	};



})(module.exports);