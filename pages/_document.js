import React from "react";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* <title>Foiti Admin</title> */}
        <meta name="description" content="Admin Panel for Foiti App" />
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.png" />
        {/* Fonts and icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <body>
        <div id="page-transition"></div>
        <Main />
        <NextScript />
      </body>
      <script
        type="text/javascript"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API}&libraries=places`}
        defer
      />
    </Html>
  );
}
