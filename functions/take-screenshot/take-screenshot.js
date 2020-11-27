const puppeteer = require('puppeteer-core')
const report = require('puppeteer-report')

exports.handler = async (event, context) => {

    let oBrowser

    try {
        oBrowser = await puppeteer.connect({
            browserWSEndpoint: `${process.env.BROWSERLESS_URL}?token=${process.env.BROWSERLESS_TOKEN}`,
        })
        const oPage = await oBrowser.newPage()
        await oPage.goto('https://google.com')

        const oPDF = await report.pdfPage(oPage, {
          format: 'A4',
          margin: { top: '2cm', right: '2cm', bottom: '2.5cm', left: '2.5cm' },
        })

        const oResponse = {
            headers: {
                'Content-type': 'application/pdf',
                'content-disposition': 'attachment; filename=test.pdf',
            },
            statusCode: 200,
            body: oPDF.toString('base64'),
            isBase64Encoded: true,
        }
        context.succeed(oResponse)
    } catch (error) {
        return context.fail(error)
    } finally {
        if (oBrowser) {
            await oBrowser.close()
        }
    }
}
