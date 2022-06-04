const fs = require("fs");
const puppeteer = require("puppeteer");
request = require('request');

const download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

(async () => {
    try {
        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Start login your account
        await page.goto(
            "https://www.instagram.com/"
        );
        await page.waitForTimeout(5000);
        console.log("page has been loaded!");

        //username
        await page.focus('input[name=username]')
        //put your username
        await page.keyboard.type('') // email here
        console.log("name loaded!");

        //password
        await page.focus('input[name=password]')
        //put your password
        await page.keyboard.type('') //password here
        console.log("password loaded!");

        await page.click('button[type="submit"]');

        await page.waitForTimeout(5000);
        await page.screenshot({path: "screenshots/login-complete.png"});

        //set the profile
        await page.goto(
            "https://www.instagram.com/natgeotravel/"
        );

        await page.waitForTimeout(10000);
        await page.screenshot({path: "screenshots/profile.png"});

        const images = await page.evaluate(() => {
            const src = Array.from(
                document.querySelectorAll("img")
            ).map((image) => image.getAttribute("src"));
            return src;
        });

        console.log("Page has been evaluated!");
        fs.writeFileSync("./json/instagram.json", JSON.stringify(images));

        console.log("File is created!");


        // download images
        images.map((image, index) => {
            download(image, "images/" + index + ".png", function () {
                console.log('done :' + image);
            });
        })

        console.log("Job Complete!");

        // End Puppeteer
        await browser.close();
    } catch (error) {
        console.log(error);
    }
})();



