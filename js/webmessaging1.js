const OriginatingEntity = Object.freeze({
  Human: "Human",
  Bot: "Bot",
});
var current_OriginatingEntity = "";
var ConversationOpened = false;

function genesysWidget() {
  Window.Genesys = null;
  var gdeploymentId;
  gdeploymentId = document.getElementById("CBoxdeploymentId").value;

  (function (g, e, n, es, ys) {
    g["_genesysJs"] = e;
    g[e] =
      g[e] ||
      function () {
        (g[e].q = g[e].q || []).push(arguments);
      };
    g[e].t = 1 * new Date();
    g[e].c = es;
    ys = document.createElement("script");
    ys.async = 1;
    ys.src = n;
    ys.charset = "utf-8";
    document.head.appendChild(ys);
  })(window, "Genesys", "https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js", {
    environment: "use1",
    deploymentId: gdeploymentId,
  });

  Eventos();
}

function ToggleWidget() {
  let boton = document.getElementById("toggle");
  if (boton.innerHTML == "Mostrar Chat") {
    Genesys("command", "Messenger.open", {}, function (o) {});
    boton.innerHTML = "Ocultar Chat";
  } else {
    Genesys("command", "Messenger.close", {}, function (o) {});
    boton.innerHTML = "Mostrar Chat";
  }
}

function Eventos() {
  console.log("==== Eventos  :: inicio");
  if (typeof Genesys == "undefined") {
    console.log("==== Eventos  :: error aun lo existe objeto Genesys");
    return;
  }

  let btngenesysWidget = document.getElementById("btngenesysWidget");
  btngenesysWidget.className = "oculto";

  Genesys("subscribe", "MessagingService.messagesReceived", function (o) {
    const mensaje = o.data.messages[0].text;
    const direction = o.data.messages[0].direction;
    if (direction == "Outbound" && ElURLdeSmartVideo(mensaje)) {
      //EnviarPostAParent(mensaje);
      console.warn("---------------- EnviarPostAParent -------------");
    }
  });

  Genesys("subscribe", "Conversations.closed", function () {
    ConversationOpened = false;
    console.log("*******Conversations.closed*******");
  });
  Genesys("subscribe", "Conversations.opened", function () {
    ConversationOpened = true;
    console.log("*******Conversations.opened*******");
  });
  Genesys("subscribe", "Launcher.ready", function (o) {
    console.log("*******Launcher.ready*******");
    let btngenesysWidget = document.getElementById("estado");
    btngenesysWidget.innerHTML = "Listo";
    let btnIniciarChat = document.getElementById("toggle");
    btnIniciarChat.className = "visible";
  });

  console.log("==== Eventos  :: Final");
}

function ElURLdeSmartVideo(cadena) {
  let resultado = false;
  if (cadena.match("https://davivienda.videoengager.com/.*")) resultado = true;

  return resultado;
}

//----------------------------------------

function BntInciarChat() {
  console.log("-- BntInciarChat :: Inicio ---");
  if (!ConversationOpened) {
    Genesys("command", "Messenger.open", {}, function (o) {});
  }

  let boton = document.getElementById("toggle");
  boton.innerHTML = "Ocultar Chat";
  console.log("-- BntInciarChat :: Fin ---");
}
