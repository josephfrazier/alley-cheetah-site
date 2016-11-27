const jsdom = require('jsdom')

// jsdom.env('http://supermarketpage.com/supermarketlist.php', function (err, window) {
jsdom.env('http://supermarketpage.com/state/NY/', function (err, window) {
  if (err) throw err
  const storeLinkSelector = '#content > table > tbody > tr > td > a'
  const storeLinks = window.document.querySelectorAll(storeLinkSelector)
  Array.from(storeLinks).forEach(function (anchor) {
    const storeUrl = anchor.href
    jsdom.env(storeUrl, function (err, window) {
      if (err) throw err
      const rowSelector = '#content > table > tbody > tr'
      const rows = window.document.querySelectorAll(rowSelector)
      Array.from(rows).slice(1).forEach(function (row) {
        const address = Array.from(row.children).slice(1,3).map((td) => td.textContent).join(' ')
        console.log(storeUrl + ' ' + address)
      });
    })
  })
})
