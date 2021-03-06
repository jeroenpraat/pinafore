import {
  closeDialogButton,
  composeModalInput,
  getNthFavorited,
  getNthStatus,
  getUrl, modalDialog, notificationsNavButton,
  isNthStatusActive, goBack
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`026-shortcuts-notification.js`
  .page`http://localhost:4002`

test('Shortcut f toggles favorite status in notification', async t => {
  let idx = 0
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1 + idx).exists).ok({ timeout: 30000 })
    .expect(getNthFavorited(1 + idx)).eql('false')
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('f')
    .expect(getNthFavorited(1 + idx)).eql('true')
    .pressKey('f')
    .expect(getNthFavorited(1 + idx)).eql('false')
})

test('Shortcut p toggles profile in a follow notification', async t => {
  let idx = 5 // "@quux followed you"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/3')
  await goBack()
  await t
    .expect(isNthStatusActive(1 + idx)()).ok() // focus preserved
})

test('Shortcut m toggles mention in a follow notification', async t => {
  let idx = 5 // "@quux followed you"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@quux ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})

test('Shortcut p refers to booster in a boost notification', async t => {
  let idx = 1 // "@admin boosted your status"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('p')
    .expect(getUrl()).contains('/accounts/1')
})

test('Shortcut m refers to favoriter in a favorite notification', async t => {
  let idx = 0 // "@admin favorited your status"
  await loginAsFoobar(t)
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .pressKey('j '.repeat(idx + 1))
    .expect(isNthStatusActive(1 + idx)()).ok()
    .pressKey('m')
    .expect(composeModalInput.value).eql('@admin ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})
