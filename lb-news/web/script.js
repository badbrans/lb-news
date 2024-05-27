document.getElementById('button-back').addEventListener('click', () => {
	document.getElementById('form').style.display = 'none'
	document.getElementById('body').style.display = 'block'
	document.getElementById('detailsbody').style.display = 'none'
	document.getElementById('form-update').style.display = 'none'
})
document.getElementById('button-add').addEventListener('click', () => {
	document.getElementById('body').style.display = 'none'
	document.getElementById('form').style.display = 'block'
	document.getElementById('form-update').style.display = 'none'
})

window.addEventListener('load', function (e) {
	document.getElementById('body').innerHTML = ``
	document.getElementById('custom-style').innerText = ''
	$.post('https://lb-news/getLocales', JSON.stringify({}), function (locales) {
		console.log("load style and text")
		document.getElementById('add-title').innerText = locales.FORM_TITLE_ADD
		document.getElementById('update-title').innerText = locales.FORM_TITLE_UPDATE
		document.getElementById('title-news-add').setAttribute("placeholder", locales.PLACEHOLDERS.ADD.TITLE)
		document.getElementById('description-news-add').setAttribute("placeholder", locales.PLACEHOLDERS.ADD.DESCRIPTION)
		document.getElementById('message-news-add').setAttribute("placeholder", locales.PLACEHOLDERS.ADD.MESSAGE)
		document.getElementById('title-news-update').setAttribute("placeholder", locales.PLACEHOLDERS.UPDATE.TITLE)
		document.getElementById('description-news-update').setAttribute("placeholder", locales.PLACEHOLDERS.UPDATE.DESCRIPTION)
		document.getElementById('message-news-update').setAttribute("placeholder", locales.PLACEHOLDERS.UPDATE.MESSAGE)
		document.getElementById('button-updatenews').innerText = locales.BUTTONS.UPDATE
		document.getElementById('button-addnews').innerText = locales.BUTTONS.ADD

		document.getElementById('app-title').innerText = locales.APP.TITLE
		document.getElementById('custom-style').innerText = `
			#update-title {
				color: ${locales.THEME.APP_COLOR} !important;
			}
			#add-title {
				color: ${locales.THEME.APP_COLOR} !important;
			}

			#details-title {
				color: ${locales.THEME.APP_COLOR} !important;
				display: block !important;
				width: 100% !important;
				text-align: center !important;
				margin-bottom: 20px !important;
				font-size: x-large !important;
			}
			#details-description {
				color: ${locales.THEME.APP_COLOR} !important;
				display: block !important;
				width: 100% !important;
				text-align: center !important;
				margin-bottom: 20px !important;
				font-size: x-large !important;
			}
			#details-message {
				color: ${locales.THEME.APP_COLOR} !important;
				display: block !important;
				width: 100% !important;
				text-align: center !important;
				margin-bottom: 20px !important;
				font-size: x-large !important;
			}
			#title-news-add {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			}
			#description-news-add {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important; 
			}
			#message-news-add {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			} 
			#photo-news-add {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			}

			#title-news-update {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			}
			#description-news-update {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			}
			#message-news-update {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			}
			#photo-news-update {
				background-color: ${locales.THEME.FORMINP_BACKGROUND} !important;
				color: ${locales.THEME.FORMINP_COLOR} !important;
			}

			.app {
				width: 100%;
				height: 100%;
				background-color: ${locales.THEME.APP_BACKGROUND} !important;
			}
			.row-title {
				background-color: ${locales.THEME.HEADER_BACKGROUND} !important;
			}
			.button-add {
				color: ${locales.THEME.HEADER_COLOR} !important;
			}
			.button-back {
				color: ${locales.THEME.HEADER_COLOR} !important;
			}
			.button-validate {
				background-color: ${locales.THEME.ADD_BACKGROUND} !important;
				color: ${locales.THEME.ADD_COLOR} !important;
			}
			.button-update {
				background-color: ${locales.THEME.UPDATE_BACKGROUND} !important;
				color: ${locales.THEME.UPDATE_COLOR} !important;
			}
		`
		console.log("style done")
	})


	$.post('https://lb-news/getDatas', JSON.stringify({}), function (data) {
		addNewsHtml(data)
	})
})

function addNewsHtml(data) {
	document.getElementById('detailsbody').innerHTML = ``
	if (data.canEdit == false) {
		document.getElementById('button-add').style.display = 'none'
	}
	if (data.news.length == 0) {
		document.getElementById('body').innerHTML += `
		<div class="card">
			<p class="card-title">Pas de news en vue</p>
			<p class="card-description">Revenez quand les reporter en posteront</p>
			<p class="card-message"></p>
		</div>
		`
	} else {
		for (let i = 0; i < data.news.length; i++) {
			if (data.canEdit) {
				let image_html = ``
				if (data.news[i].image_url != null) {
					image_html = `<img src="${data.news[i].image_url}" width="200px" height="150">`
				}
				document.getElementById('body').innerHTML += `
				<div class="card">
					<div class="row" style="height: 150px">
						${image_html}
						<p class="card-title" style="width: 200px;">${data.news[i].title}</p>
					</div>
					<button class="button-delete" id="button-delete" onclick="Deletenews(${data.news[i].id})"><img src="assets/delete.png" class="icon"></button>
					<button class="button-edit" id="button-edit" onclick="Editnews(${i}, ${data.news[i].id})"><img src="assets/edit.png" class="icon"></button>
					<button class="button-details" id="button-details" onclick="viewDetails('${data.news[i].title}', '${data.news[i].description}', '${data.news[i].message}', '${data.news[i].image_url}', ${data.news[i].id}, ${data.news[i].likes})"><img src="assets/details.png" class="icon"></button>
				</div>
				`
			} else {
				let image_html = ``
				if (data.news[i].image_url != null) {
					image_html = `<img src="${data.news[i].image_url}" width="200px" height="150">`
				}
				document.getElementById('body').innerHTML += `
				<div class="card">
					<div class="row" style="height: 150px">
						${image_html}
						<p class="card-title" style="width: 200px;">${data.news[i].title}</p>
					</div>
					<button class="button-details" id="button-details" onclick="viewDetails('${data.news[i].title}', '${data.news[i].description}', '${data.news[i].message}', '${data.news[i].image_url}', ${data.news[i].id}, ${data.news[i].likes})"><img src="assets/details.png" class="icon"></button>
				</div>
				`
			}
		}
	}
}

function viewDetails(title, description, message, image_url, news_id, news_like) {
	document.getElementById('detailsbody').innerHTML = ``
	let image_html = ``
	if (image_url != null) {
		image_html = `<img src="${image_url}" width="100%" height="200px">`
		document.getElementById('detailsbody').innerHTML += `
			${image_html}
			<p class="details-title" id="details-title" style="width: 100%;">${title}</p>
			<p class="details-description" id="details-description" style="width: 100%;">${description}</p>
			<p class="details-message" id="details-message" style="width: 100%;">${message}</p>
			<button class="button-like" id="button-like" onclick="likeNews(${news_id})"><span class="span-like"><img src="assets/like.png" class="icon-like"><span id="span-like-count">${news_like}</span></span></button>
			`
	} else {
		document.getElementById('detailsbody').innerHTML += `
			${image_html}
			<p class="details-title" id="details-title" style="width: 100%;">${title}</p>
			<p class="details-description" id="details-description" style="width: 100%;">${description}</p>
			<p class="details-message" id="details-message  " style="width: 100%;">${message}</p>
			<button class="button-like" id="button-like" onclick="likeNews(${news_id})"><span class="span-like"><img src="assets/like.png" class="icon-like"><span id="span-like-count">${news_like}</span></span></button>
		`
	}
	document.getElementById('form').style.display = 'none'
	document.getElementById('body').style.display = 'none'
	document.getElementById('detailsbody').style.display = 'block'
	document.getElementById('form-update').style.display = 'none'
}

function likeNews(news_id) {
	$.post('https://lb-news/likeNews', JSON.stringify({ id: news_id }), function (liked) {
		console.log(JSON.stringify(liked))
	})
}

var data_img = {
	title: "",
	description: "",
	message: "",
	url: ""
}
document.getElementById('photo-news-add').addEventListener('click', () => {
	$.post('https://lb-news/add-photos', JSON.stringify({}), function (url) {
		data_img.url = url
	})
})
document.getElementById('button-addnews').addEventListener('click', () => {
	let title = document.getElementById('title-news-add').value
	let description = document.getElementById('description-news-add').value
	let message = document.getElementById('message-news-add').value
	$.post('https://lb-news/addNews', JSON.stringify({ title: title, description: description, message: message, image_url: data_img.url }), function (added) {
		if (added) {
			$.post('https://lb-news/refresh', JSON.stringify({}), function (data) {
				document.getElementById('body').innerHTML = ""
				addNewsHtml(data)
				document.getElementById('form').style.display = 'none'
				document.getElementById('body').style.display = 'block'
			})
		}
	})
})

function Deletenews(id_news) {
	$.post('https://lb-news/deleteNews', JSON.stringify({ id: id_news }), function (data) {
		if (data) {
			$.post('https://lb-news/getDatas', JSON.stringify({}), function (data) {
				document.getElementById('body').innerHTML = ``
				addNewsHtml(data)
			})
		}
	})
}
let id_to_update = null
function Editnews(index, id_news) {
	$.post('https://lb-news/getDatas', JSON.stringify({}), function (data) {
		id_to_update = id_news
		document.getElementById('body').style.display = 'none'
		document.getElementById('form').style.display = 'none'
		document.getElementById('form-update').style.display = 'block'
		if (data_img.url == '') {
			data_img.url = data.news[index].image_url
		}
		document.getElementById('title-news-update').value = data.news[index].title
		document.getElementById('description-news-update').value = data.news[index].description
		document.getElementById('message-news-update').value = data.news[index].message
	})
}
document.getElementById('button-updatenews').addEventListener('click', () => {
	let title = document.getElementById('title-news-update').value
	let description = document.getElementById('description-news-update').value
	let message = document.getElementById('message-news-update').value
	$.post('https://lb-news/updateNews', JSON.stringify({ title: title, description: description, message: message, image_url: data_img.url, id: id_to_update }), function (updated) {
		if (updated) {
			$.post('https://lb-news/refresh', JSON.stringify({}), function (data) {
				document.getElementById('body').innerHTML = ""
				addNewsHtml(data)
				document.getElementById('form').style.display = 'none'
				document.getElementById('form-update').style.display = 'none'
				document.getElementById('body').style.display = 'block'
			})
		}
	})
})
