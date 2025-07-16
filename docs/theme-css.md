# Theme CSS

## HTML structure

The basic idea of HTML structure is that `<section>` elements are corresponding to each slide pages. It is same as [reveal.js](https://github.com/hakimel/reveal.js/#markup).

```html
<section><h1>First page</h1></section>
<section><h1>Second page</h1></section>
```

?> When conversion, Marpit would scope CSS selectors by wrapping them with the selector for [container element(s)](/usage#package-customize-container-elements) automatically. However, the theme author doesn't have to be aware of this process.

## Create theme CSS

As indicated preceding, all that you have to know to create theme is just that `<section>` elements are used like a viewport for each slide pages.

```css
/* @theme marpit-theme */

section {
  width: 1280px;
  height: 960px;
  font-size: 40px;
  padding: 40px;
}

h1 {
  font-size: 60px;
  color: #09c;
}

h2 {
  font-size: 50px;
}
```

We have no any extra classes or mixins, and do almost not need require to know extra rules for creating theme. This is a key factor of Marpit different from other slide framework.

### `:root` pseudo-class selector

In the context of Marpit, [`:root` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:root) indicates each `<section>` elements for the slide page instead of `<html>`.

The following is similar theme definition to the example shown earlier, but it's using `:root` selector.

```css
/* @theme marpit-theme */

:root {
  width: 1280px;
  height: 960px;
  font-size: 40px;
  padding: 1rem;
}

h1 {
  font-size: 1.5rem;
  color: #09c;
}

h2 {
  font-size: 1.25rem;
}
```

[`rem` units](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#Rems) in Marpit theme will automatically transform into the calculated relative value from the parent `<section>` element, so anyone don't have to worry the effect from `font-size` in the root `<html>` that placed Marpit slide. Everything would work as the theme author expected.

?> `:root` selector can use just like as `section` selector, but there is a difference that `:root` has higher [CSS specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity) than `section`. If both selectors have mixed in a theme CSS, declarations in `:root` selector will be preferred than `section` selector.

### Metadata

**The `@theme` metadata is always required by Marpit.** You must define metadata through CSS comment.

```css
/* @theme name */
```

!> You should use the `/*! comment */` syntax to prevent removing comments if you're using the compressed output of [Sass].

## Styling

### Slide size

`width` and `height` declarations in the root `section` selector or `:root` pseudo-class selector mean a predefined slide size per theme. The specified size is not only used as the size of section element but also as the size of PDF for printing.

The default size is `1280` x `720` pixels. Try this if you want a classic 4:3 slide:

```css
/* Change to the classic 4:3 slide */
section {
  width: 960px;
  height: 720px;
}
```

!> Please notice _it must define **the static length in an absolute unit.**_ We support `cm`, `in`, `mm`, `pc`, `pt`, `px`, and `Q`.

?> It is determined **one size per theme** in Marpit. The slide size cannot change through using [inline style](#tweak-style-through-markdown), [custom class](/directives#class), and [CSS custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). But the width of contents may shrink if user was using [split backgrounds](/image-syntax#split-backgrounds).

### Pagination

[`paginate` local directive](/directives#pagination) may control whether show the page number of slide. The theme creator can style it through `section::after` (`:root::after`) pseudo-element.

```css
/* Styling page number */
section::after {
  font-weight: bold;
  text-shadow: 1px 1px 0 #fff;
}
```

Please refer to [the default style of `section::after` in a scaffold theme](https://github.com/marp-team/marpit/blob/main/src/theme/scaffold.js) as well.

#### Customize content

Marpit has a default content: `attr(data-marpit-pagination)`, indicates the current page number. Theme CSS can add other strings and attributes to the shown page number.

<!-- prettier-ignore-start -->

```css
/* Add "Page" prefix and total page number */
section::after {
  content: 'Page ' attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
}
```

<!-- prettier-ignore-end -->

`attr(data-marpit-pagination-total)` means the total page number of rendered slides. Thus, the above example would show as like as `Page 1 / 3`.

!> Theme CSS must contain `attr(data-marpit-pagination)` in `content` declaration because user expects to show the page number by `paginate: true` directive. _Marpit will ignore the whole of `content` declaration if the reference to that attribute is not contained._

### Header and footer

`header` and `footer` element have a possible to be rendered by [`header` / `footer` local directives](/directives#header-and-footer). _Marpit has no default style for these elements._

If you want to place to the marginal of slide, using `position: absolute` would be a good solution.

```css
section {
  padding: 50px;
}

header,
footer {
  position: absolute;
  left: 50px;
  right: 50px;
  height: 20px;
}

header {
  top: 30px;
}

footer {
  bottom: 30px;
}
```

## Customized theme

We allow creating a customized theme based on another theme.

### `@import` rule

[@import]: https://developer.mozilla.org/en-US/docs/Web/CSS/@import

We support importing another theme with CSS [`@import`][@import] rule. For example, you can dye a boring monochrome theme to a brilliant orange as follows:

```css
/* @theme base */

section {
  background-color: #fff;
  color: #333;
}
```

```css
/* @theme customized */

@import 'base';

section {
  background-color: #f80;
  color: #fff;
}
```

An importing theme must add to theme set by using [`Marpit.themeSet.add(css)`](/usage#add-to-theme-set) in advance.

### `@import-theme` rule

When you are using CSS preprocessors like [Sass], _`@import` might resolve path in compiling_ and be lost its definitions. So you can use `@import-theme` rule alternatively.

[sass]: https://sass-lang.com/

```scss
$bg-color: #f80;
$text-color: #fff;

@import-theme 'base';

section {
  background: $bg-color;
  color: $text-color;
}
```

`@import` for theme and `@import-theme` can place on anywhere of the root of CSS. The imported contents is inserted to the beginning of CSS in order per rules. (`@import` is processed before `@import-theme`)

## Tweak style through Markdown

Sometimes you might think that want to tweak current theme instead of customizing theme fully.

Marpit gives the `<style>` HTML element written in Markdown a special treatment. The specified inline style would parse in the context of as same as a theme, and bundle to the converted CSS together with it.

```markdown
---
theme: base
---

<style>
section {
  background: yellow;
}
</style>

# Tweak style through Markdown

You would see a yellow slide.
```

`<style>` elements would not find in rendered HTML, and would merge into emitted CSS.

[`style` global directive](/directives#tweak-theme-style) also can use as same purpose.

### Scoped style

We also support the scoped inline style through `<style scoped>`. When a `style` element has the `scoped` attribute, its style will apply only to the current slide page only.

```markdown
<!-- Global style -->
<style>
h1 {
  color: red;
}
</style>

# Red text

---

<!-- Scoped style -->
<style scoped>
h1 {
  color: blue;
}
</style>

# Blue text (only in the current slide page)

---

# Red text
```

It is useful when you want to fine-tune styles per slide page.
