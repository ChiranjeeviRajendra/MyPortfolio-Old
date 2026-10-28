import { expect, test } from '@playwright/test';

let runtimeErrors: string[];

test.beforeEach(async ({ page }) => {
  runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push(error.message));
});

test.afterEach(() => {
  expect(runtimeErrors).toEqual([]);
});

test('renders the portfolio and navigates every section', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Portfolio');
  await expect(page.getByRole('heading', { name: 'Welcome To My Portfolio' })).toBeVisible();

  for (const [label, path, component] of [
    ['Personal Details', 'personalDetails', 'app-about-me'],
    ['Skills', 'skills', 'app-skills'],
    ['Experience', 'experience', 'app-experience'],
    ['Projects', 'projects', 'app-projects'],
    ['Education', 'education', 'app-education'],
    ['Contact', 'contact', 'app-contact'],
    ['Home', 'home', 'app-home']
  ]) {
    if (isMobile) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
    }
    await page.locator('mat-sidenav').getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#/${path}$`));
    await expect(page.locator(`.content > ${component}`)).toBeVisible();
    if (isMobile) {
      await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
    }
  }
});

test('supports carousel controls, expansion panels, and Material tabs', async ({ page }) => {
  await page.goto('/#/home');
  const activeImage = page.locator('.carousel-item.active img');
  await expect(activeImage).toHaveAttribute('src', 'assets/cara1.png');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(activeImage).toHaveAttribute('src', 'assets/cara2.jpg');

  await page.getByRole('button', { name: 'My Personal Details' }).click();
  await expect(page.getByRole('tab', { name: 'Formal Info', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Informal Info' }).click();
  await expect(page.getByText('Playing video games')).toBeVisible();
});

test('supports direct route reloads and redirects unknown routes', async ({ page }) => {
  await page.goto('/#/personalDetails');
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Formal Info', exact: true })).toBeVisible();
  await page.goto('/#/missing-page');
  await expect(page.getByRole('heading', { name: 'Welcome To My Portfolio' })).toBeVisible();
});

test('stacks nested skills and toggles each level independently', async ({ page }) => {
  for (const route of ['skills', 'home']) {
    await page.goto(`/#/${route}`);
    const homeSkills = page.getByRole('button', { name: 'My Skills', exact: true });
    if (route === 'home') {
      await homeSkills.click();
    }

    const skills = page.locator('app-skills');
    const frontend = skills.getByRole('button', { name: 'Frontend development', exact: true });
    const backend = skills.getByRole('button', { name: 'Backend & API development', exact: true });
    await expect(frontend).toHaveAttribute('aria-expanded', 'false');
    const frontendBox = await frontend.boundingBox();
    const backendBox = await backend.boundingBox();
    expect(backendBox!.y).toBeGreaterThanOrEqual(frontendBox!.y + frontendBox!.height);

    await frontend.click();
    const angular = skills.getByRole('button', { name: 'Angular', exact: true });
    const react = skills.getByRole('button', { name: 'React', exact: true });
    await expect(angular).toBeVisible();
    await expect(angular).toHaveAttribute('aria-expanded', 'false');
    const angularBox = await angular.boundingBox();
    const reactBox = await react.boundingBox();
    expect(reactBox!.y).toBeGreaterThanOrEqual(angularBox!.y + angularBox!.height);

    await angular.focus();
    await angular.press('Enter');
    await expect(angular).toHaveAttribute('aria-expanded', 'true');
    const detail = skills.getByText('Build reusable components and standalone features with clear routing and modular application structure.', { exact: true });
    await expect(detail).toBeVisible();
    await expect(frontend).toHaveAttribute('aria-expanded', 'true');
    await expect(react).toHaveAttribute('aria-expanded', 'false');

    await frontend.click();
    await expect(frontend).toHaveAttribute('aria-expanded', 'false');
    await expect(detail).not.toBeInViewport();
    await frontend.click();
    await expect(frontend).toHaveAttribute('aria-expanded', 'true');
    await expect(detail).toBeInViewport();
    await angular.focus();
    await angular.press('Space');
    await expect(angular).toHaveAttribute('aria-expanded', 'false');
    await expect(detail).not.toBeInViewport();
    if (route === 'home') {
      await expect(homeSkills).toHaveAttribute('aria-expanded', 'true');
    }

    expect(await skills.locator(':scope > mat-accordion').evaluate(element => element.scrollWidth > element.clientWidth)).toBe(false);
  }
});
