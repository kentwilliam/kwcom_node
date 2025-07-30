title: Rebooting my website
published: 2023-03-01 15:00:00
created: 2023-03-01 15:00:00
updated: 2023-03-01 15:00:00

~

I figured I'd write a few lines about this newest iteration of kentwilliam.com.

With time, I hope this site can serve as an online portfolio of sorts, but for now, my aim is simply to *write more*, and this will be my outlet.

To get started and avoid over-thinking it, I'm planning to start writing up small notes on the books I've read recently, and perhaps also some on videogames and records of note. I like the idea of this site becoming a bit of a log of the things I've discovered and loved.

## What's the tech?

Technically, this new version of the site is written on Node, using the `marked` and `memory-cache` NPM packages and not much else. The notes themselves are markdown files, read on request and then cached in-memory. 

You can check out the implementation [on GitHub](https://github.com/kentwilliam/kwcom_node) if you're curious. 

You might wonder why the site is written from-scratch to begin with, and perhaps also why I'm not using a static site generator. 

The answer to both is flexibility. I intend to play around more with transitions and animation in the future, and I didn't want to get stuck fighting opinions that weren't mine. 

Additionally, I'm also in it for the fun of exploring the tools. Most days, I'm writing web software on top of the rather comprehensive tech stack we have at [Meta](https://www.meta.com). It's a very powerful set of systems, and I enjoy working in that environment tremendously, but by going back to the basics, I'm getting to do something a bit different and learn more about how the pain points of a tiny site differ from the pain points of the huge monorepo of apps and sites that I work in most days.

For example, for this site, I haven't yet needed to introduce things such as:

- Types/Flow/TypeScript
- Webpack / build scripts
- React
- CSS processing / CSS-in-JS / Tailwind
- Routing frameworks
- Relay/GraphQL
- Databases
- Admin / auth / CMS UIs

Of course, I have no beef with any of these. It's just fun to work from a simpler foundation sometimes. It also removes a *lot* of complexity, which can sometimes help speed up iteration and encourage experimentation. 

(Most systems solve problems with scaling, and this site is blessed with having no scale and essentially no traffic. 😎)

Having said that, in going minimalist, some pain points make themselves known pretty quickly:

- Markdown/rich text: I need support for rich text and images, and I don't want to write my own Markdown parser, so I've pulled in `marked` to avoid reinventing that particular wheel.
- Cache busting: I think I'll probably want to add this soon.
- Analytics: I want to be able to track traffic, but I want the tracking to respect visitor privacy. I'll need to do some more research here.

Additionally, I'm probably going to reintroduce a database soon as well. Right now, it's fine to pull in every note into memory to parse out its metadata, but that's only true because there are almost no notes on the site.

One upside to this approach, though, is that I get to leverage Git for version history, and it becomes trivial to go back to the site the way it looked at any particular date. It also means the notes can be viewed directly [in the GitHub UI](https://github.com/kentwilliam/kwcom_node/tree/310878572e8a0d315a2feac65d614042447ff092/static/notes). I'm not sure how *useful* this is exactly, but it's a neat example of the interoperability upside of leveraging standard text formats and versioning systems.

Anyway, that's all there is to it. It's not terribly interesting, as such, yet, but I'm excited to get the site back up anyway.

## Hosting

The site is currently hosted on [Railway](https://railway.app), with domain name managed on [Hover](https://hover.com). 

Both of them are rather pleasant and straightforward to use. I particularly like Railway's GitHub and Node integration, which means I don't have to SSH my way into a VPS if I want to update the site, and instead can rely on automatic deploys when updates are made to the Git repository.

(I used to manage my own server with SSH, and although it's not *that* painful, it's fussy enough that I'd be happy never needing to do that again.)
