const express = require("express");
const Handlebars = require("handlebars");
const fetch = require("node-fetch");
const htmlPdf = require("html-pdf");

const app = express();

app.use(express.json());

app.get("/certificado.html", (require, response) => {
  response.header("content-type", "text/html");
  response.send(certificado);
});

const certificadoPath =
  "https://firebasestorage.googleapis.com/v0/b/certificado-74d81.appspot.com/o/certificado.html?alt=media&token=888abcf1-c79d-47d7-b2ca-e136e48d72a1";
app.post("/certificado", async (request, response) => {
  const certificText = await fetch(certificadoPath).then((respond) =>
    respond.text()
  );
  const certificado = Handlebars.compile(certificText);
  const html = certificado(request.body);
  htmlPdf.create(html).toStream((_, stream) => {
    response.header("content-type", "application/pdf");
    response.header(
      "content-disposition",
      `attachment; filename="Certificado_${request.body.name}.pdf"`
    );
    stream.pipe(response);
  });
});

app.listen(process.env.PORT || 3000);
