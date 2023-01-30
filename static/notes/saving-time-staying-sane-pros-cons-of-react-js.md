title: Saving Time & Staying Sane? Pros & Cons of React.js
published: 2014-07-21 23:01:09
created: 2014-07-07 08:10:48
updated: 2014-07-21 23:01:09

~

When I began working for [m›PATH](http://mpath.com) earlier this year, one of the exciting early tasks was putting together our new web app tech stack, which currently consists of Ruby/Sinatra, Sass/Autoprefixer, CoffeeScript—and [React.js](http://facebook.github.io/react/).

We're building an ambitious new web app, where the UI complexity represents most of the app's complexity overall. It includes a tremendous amount of UI widgets as well as a lot rules on _what-to-show-when_. This is exactly the sort of situation [React.js was built to simplify](https://www.youtube.com/watch?v=x7cQ3mrcKaY).

Overall, we've had a great experience using React.js. In my experience, the biggest benefit of the framework is how it effectively makes obsolete a number of front-end concerns and problem domains.

## <a href="/articles/saving-time-staying-sane-pros-cons-of-react-js#tighter-coupling" name="tighter-coupling">Big win: Tighter coupling of markup and behavior</a>

In React.js, markup and JavaScript behavior are defined together in the same file, and event handling is defined directly on the relevant DOM nodes—similarly to for instance Angular (as well as DHTML for those who remember).

Here's a simple example:

```coffeescript
ToggleButton = React.createClass
  getInitialState: ->
    active: false

  toggle: ->
    @setState active: not @state.active

  render: ->
    React.DOM.button
      className: 'active' if @state.active
      onClick: @toggle
```

So, how does this make our life easier?

- We no longer need to query the DOM. As a result, we also no longer have to spend time thinking up the right selectors to get the elements we want.
- There's no longer any way to have markup/event-handler mismatch. This makes it easier to iterate on CSS class names as well as markup.
- In React, all events get [delegated](http://davidwalsh.name/event-delegate) for free. As a result, event delegation is no longer something your team needs to worry about.

## <a href="/articles/saving-time-staying-sane-pros-cons-of-react-js#css-outside-react" name="css-outside-react">Jury's still out: CSS lives outside React.js</a>

Given the maintenance wins outlined above, the natural next step might be to look at whether a component's CSS could also live together with the component.

In my experience, the number of lines of CSS often outnumber the JavaScript/markup two or three to one, so I'm not sure if it would be a great idea to include the CSS in the component file itself.

Having said that, there are “architecture smells” to the current solution:

- With a coupled tuple of `my_component.coffee` and `my_component.css` files for each component in a project, it is easier for things to accidentally get out of sync when renaming or removing components.
- If we want to import a third-party component, we will typically have to integrate several files.
- To understand a UI component, it is often necessary to see its CSS. For instance, CSS transitions and animations, `pointer-events` and `display` control functionality, yet “live” inside our CSS.

In other words, I wonder what gains could be had from making CSS a more integrated part of React.js.

## <a href="/articles/saving-time-staying-sane-pros-cons-of-react-js#cascading-updates" name="cascading-updates">Big win: Cascading updates and functional thinking</a>

React.js invites us to think about our web app's UI as a tree where each level decides how to delegate responsibilities down to its branches.

The mental model is beautifully simple: A component is basically a function that receives a set of `@props` (properties) and returns a description of how to render itself given those properties and its internal `@state`. As long as we stay true to this intended cascading architecture, we are guaranteed that the application is always up-to-date. React.js relieves us of the need to worry about updating the DOM.

When reasoning about your app, you can imagine that the entire application re-renders every time there is a change in state—whenever the user clicks on something, or new data is retrieved from the back end.

(In practice, React is a lot more efficient than that, [performing a diff operation](http://calendar.perfplanet.com/2013/diff/) behind the scenes to avoid redrawing more than necessary.)

Other JavaScript frameworks like [AngularJS](https://angularjs.org/) and [Ember.js](http://emberjs.com/) provide similar mechanisms, but React's virtual DOM approach [appears to have performance benefits](http://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/) as UIs grow more complex.

## <a href="/articles/saving-time-staying-sane-pros-cons-of-react-js#verbose-propagation" name="verbose-propagation">Jury's still out: Verbose propagation</a>

In React.js, by default the children of a component know nothing about their parent. The parent has to explicitly tell them anything they need to know.

For example, imagine that we have an application with a comment form, and this form needs to know about the current user's login state:

```coffeescript
Application = React.createClass
  render: ->
    Article
      user: Users.getCurrentUser()

Article = React.createClass
  ..
  render: ->
    ArticleContent()
    CommentForm user: @props.user
```

This way of propagating knowledge though your application seems simple enough early on, but it can become a bit verbose and error-prone as the application grows. In my experience, the leaf node (`CommentForm` in the example) might easily appear 5–10 levels deep in the UI hierarchy, which means that we might end up with 5–10 instances of `user: @props.user` strewn out over our code base.

Often, there is more than just one piece of knowledge that need to get propagated out in this manner, and we end up with the following concerns:

- The intermediate components now contain repetitive implementation details, which makes them harder to maintain.
- The additional noise can make the core logic of these intermediate components harder to understand.

To avoid this, we might reach for React's built-in `@transferPropsTo` method. It can simplify the surface propagation for us, making this:

```coffeescript
render: ->
  CommentForm
    user: @props.user
    applicationColor: @props.applicationColor
    articleId: @props.articleId
```

into:

```coffeescript
render: ->
  @transferPropsTo CommentForm()
```

However, this approach comes with its own drawbacks:

- It is no longer easy to see what inputs are used by the `CommentForm`
- If we have a lot of “global” knowledge that needs to be available throughout the application, we end up prefacing a lot of component calls with `@transferPropsTo`, which again makes the core logic slightly harder to discern.

As of now, propagating props explicitly might be the lesser of evils. Luckily, it seems [the React team is aware of the issue](http://facebook.github.io/react/blog/2014/03/28/the-road-to-1.0.html) and looking at ways to resolve it.

## <a href="/articles/saving-time-staying-sane-pros-cons-of-react-js#thinking-in-components" name="thinking-in-components">Big win: Thinking in components</a>

The push towards UIs that are reusable and composable has turned out to be a major productivity win for us.

Of course, this is not an idea unique to React—we see the same idea practically all over the place: [web components](http://css-tricks.com/modular-future-web-components/), Ember, Angular, [Backbone](http://backbonejs.org/) and other frameworks all provide similar abstractions.

Suffice it to say that React makes it easy to take advantage of composability. For example, in our current application, we have these components:

- `Form.Dropdown`: a button, which when clicked will show/hide a dropdown, similar to HTML’s `<select>` element.
- `Form.RadioSet`: a set of `<input type="radio">` elements with labels.

When the need came up to implement a custom drop down similar to a `<select>`, all we had to do was something like this:

```coffeescript
Form.SelectDropdown = React.createClass
  render: ->
    Form.Dropdown
      className: 'form-select-dropdown'
      children: @transferPropsTo Form.RadioSet()
```

The only thing that remained was to add special styles for the `form-select-dropdown` class—and we were done.

## <a href="/articles/saving-time-staying-sane-pros-cons-of-react-js#wrapping-up" name="wrapping-up">Wrapping up</a>

That's it! What has been your experience with React? Let me know in the comments!

If you want more updates from me, I have an [RSS feed](/articles.rss) and a [Twitter profile](https://www.twitter.com/oerhoert), and if you'd like to get in touch—[m›PATH is hiring](http://mpath.com/)—you can reach me at kentwilliam [ at ] gmail [ dot ] com.

Take care,  
/Kent William
