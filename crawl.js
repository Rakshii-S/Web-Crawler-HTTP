const {JSDOM} = require('jsdom')

async function crawlPage(baseURL,currentURL,pages){
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0)
    {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1
    console.log(`Actively crawling: ${currentURL}`)

    try{
        const resp = await fetch(currentURL)
        if(resp.status > 399)
        {
            console.log(`Error in fetch with status code: ${resp.status}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
             console.log(`Non HTML response, content type: ${contentType}`)
            return pages
        }
        const htmlBody = await resp.text()
        const nextURLs = getUrlsFromHTML(htmlBody,baseURL)
        for(const nextURL of nextURLs)
        {
            pages = await crawlPage(baseURL, nextURL,pages)
        }
    }catch(err)
    {
        console.log(`Error in fetch: ${err.message}`)
    }
    return pages
}
function getUrlsFromHTML(htmlBody, baseURL)
{
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for(const linkElement of linkElements)
    {
        if(linkElement.href.slice(0,1) === '/'){
            //relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            }catch(err){
                console.log(`Error: ${err.message}`)
            }
        }else{
            //absolute
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            }catch(err){
                console.log(`Error: ${err.message}`)
            }
        }
    }
    return urls
}
function normalizeURL(urlString)
{
    const urlObj = new URL(urlString)
    const hostPath =  `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === '/')
    {
        return hostPath.slice(0,-1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getUrlsFromHTML,
    crawlPage
}