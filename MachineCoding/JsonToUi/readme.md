Given a nested JSON object that represents a UI tree, recursively render React elements based on the node type, props, and children. The solution should handle deeply nested structures and unknown node types gracefully. 

```js
{ 
    type: "div", 
    props: { className: "box" }, 
    children: [
        { 
            type: "button", 
            props: { 
                onClick: handleClick, 
                text: "Click me" 
            } 
        }
    ]
}
```
should render a div containing a clickable button.