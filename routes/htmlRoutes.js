app.get("/", function(req, res) {
  console.log('inside html')
  path.sendfile__("index.html")

})