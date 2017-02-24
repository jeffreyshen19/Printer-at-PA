let fs = require('fs'),
  PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

pdfParser.on("pdfParser_dataReady", pdfData => {
  var raw = pdfParser.getRawTextContent().match(/[A-Za-z0-9._%+-]+@andover.edu/g);
  fs.writeFile("./content.txt", raw);
});

pdfParser.loadPDF("./directory.pdf");
