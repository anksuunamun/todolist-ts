describe('addItemForm', () => {
    it('base example, visually looks correct; add item form', async () => {
        // APIs from jest-puppeteer
        await page.goto('http://localhost:9009/iframe.html?id=components-additemform--add-item-form-classic');
        const image = await page.screenshot();

        // API from jest-image-snapshot
        expect(image).toMatchImageSnapshot();
    });

    it('Editable span visually should look correct', async () => {
        await page.goto('http://localhost:9009/iframe.html?id=components-editablespan--editable-span-example&viewMode=story');
        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    })

    it('App should be visually correct', async () => {
        await page.goto('http://localhost:9009/iframe.html?id=components-appwithredux--app-with-redux-example&viewMode=story');
        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    });

    it('Completed task should look correct', async () => {
        await page.goto('http://localhost:9009/iframe.html?id=components-task--task-is-done-example&viewMode=story');
        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot()
    });

    it('Active task should look correct', async () => {
        await page.goto('http://localhost:9009/iframe.html?id=components-task--task-is-not-done-example');
        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot()
    })
});
