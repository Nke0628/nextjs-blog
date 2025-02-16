import {
  Given,
  Then,
  BeforeAll,
  AfterAll,
  Before,
  After,
} from '@cucumber/cucumber'
import { Browser, Page, chromium, expect } from '@playwright/test'

let browser: Browser
let page: Page

BeforeAll(async () => {
  browser = await chromium.launch({ headless: false })
})

Before(async () => {
  const context = await browser.newContext()
  page = await context.newPage()
})

After(async () => {
  await page.close()
})

AfterAll(async () => {
  await browser.close()
})

Given('トップページを開く', async () => {
  await page.goto('http://localhost:3000/')
})

Then('記事一覧が表示されていること', async () => {
  const articleList = await page.getByTestId('article')
  console.log(articleList)
  expect(await articleList.count()).toBeGreaterThan(0)
})
