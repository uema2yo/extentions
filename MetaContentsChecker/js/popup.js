document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.executeScript({
    code: '(' + function () {
      const content = (selector) => {
        const elem = document.head.querySelector(selector)
        return elem && (elem.content || elem.textContent)
      }
      return {
        origin: location.origin,
        title: content('title'),
        description: content('meta[name="description"]'),
        ogp_title: content('meta[property="og:title"]'),
        ogp_description: content('meta[property="og:description"]'),
        ogp_image: content('meta[property="og:image"]'),
        twitter_title: content('meta[name="twitter:title"]'),
        twitter_description: content('meta[name="twitter:description"]'),
        twitter_image: content('meta[name="twitter:image"]')
      }
    } + ')();'
  }, function (metas) {
    const d = document,
              meta = metas[0]
              domainLst = d.getElementById("domainLst")
    const isSls = d.querySelectorAll(".is-sl")
    const limits = {
      title: 29,
      description: 120
    }
    const target = (id) => {
      const elem = d.getElementById(id)
      return elem
    }
    const count = (str) => {
      return Array.from(str).length
    }
    const replaceDomain = (url) => {
      return url.replace(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/, meta.origin + "/")
    }
    const switchDomain = (production) => {
      if (production) {
        d.querySelector("a[data-domain=\"p\"]").classList.add("is-selected"),
        d.querySelector("a[data-domain=\"sl\"]").classList.remove("is-selected")
        for (let isSl of isSls) {
          isSl.classList.add("is-hidden")
        }
      } else {
        d.querySelector("a[data-domain=\"p\"]").classList.remove("is-selected"),
        d.querySelector("a[data-domain=\"sl\"]").classList.add("is-selected")
        for (let isSl of isSls) {
          isSl.classList.remove("is-hidden")
        }
      }     
      for (let k of Object.keys(meta)) {
        let _img, _p
        if (target(k)) target(k).textContent = meta[k] || "設定がありません。"
        !meta[k] && target(k).classList.add("isEmpty")
        if (meta[k] && (k === "title" || k === "description")) {
          _p = document.createElement("p")
          _p.classList.add("msg")
          _p.innerHTML = "<strong>" + count(meta[k]) + "</strong> 文字です。<br>Google 検索結果に表示される " + k +  " は、全角 " + limits[k] + " 文字以内が目安です。"
          target(k).appendChild(_p)
        }
        if (k.indexOf("_image") > -1 && meta[k] && meta[k].match(/^https?\:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/i)) {
          _img = document.createElement("img")
          _img.src = _img.alt = production ? meta[k]: replaceDomain(meta[k])
          
          target(k).appendChild(_img)
        }
      }  
    }

    let production = false
    switchDomain(production)

    const domainLstItms = d.getElementsByTagName("a")
    for ( let el of domainLstItms) {
      el.addEventListener("click", (ev) => {
        if ( ev.target.dataset.domain === "p") {
          switchDomain(true)
        } else {
          switchDomain(false)
        }
        ev.preventDefault()
      })
    }

  });
}, false);