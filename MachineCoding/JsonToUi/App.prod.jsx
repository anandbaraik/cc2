import React from 'react';

/***************************************
 * Example Custom Components
 ***************************************/
function Card({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "16px",
        margin: "10px"
      }}
    >
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function PrimaryButton({ text, ...props }) {
  return (
    <button
      style={{
        background: "blue",
        color: "white",
        padding: "8px 12px",
        border: "none",
        cursor: "pointer"
      }}
      {...props}
    >
      {text}
    </button>
  );
}

/***************************************
 * Component Registry
 * Maps custom component names
 ***************************************/
const componentRegistry = {
  Card,
  PrimaryButton
};

/***************************************
 * Recursive Renderer
 ***************************************/
function RenderNode({ node }) {
  // Handle invalid/null node
  if (!node || typeof node !== "object") {
    return null;
  }

  const {
    type,
    props = {},
    children = []
  } = node;

  // Resolve component
  // Check custom registry first
  let Component = componentRegistry[type];

  // If not custom component,
  // assume HTML element
  if (!Component) {
    const validHtmlElements = [
      "div",
      "span",
      "p",
      "button",
      "section",
      "h1",
      "h2",
      "h3",
      "ul",
      "li",
      "input",
      "img"
    ];

    if (validHtmlElements.includes(type)) {
      Component = type;
    } else {
      console.warn(`Unknown component type: ${type}`);

      // Graceful fallback
      return (
        <div style={{ color: "red" }}>
          Unsupported component: {type}
        </div>
      );
    }
  }

  // Extract text separately
  const { text, ...restProps } = props;

  // Render children recursively
  const renderedChildren = children.map(
    (child, index) => (
      <RenderNode
        key={index}
        node={child}
      />
    )
  );

  // Create final element
  return (
    <Component {...restProps}>
      {text}
      {renderedChildren}
    </Component>
  );
}

/***************************************
 * Example JSON Tree
 ***************************************/
const uiTree = {
  type: "div",
  props: {
    className: "container",
    style: {
      padding: "20px",
      border: "2px solid black"
    }
  },
  children: [
    {
      type: "h1",
      props: {
        text: "Dynamic UI Renderer"
      }
    },

    {
      type: "button",
      props: {
        text: "Native Button",
        onClick: () =>
          alert("Native button clicked")
      }
    },

    {
      type: "PrimaryButton",
      props: {
        text: "Custom Button",
        onClick: () =>
          alert("Custom button clicked")
      }
    },

    {
      type: "Card",
      props: {
        title: "Profile Card"
      },
      children: [
        {
          type: "p",
          props: {
            text: "This is inside Card"
          }
        },

        {
          type: "button",
          props: {
            text: "Save",
            onClick: () =>
              alert("Saved")
          }
        }
      ]
    },

    {
      type: "UnknownComponent"
    }
  ]
};

/***************************************
 * App Component
 ***************************************/
function App() {
  return (
    <div>
      <RenderNode node={uiTree} />
    </div>
  );
}

export default App
