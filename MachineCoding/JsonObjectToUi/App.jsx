import React from 'react';

function RenderNode({node}) {
  if(!node) return null;

  const {type, props={}, children=[]} = node;

  //handle unknown html tags
  const validElements = [
    "div",
    "span",
    "button",
    "p",
    "section",
    "input",
    "img",
    "ul",
    "li",
    "h1"
  ];

  if(!validElements.includes(type)) {
    console.error(`${type} is not valid.`);
    return null;
  }

  //extract the text for buttons separately
  const {text, ...restProps} = props;

  return React.createElement(
    type,
    restProps,
    text,
    children.map((child, index) => <RenderNode key={index} node={child}/>)
  );
} 

function App() {

  const handleClick = () => {
    console.log('btn is Clicked');
  }

  const uiTree = {
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
};

const uiTree2 = {
  type: "div",
  props: { className: "container" },
  children: [
    {
      type: "h1",
      props: { text: "Hello" }
    },
    {
      type: "button",
      props: {
        text: "Submit",
        onClick: () => alert("clicked")
      }
    }
  ]
};

  return (
    <>
      <RenderNode node={uiTree}/>
      <br/>
      <RenderNode node={uiTree2}/>
    </>
  )
}

export default App
