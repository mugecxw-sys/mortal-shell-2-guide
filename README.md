# Mortal Shell II Guide

Static English-language guide site for GitHub Pages.

## Publish

1. Create a public GitHub repository named `mortal-shell-2-guide`.
2. Upload this folder's contents to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. In **Settings → Pages**, confirm the public URL after deployment.

The site deliberately uses relative links, so it works at both a GitHub project URL and a custom domain.

## Add a guide

Create a dedicated HTML page for each item rather than making duplicate category pages. Use this pattern:

```text
H1: [Item Name] Location in Mortal Shell 2
Title: [Item Name] Location in Mortal Shell 2 | Mortal Shell II Guide
URL: /collectibles/[item-name]-location/
```

Every item guide should state the region, story requirement, exact route, annotated map, your own screenshots, and any relevant achievement or trophy.

## Templates

Copy `templates/item-location.html` for one item page, or `templates/walkthrough-chapter.html` for a main-story chapter. Replace every bracketed placeholder and remove the `noindex, nofollow` meta tag before publishing the new page.
