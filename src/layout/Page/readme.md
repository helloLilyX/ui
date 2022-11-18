
### Examples

#### Implementation Options

##### Option 1 - As component container
The preferred method is to use `<Page>` as the container of a component. The `<Page>` component accepts props for `id` and `className` to make this easier.

```html
const Workspace: React.FC = () => {
    return (
        <Page 
            title="Workspace - My App | Office of Research"
            id="workspace"
            className="one-column-page"
        >
            Workspace content...
        </Page>
    );
}
```

##### Option 2 - In App.tsx
If you are retrofitting an older application, the simplest way to implement this component is to wrap each Route element in App.tsx with a `<Page>`.

```html
<main id="content">
    <Routes>
        <Route path="/" element={
            <Page title="My App | Office of Research">
                <Workspace />
            </Page>
        } />
        <Route element={
            <Page title="Page Not Found - My App | Office of Research">
                <NotFound />
            </Page>
        } />
    </Routes>
</main>
```

#### Focus Management
By default, when the `<Page>` component mounts, it will move the keyboard focus to a hidden container with the `<Page>` title and helper text for screen reader users. Keyboard users can then navigate the page starting at the top as if they were navigating a new page on a multipage website.

In some use cases, the default behavior will result in a poorer user experience. For example, the ideal user experience for a multipage form is for the focus to move directly to the new content after the user presses the next or previous button.

To achieve this behavior, the `<Page>` component accepts an optional `focusRef` prop.
**Important:** The `focusRef` MUST be in the tab order to be focusable. Unless the element is interactive (i.e. a form element, link, or button), you must set a tabIndex of `-1` for this to work properly.

```html
import React, { useRef } from 'react';

const PageFour: React.FC = () => {
    const h1 = useRef<HTMLHeadingElement>(null);

    return (
        <Page 
            title="Page 4 - My App | Office of Research"
            focusRef={h1}
        >
            <h1 ref={h1} tabIndex={-1}>
                Page 4
            </h1>

            Page content...
        </Page>
    );
}
```