/* global google:readonly  */
import "firebase/database";
import "firebase/auth";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { FC, StrictMode, useEffect } from "react";
import { GoogleOneTapCredential, GoogleOneTapResponse } from "./types.d";
import { Route, Switch } from "react-router";

import { AddProduct } from "./modals/AddProduct";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { EnterListName } from "./modals/EnterListName";
import { EnterListPin } from "./modals/EnterListPin";
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import { GettingStarted } from "./pages/GettingStarted";
import { ListDetails } from "./pages/ListDetails";
import ReactDOM from "react-dom";
import { RemoveProduct } from "./modals/RemoveProduct";
import { ThemeProvider } from "@material-ui/core/styles";
import firebase from "firebase/app";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import jwtDecode from "jwt-decode";
import reportWebVitals from "./reportWebVitals";
import { theme } from "./theme";
import { useCredential } from "./hooks/useCredential";

i18next.use(initReactI18next);
i18next.init({
  lng: "ru",
  fallbackLng: "en",
  resources: {
    ru: {
      translation: {
        "Connect to existing groceries list": "Подключиться к списку продуктов",
        "Create my own groceries list": "Создать собственный список продуктов",
        "Enter list PIN": "Введите пин-код списка",
        "List PIN": "ПИН-код списка",
        "Connect to list": "Подключиться к списку",
        Cancel: "Отмена",
        "To connect to other's list You should ask that person about it's list PIN":
          "Для того, чтобы подключиться к списку вам нужно спросить у его автора ПИН-код",
        "Entered PIN doen't correspond to any list":
          "Нет такого списка, который бы соответствовал введенному ПИН-у",
        "Enter list name": "Введите название списка",
        "Enter list name to start new list":
          "Введите название списка, чтобы создать новый список",
        "List name": "Название списка",
        "Create new list": "Создать список",
        "My list": "Мой список",
        "Create list": "Создать список",
        Other: "Другое",
        "My lists": "Мои списки",
        "Shared with me": "Доступно мне",
        "Enter product name": "Введите название продукта",
        "Enter product name to add new product":
          "Введите название продукта, чтобы добавить новый продукт в список",
        "Product name": "Название продукта",
        "Create new product": "Добавить продукт",
        "Are You sure about remove product?":
          "Вы точно уверены, что хотите удалить продукт?",
        "Remove this product": "Удалить продукт",
      },
    },
  },
});

// @ts-expect-error TS2741
window.firebase = firebase;

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
});

const Root: FC<{}> = () => {
  const { sub } = useCredential() || {};

  useEffect(() => {
    firebase
      .database()
      .ref(`users/${sub}/active_list`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const listPin = snapshot.val();
          const nextPathname = `/list/${listPin}`;
          if (window.location.pathname !== nextPathname) {
            window.location.pathname = nextPathname;
          }
        } else {
          const nextPathname = `/getting-started`;
          if (window.location.pathname !== nextPathname) {
            window.location.pathname = nextPathname;
          }
        }
      });
  }, [sub]);

  return (
    <StrictMode>
      <FirebaseDatabaseProvider firebase={firebase}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              <Route exact path="/getting-started" component={GettingStarted} />
              <Route exact path="/list/:listPin" component={ListDetails} />
            </Switch>
            <EnterListPin />
            <EnterListName />
            <AddProduct />
            <RemoveProduct />
          </BrowserRouter>
        </ThemeProvider>
      </FirebaseDatabaseProvider>
    </StrictMode>
  );
};

const getExpDate = (exp: number): Date => {
  return new Date(new Date(exp).setFullYear(new Date().getFullYear()));
};

const isCredentialExpired = (expiresAt: Date): [boolean, number] => {
  return [expiresAt.getTime() < Date.now(), expiresAt.getTime() - Date.now()];
};

const handleGoogleOneTapResult = async ({
  credential,
}: GoogleOneTapResponse) => {
  localStorage.setItem("credential", credential);
  const decodedCredential: GoogleOneTapCredential = jwtDecode(credential);
  localStorage.setItem(
    "credential_expires_at",
    getExpDate(decodedCredential.exp).toISOString()
  );
  await firebase
    .auth()
    .signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(credential)
    );
  ReactDOM.render(<Root />, document.getElementById("root"));
};

// @ts-expect-error TS2304
google.accounts.id.initialize({
  client_id: process.env.REACT_APP_CLIENT_ID,
  nonce: process.env.REACT_APP_NONCE,
  callback: handleGoogleOneTapResult,
});

const promptGoogleOneTap = () => {
  delete localStorage["credential"];
  delete localStorage["credential_expires_at"];

  // @ts-expect-error TS2304
  google.accounts.id.prompt();
};

if (localStorage.getItem("credential")) {
  const expiredAtDate = new Date(
    localStorage.getItem("credential_expires_at") as string
  );
  const [isExpired, timeToExpire] = isCredentialExpired(expiredAtDate);
  if (isExpired) {
    promptGoogleOneTap();
  } else {
    setTimeout(promptGoogleOneTap, timeToExpire);
    firebase
      .auth()
      .signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(
          localStorage.getItem("credential")
        )
      )
      .then(() => {
        ReactDOM.render(<Root />, document.getElementById("root"));
      });
  }
} else {
  promptGoogleOneTap();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
