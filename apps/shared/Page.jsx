import React from "react";
import Card from "./Card";

export default function Page({ title, children, ...props }) {
  return (
    <Card {...props}>
      {title && <h2>{title}</h2>}
      {children}
    </Card>
  );
}
