const {normalizeURL, getUrlsFromHTML} = require('./crawl.js')
const {test, except} = require('@jest/globals')

test('normalizeURL strip protocol', ()=>{
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', ()=>{
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', ()=>{
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', ()=>{
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML relative', ()=>{
    const inputHTMLBody = `
                <html>
                    <body>
                        <a href="https://blog.boot.dev/path/">
                            Boot.dev Blog
                        </a>
                    </body>
                </html>`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML absolute', ()=>{
    const inputHTMLBody = `
                <html>
                    <body>
                        <a href="/path/">
                            Boot.dev Blog
                        </a>
                    </body>
                </html>`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML both', ()=>{
    const inputHTMLBody = `
                <html>
                    <body>
                        <a href="https://blog.boot.dev/path1/">
                            Boot.dev Blog 1
                        </a>
                        <a href="/path2/">
                            Boot.dev Blog 2
                        </a>
                    </body>
                </html>`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path1/","https://blog.boot.dev/path2/"]
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML invalid', ()=>{
    const inputHTMLBody = `
                <html>
                    <body>
                        <a href="invalid">
                            Invalid URL
                        </a>
                    </body>
                </html>`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})