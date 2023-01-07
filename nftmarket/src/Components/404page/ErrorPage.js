import React from "react";
import errpage from "./errorpage.module.css";
const ErrorPage = () => {
  return (
    <div>
      <div class={errpage.aligncenter}>
        <div class={errpage.fourzerofourbg}>
          <h1>404</h1>
        </div>

        <div class={errpage.contantbox404}>
          <h3 class={errpage.h2}>Look like you're lost</h3>

          <p>the page you are looking for not avaible!</p>

          <h3 class={errpage.link404}>Go to Home</h3>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
