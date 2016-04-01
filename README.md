# mosquitobanusa.com
MosquitoBanUSA's website source compiles down a static website intended for GitHub pages.

## Setting up for development

First, install all of the dev. dependencies for the project.

```
git clone git@github.com:icasperzen/mosquitobanusa.com.git
cd mosquitobanusa.com
git checkout development
npm install
bower install
```

Now you can use `gulp build` or `gulp serve`.

The source for the site is located in `_app/`. We use Jade for templating.

## Deployment

The compiled site will be located in `_site/`.
To deploy, switch to the orphan `gh-pages` branch and copy the contents of `_site/` in.

## Notes

It may be worth removing the image minification build step.
I guess image minification isn't deterministic -- the repository size is blowing up because of it.
