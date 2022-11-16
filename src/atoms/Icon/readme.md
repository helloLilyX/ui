
### Examples

```jsx
<Icon name="user" />
```

For a full list of available icon names, see [Font Awesome 4.7.0 Icons](https://fontawesome.com/v4.7.0/icons/)

#### Animation

```jsx
<Icon name="spinner" spin={true} />
```

#### Circling the icon

```jsx
<Icon name="user" circled={true} />
```

### Accessibility

By default, an icon is hidden to screen readers. To add screen reader text, add it using the `label` prop.

```jsx
<Icon name="external-link" label="Link to an external website" />
```

When using an icon to indicate the loading state of content, wrap it in a `<LazyLoaded>`.

```jsx
import { LazyLoaded } from '@ORIS/ui';

<LazyLoaded 
    loading={true}
    placeholder={<Icon name="spinner" spin={true} />}
>
    Content to display when loading is complete.
</LazyLoaded>
```