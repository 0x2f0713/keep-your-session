/* FileSaver.js */
var saveAs = saveAs || function (t) {
	"use strict";
	if (!(void 0 === t || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
		let e = function () {
				return t.URL || t.webkitURL || t
			},
			n = t.document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
			r = "download" in n,
			o = /constructor/i.test(t.HTMLElement) || t.safari,
			a = /CriOS\/[\d]+/.test(navigator.userAgent),
			i = t.setImmediate || t.setTimeout,
			c = function (t) {
				i(function () {
					throw t
				}, 0)
			},
			d = function (t) {
				setTimeout(function () {
					"string" == typeof t ? e().revokeObjectURL(t) : t.remove()
				}, 4e4)
			},
			f = function (t) {
				return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) ? new Blob([String.fromCharCode(65279), t], {
					type: t.type
				}) : t
			},
			s = function (s, u, l) {
				l || (s = f(s));
				let p, v = this,
					w = "application/octet-stream" === s.type,
					m = function () {
						! function (t, e, n) {
							for (let r = (e = [].concat(e)).length; r--;) {
								let o = t["on" + e[r]];
								if ("function" == typeof o) try {
									o.call(t, n || t)
								} catch (t) {
									c(t)
								}
							}
						}(v, "writestart progress write writeend".split(" "))
					};
				if (v.readyState = v.INIT, r) return p = e().createObjectURL(s), void i(function () {
					let t, e;
					n.href = p, n.download = u, t = n, e = new MouseEvent("click"), t.dispatchEvent(e), m(), d(p), v.readyState = v.DONE
				}, 0);
				! function () {
					if ((a || w && o) && t.FileReader) {
						let n = new FileReader;
						return n.onloadend = function () {
							let e = a ? n.result : n.result.replace(/^data:[^;]*;/, "data:attachment/file;");
							t.open(e, "_blank") || (t.location.href = e), e = void 0, v.readyState = v.DONE, m()
						}, n.readAsDataURL(s), void(v.readyState = v.INIT)
					}
					p || (p = e().createObjectURL(s)), w ? t.location.href = p : t.open(p, "_blank") || (t.location.href = p);
					v.readyState = v.DONE, m(), d(p)
				}()
			},
			u = s.prototype;
		return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function (t, e, n) {
			return e = e || t.name || "download", n || (t = f(t)), navigator.msSaveOrOpenBlob(t, e)
		} : (u.abort = function () {}, u.readyState = u.INIT = 0, u.WRITING = 1, u.DONE = 2, u.error = u.onwritestart = u.onprogress = u.onwrite = u.onabort = u.onerror = u.onwriteend = null, function (t, e, n) {
			return new s(t, e || t.name || "download", n)
		})
	}
}("undefined" != typeof self && self || "undefined" != typeof window && window || this);

/* createFileName */
function createFileName(date) {
	let monthNames = [
		"1", "2", "3",
		"4", "5", "6", "7",
		"8", "9", "10",
		"11", "12"
	];
	return 'Your-Session-' + date.getDate() + '-' + monthNames[date.getMonth()] + '-' + date.getFullYear() + '__' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
}
/* Save Session As File */
$("button:button#exportFile").click(
	function () {
		/* Check allow incognito */
		chrome.extension.isAllowedIncognitoAccess(function (isAllowedAccess) {
			if (isAllowedAccess) {
				chrome.tabs.query({}, function (tab) {
					// $.each(tab, function (index, value) {
					// 	second_array.push({name: value.name,  index:  value.index});
					let tab1 = tab;
					let only = true
					for (let i = 0; i < tab.length; i++) {
						delete tab1[i]['audible'];
						delete tab1[i]['autoDiscardable'];
						delete tab1[i]['discarded'];
						delete tab1[i]['favIconUrl'];
						delete tab1[i]['height'];
						delete tab1[i]['highlighted'];
						delete tab1[i]['title'];
						delete tab1[i]['width'];
						delete tab1[i]['status'];
						delete tab1[i]['id'];
						/* Export Cookies */
						if ($("input:checkbox.save-cookies").prop("checked")) {
							chrome.cookies.getAll({
									url: tab1[i]['url']
								},
								function (cookie) {
									if ($("input:password#password-encrypt").val() != '') {
										tab1[i].cookies = CryptoJS.AES.encrypt(JSON.stringify(cookie), $("input:password#password-encrypt").val()).toString()
									} else {
										tab1[i].cookies = cookie
									}
									if (i == (tab.length - 1)) {
                                        Lobibox.notify('success', {
                                            msg: "<b>Export Success!</b>",
                                            size: "mini",
                                            closable: false,
                                            closeOnClick: true,
                                            sound: false,
                                            delay: 1200
                                        });
                                        setTimeout(function (content) {
                                            let blob = new Blob([JSON.stringify(content)], {
                                                type: "application/json;charset=utf-8"
                                            });
                                            let date = createFileName(new Date())
                                            if ($("input:checkbox#sync-session").prop("checked")) {syncSession(date,content)}
                                            saveAs(blob, date);
                                        }, 1200, tab1)
									}
								}
							);
						}
					}
                    if (!$("input:checkbox.save-cookies").prop("checked")) {
                        Lobibox.notify('success', {
                            msg: "<b>Export Success!</b>",
                            size: "mini",
                            closable: false,
                            closeOnClick: true,
                            sound: false,
                            delay: 1200
                        });
                        setTimeout(function (content) {
                            let blob = new Blob([JSON.stringify(content)], {
                                type: "application/json;charset=utf-8"
                            });
                            let date = createFileName(new Date())
                            if ($("input:checkbox#sync-session").prop("checked")) {syncSession(date,content)}
                            saveAs(blob, date);
                        }, 1200, tab1)
                    }
				})
			} else {
				// alert for a quick demonstration, please create your own user-friendly UI
				Lobibox.notify('error', {
					msg: "<b>Please allow incognito mode by click into this notification</b>",
					size: "mini",
					closable: false,
					closeOnClick: true,
					sound: false,
					onClick: function () {
						chrome.tabs.create({
							url: 'chrome://extensions/?id=' + chrome.runtime.id
						})
					},
					delay: 4000
				});
				setTimeout(function () {
					chrome.tabs.create({
						url: 'chrome://extensions/?id=' + chrome.runtime.id
					})
				}, 4200);
			}
		});
	}
)



/* Read File */
$("input:file#importFile").change(event,
	function () {
		let input = event.target;
		let reader = new FileReader();
		reader.onload = function () {
            importSession(reader.result,"offline")
		}
		// reader.onload = function () {
		// 	try {
		// 		let text = JSON.parse(reader.result);
		// 		let count_error = true
		// 		/* Import Cookies */
		// 		if ($("input:checkbox.export-cookies").prop("checked")) {
		// 				try {
		// 					text.map(function (session_cookies) {
		// 						if ($("input:password#password-decrypt").val().length != 0) {
         //                            console.log(CryptoJS.AES.decrypt(session_cookies.cookies, $("input:password#password-decrypt").val()))
		// 							decrypted = CryptoJS.AES.decrypt(session_cookies.cookies, $("input:password#password-decrypt").val()).toString(CryptoJS.enc.Utf8)
		// 							session_cookies.cookies = JSON.parse(decrypted)
		// 						}
		// 						if (session_cookies.cookies == {}) {
		// 							Lobibox.notify('error', {
		// 								msg: "<b>Your password does not match</b>",
		// 								size: "mini",
		// 								closable: false,
		// 								closeOnClick: true,
		// 								sound: false,
		// 							});
		// 						}
		// 						session_cookies.cookies.map(function (cookies) {
		// 							chrome.cookies.set({
		// 								url: session_cookies.url,
		// 								name: cookies.name,
		// 								value: cookies.value,
		// 								domain: cookies.domain,
		// 								path: cookies.path,
		// 								secure: cookies.secure,
		// 								httpOnly: cookies.httpOnly,
		// 								sameSite: cookies.sameSite,
		// 								expirationDate: cookies.expirationDate,
		// 								storeId: cookies.storeId
		// 							});
		// 						})
		// 					})
        //
		// 				} catch (error) {
		// 					if (count_error) {
         //                        switch (error.message) {
         //                            case "Cannot read property 'map' of undefined":
         //                                Lobibox.notify('error', {
         //                                    msg: "<b>Your session hasn't been had any cookies!</b>",
         //                                    size: "mini",
         //                                    closable: false,
         //                                    closeOnClick: true,
         //                                    sound: false,
         //                                    delay: 1200
         //                                });
         //                                break;
         //                            case "Malformed UTF-8 data":
         //                                Lobibox.notify('error', {
         //                                    msg: "<b>Your password does not match or your session has been corrupted!</b>",
         //                                    size: "mini",
         //                                    closable: false,
         //                                    closeOnClick: true,
         //                                    sound: false,
         //                                    delay: 1200
         //                                });
         //                                break
         //                            default:
         //                                Lobibox.notify('error', {
         //                                    msg: "<b>Unknown error</b>",
         //                                    size: "mini",
         //                                    closable: false,
         //                                    closeOnClick: true,
         //                                    sound: false,
         //                                    delay: 1200
         //                                });
         //                                console.log(error)
         //                        }
		// 					}
         //                    count_error = false
		// 				}
		// 			}
		// 		session = []
		// 		i = 0
		// 		j = text[0].windowId
		// 		while (i < text.length) {
		// 			tabs = []
		// 			while (j == text[i]["windowId"]) {
		// 				tabs.push(text[i])
		// 				if (i < text.length)
		// 					i++
		// 					if (i == text.length)
		// 						break
		// 			}
		// 			session.push(tabs)
		// 			if (i != text.length) {
		// 				j = text[i].windowId
		// 			}
		// 		}
		// 		setTimeout(session => {
         //            session.map(
         //                function (value, index) {
         //                    if ((!$("input#open-all-in-new-window").prop("checked")) && (index == 0) && (value[0].incognito == false)) {
         //                        for (let i = 0; i < value.length; i++) {
         //                            chrome.tabs.create({
         //                                url: value[i].url,
         //                                active: value[i].active,
         //                                selected: value[i].selected,
         //                                pinned: value[i].pinned
         //                            })
         //                        }
         //                    } else if (value[0].incognito) {
         //                        let incognito_array = [];
         //                        for (let i = 0; i < value.length; i++) {
         //                            incognito_array.push(value[i].url);
         //                        }
         //                        if (incognito_array.length != 0) {
         //                            chrome.windows.create({
         //                                'url': incognito_array,
         //                                'incognito': true
         //                            })
        //
         //                        }
         //                    } else {
         //                        let new_window_array = []
         //                        for (let i = 0; i < value.length; i++) {
         //                            new_window_array.push(value[i].url)
         //                        }
         //                        chrome.windows.create({
         //                            url: new_window_array
         //                        })
         //                    }
         //                }
         //            )
		// 		}, 1200, session);
		// 		// Lobibox.notify('success', {
		// 		// 	msg: "<b>Import Succeess!</b>",
		// 		// 	size: "mini",
		// 		// 	closable: false,
		// 		// 	closeOnClick: true,
		// 		// 	sound: false,
		// 		// 	delay: 1200
		// 		// });
		// 	} catch (error) {
		// 		Lobibox.notify('error', {
		// 			msg: "<b>Import Failed!</b>",
		// 			size: "mini",
		// 			closable: false,
		// 			closeOnClick: true,
		// 			sound: false,
		// 		});
		// 		console.log(error)
		// 	}
		// };
		reader.readAsText(input.files[0]);
	}
)

/* Open Tabs */
$(document).ready(function () {
	$(".nav-tabs a").click(function () {
		$(this).tab('show');
	});
});
// Show Password Input
/* Encrypt */
$("input:checkbox.save-cookies").change(
	function () {
		if ($(this).prop("checked")) {
			console.log(typeof $(this).prop("checked"))
			$("input:password#password-encrypt").show(400)
		} else {
			$("input:password#password-encrypt").hide(400)
		}
	}
)
/* Decrypt */
$("input:checkbox.export-cookies").change(
	function () {
		if ($(this).prop("checked")) {
			console.log(typeof $(this).prop("checked"))
			$("input:password#password-decrypt").show(400)
		} else {
			$("input:password#password-decrypt").hide(400)
		}
	}
)
// Show option when import
 $('input:radio[name=import-type]').change(function() {
        if (this.value == 'import-online') {
            $("div.import-offline-form").hide(100)
            $("div.import-online-form").show(100)
            $("nav.tabs").add('<div class="btn-group-vertical btn-group btn-group-toggle session-online-div"></div>').appendTo("nav.tabs")
            chrome.storage.sync.get("keep_your_session",function (data) {
                console.log(data);
				data.keep_your_session.map(function (session_name,index) {
                    $("div.session-online-div").add('<label class="btn btn-secondary" id="'+index+'" value="'+index+'"><input type="radio" name="import-radio" id="session-online" value="'+index+'" autocomplete="off"> '+session_name.date+'</label>').appendTo("div.session-online-div")

                })
                var value;
                $("input#session-online[name=import-radio]").change(
                    function () {
                        $("label.btn.btn-secondary").removeClass("active")
                        value = this.value
                        $("label#"+this.value).addClass("active")
                    }
                )
                $("button:submit.import-online").click(function () {
                    importSession(JSON.stringify(data.keep_your_session[value].value),"online")
                })
            })
        }
        else if (this.value == 'import-offline') {
            $("div.import-offline-form").show(100)
			$("div.session-online-div").remove()
            $("div.import-online-form").hide(100)
        }
    });
/* import file */
function importSession(data,where) {
    try {
        let text = JSON.parse(data);
        let count_error = true
        /* Import Cookies */
        if ($("input:checkbox.export-cookies").prop("checked")) {
            try {
                text.map(function (session_cookies) {
                    if ($("input:password#password-decrypt-"+where).val().length != 0) {
                        decrypted = CryptoJS.AES.decrypt(session_cookies.cookies, $("input:password#password-decrypt-"+where).val()).toString(CryptoJS.enc.Utf8)
                        session_cookies.cookies = JSON.parse(decrypted)
                    }
                    if (session_cookies.cookies == {}) {
                        Lobibox.notify('error', {
                            msg: "<b>Your password does not match</b>",
                            size: "mini",
                            closable: false,
                            closeOnClick: true,
                            sound: false,
                        });
                    }
                    session_cookies.cookies.map(function (cookies) {
                        chrome.cookies.set({
                            url: session_cookies.url,
                            name: cookies.name,
                            value: cookies.value,
                            domain: cookies.domain,
                            path: cookies.path,
                            secure: cookies.secure,
                            httpOnly: cookies.httpOnly,
                            sameSite: cookies.sameSite,
                            expirationDate: cookies.expirationDate,
                            storeId: cookies.storeId
                        });
                    })
                })

            } catch (error) {
                if (count_error) {
                    switch (error.message) {
                        case "Cannot read property 'map' of undefined":
                            Lobibox.notify('error', {
                                msg: "<b>Your session hasn't been had any cookies!</b>",
                                size: "mini",
                                closable: false,
                                closeOnClick: true,
                                sound: false,
                                delay: 1200
                            });
                            break;
                        case "Malformed UTF-8 data":
                            Lobibox.notify('error', {
                                msg: "<b>Your password does not match or your session has been corrupted!</b>",
                                size: "mini",
                                closable: false,
                                closeOnClick: true,
                                sound: false,
                                delay: 1200
                            });
                            break
                        default:
                            Lobibox.notify('error', {
                                msg: "<b>Unknown error</b>",
                                size: "mini",
                                closable: false,
                                closeOnClick: true,
                                sound: false,
                                delay: 1200
                            });
                            console.log(error)
                    }
                }
                count_error = false
            }
        }
        session = []
        i = 0
        j = text[0].windowId
        while (i < text.length) {
            tabs = []
            while (j == text[i]["windowId"]) {
                tabs.push(text[i])
                if (i < text.length)
                    i++
                if (i == text.length)
                    break
            }
            session.push(tabs)
            if (i != text.length) {
                j = text[i].windowId
            }
        }
        setTimeout(session => {
            session.map(
                function (value, index) {
                    if ((!$("input#open-all-in-new-window-"+where).prop("checked")) && (index == 0) && (value[0].incognito == false)) {
                        for (let i = 0; i < value.length; i++) {
                            chrome.tabs.create({
                                url: value[i].url,
                                active: value[i].active,
                                selected: value[i].selected,
                                pinned: value[i].pinned
                            })
                        }
                    } else if (value[0].incognito) {
                        let incognito_array = [];
                        for (let i = 0; i < value.length; i++) {
                            incognito_array.push(value[i].url);
                        }
                        if (incognito_array.length != 0) {
                            chrome.windows.create({
                                'url': incognito_array,
                                'incognito': true
                            })

                        }
                    } else {
                        let new_window_array = []
                        for (let i = 0; i < value.length; i++) {
                            new_window_array.push(value[i].url)
                        }
                        chrome.windows.create({
                            url: new_window_array
                        })
                    }
                }
            )
        }, 1200, session);
        // Lobibox.notify('success', {
        // 	msg: "<b>Import Succeess!</b>",
        // 	size: "mini",
        // 	closable: false,
        // 	closeOnClick: true,
        // 	sound: false,
        // 	delay: 1200
        // });
    } catch (error) {
        Lobibox.notify('error', {
            msg: "<b>Import Failed!</b>",
            size: "mini",
            closable: false,
            closeOnClick: true,
            sound: false,
        });
        console.log(error)
    }
    console.log(data)
};

// sync your session
function syncSession(date,content) {
    chrome.storage.sync.get(function(cfg) {
        if(typeof(cfg["keep_your_session"]) !== 'undefined' && cfg["keep_your_session"] instanceof Array) {
            cfg["keep_your_session"].push({date:date, value:content});
        } else {
            cfg["keep_your_session"] = [{date:date, value:content}];
        }
        chrome.storage.sync.set(cfg);
        console.log(cfg)
    });
}