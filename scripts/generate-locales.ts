import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { LANGUAGES } from "../src/i18n/languages";

const LOCALES_DIR = path.resolve(import.meta.dirname, "../src/locales");
const EN_PATH = path.join(LOCALES_DIR, "en/common.json");
const enSource = JSON.parse(fs.readFileSync(EN_PATH, "utf-8"));

// High quality vocabulary maps per language family
type LocaleDictionary = {
  brandName?: string;
  roles: { artisan: string; leader: string; buyer: string; ledger: string };
  status: { Pending_Review: string; Live: string; Sold: string; Pending: string; Settled: string };
  common: {
    resetDemoData: string;
    resetConfirm: string;
    close: string;
    cancel: string;
    save: string;
    submit: string;
    loading: string;
    retry: string;
    goHome: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
    pageError: string;
    pageErrorDesc: string;
  };
  artisan: {
    howItWorksTitle: string;
    steps: { step1Title: string; step1Desc: string; step2Title: string; step2Desc: string; step3Title: string; step3Desc: string };
    greeting: string;
    newListingTitle: string;
    instruction: string;
    photoUploadAlt: string;
    changePhoto: string;
    takePhoto: string;
    bolo: string;
    listening: string;
    processing: string;
    stop: string;
    voiceNotSupported: string;
    typeFallbackPlaceholder: string;
    continueWithText: string;
    sentSuccessTitle: string;
    sentSuccessSubtitle: string;
    createAnother: string;
    draftQuote: string;
    itemSummary: string;
    materialsCost: string;
    hoursSpent: string;
    guessedNotice: string;
    speakAgain: string;
    submitToLeader: string;
    recentMemosTitle: string;
    noMemos: string;
    micError: string;
  };
  leader: {
    queueClear: string;
    deterministicPriceTitle: string;
    publish: string;
    edit: string;
    reject: string;
    formulaLabel: string;
    usdBadge: string;
    editModalTitle: string;
    titleField: string;
    materialsField: string;
    hoursField: string;
    marginField: string;
    marginError: string;
    savePrice: string;
  };
  storefront: {
    headline: string;
    subheadline: string;
    emptyState: string;
    byMaker: string;
    payWithPayPal: string;
    payPalCheckout: string;
    requestInvoice: string;
    paidToast: string;
    customInvoiceTitle: string;
    emailPlaceholder: string;
    quantityField: string;
    notesPlaceholder: string;
    estimatedTotal: string;
    calculationBreakdown: string;
    sendInvoice: string;
    sending: string;
    invoiceSentTitle: string;
    invoiceSentSubtitle: string;
  };
  ledger: {
    usdReceived: string;
    inrWithdrawn: string;
    fxRate: string;
    flowSummary: string;
    simulateSettlement: string;
    nothingPending: string;
    upiSettledToast_one: string;
    upiSettledToast_other: string;
    table: {
      item: string;
      usdReceived: string;
      inrWithdrawn: string;
      maker: string;
      share: string;
      status: string;
      empty: string;
    };
    upiCredited: string;
    nothingPendingLog: string;
  };
  assistant: {
    title: string;
    toggleAria: string;
    initialMessage: string;
    inputPlaceholder: string;
    sendAria: string;
    responses: {
      discount: string;
      productDetail: string;
      shipping: string;
      care: string;
      fallback: string;
    };
  };
  errors: {
    micBlocked: string;
    invalidPricing: string;
  };
  language: {
    switcherLabel: string;
    searchPlaceholder: string;
    tier1: string;
    tier2: string;
    tier3: string;
    machineTranslated: string;
    current: string;
  };
};

// Seed dictionaries for Major Global and Regional Languages
const DICTIONARIES: Record<string, Partial<LocaleDictionary>> = {
  // Spanish
  es: {
    brandName: "Didi Direct",
    roles: { artisan: "Voz de la artesana", leader: "Revisión de la líder", buyer: "Tienda de compradores", ledger: "Libro de la federación" },
    status: { Pending_Review: "En revisión", Live: "Publicado", Sold: "Vendido", Pending: "Pendiente", Settled: "Liquidado" },
    common: {
      resetDemoData: "Restablecer datos de prueba",
      resetConfirm: "¿Restablecer todos los datos de prueba?",
      close: "Cerrar",
      cancel: "Cancelar",
      save: "Guardar",
      submit: "Enviar",
      loading: "Cargando…",
      retry: "Reintentar",
      goHome: "Ir al inicio",
      pageNotFound: "Página no encontrada",
      pageNotFoundDesc: "La página que buscas no existe o ha sido movida.",
      pageError: "Esta página no se cargó",
      pageErrorDesc: "Ocurrió un error de nuestra parte. Puedes recargar o regresar al inicio."
    },
    artisan: {
      howItWorksTitle: "Cómo funciona",
      steps: {
        step1Title: "Habla sobre tu artesanía",
        step1Desc: "Toma una foto y describe con tu voz lo que creaste.",
        step2Title: "La IA crea historia y precio en USD",
        step2Desc: "Publicación en inglés con salario justo en dólares.",
        step3Title: "Aprobación de la líder",
        step3Desc: "La líder de tu colectivo revisa y publica."
      },
      greeting: "Hola, Kamla Didi",
      newListingTitle: "Vender un nuevo producto",
      instruction: "Toma una foto y luego descríbela con tu voz.",
      photoUploadAlt: "Foto de la artesanía",
      changePhoto: "Cambiar",
      takePhoto: "Foto",
      bolo: "Hablar",
      listening: "Escuchando…",
      processing: "Comprendiendo tu voz…",
      stop: "Detener",
      voiceNotSupported: "El reconocimiento de voz no está disponible en este idioma en tu navegador. Escribe la descripción abajo.",
      typeFallbackPlaceholder: "Ej. Bufanda de seda roja hecha a mano, tomó 6 horas, costo de materiales ₹300...",
      continueWithText: "Continuar con descripción escrita",
      sentSuccessTitle: "¡Enviado a la líder del colectivo!",
      sentSuccessSubtitle: "Enviado para revisión.",
      createAnother: "Listar otro artículo",
      draftQuote: "“{{transcript}}”",
      itemSummary: "₹{{materials}} materiales · {{hours}} hrs · {{craft}}",
      materialsCost: "₹{{materials}} materiales",
      hoursSpent: "{{hours}} hrs",
      guessedNotice: "No se identificaron claramente los costos o las horas; se estimaron automáticamente. La líder puede ajustarlos antes de publicar.",
      speakAgain: "Hablar de nuevo",
      submitToLeader: "Enviar a la líder",
      recentMemosTitle: "Notas de voz recientes",
      noMemos: "No hay notas de voz aún. Presiona “Hablar” para comenzar.",
      micError: "El micrófono no está disponible. Concede permisos en tu navegador. Reproduciendo voz de demostración."
    },
    leader: {
      queueClear: "La cola de revisión está despejada.",
      deterministicPriceTitle: "Precio determinista",
      publish: "Publicar",
      edit: "Editar",
      reject: "Rechazar",
      formulaLabel: "(₹{{materials}} + {{hours}}h × ₹{{wageFloor}}) ÷ (1 − {{margin}}) × {{fx}}",
      usdBadge: "USD",
      editModalTitle: "Editar precio",
      titleField: "Título",
      materialsField: "Materiales ₹",
      hoursField: "Horas",
      marginField: "Margen (0–0.99)",
      marginError: "El margen debe estar entre 0 y 0.99.",
      savePrice: "Guardar precio"
    },
    storefront: {
      headline: "Hecho a mano, directo de la creadora.",
      subheadline: "Cada compra paga a una artesana en la India en cuestión de minutos.",
      emptyState: "Aún no hay productos publicados. Los artículos aparecerán aquí.",
      byMaker: "Por {{maker}} · {{collective}}",
      payWithPayPal: "Pagar con PayPal",
      payPalCheckout: "Pagar con PayPal",
      requestInvoice: "Solicitar factura personalizada",
      paidToast: "Pagado · {{orderId}}",
      customInvoiceTitle: "Factura personalizada",
      emailPlaceholder: "comprador@empresa.com",
      quantityField: "Cantidad",
      notesPlaceholder: "Colores, tallas, fecha de entrega…",
      estimatedTotal: "Total estimado:",
      calculationBreakdown: "(${{unitPrice}} × {{qty}})",
      sendInvoice: "Enviar factura PayPal",
      sending: "Enviando…",
      invoiceSentTitle: "Factura {{id}} enviada",
      invoiceSentSubtitle: "Total ${{total}} mediante facturación PayPal"
    },
    ledger: {
      usdReceived: "USD recibidos (PayPal)",
      inrWithdrawn: "INR retirados al banco",
      fxRate: "Tipo de cambio FX",
      flowSummary: "PayPal USD → Cuenta SBI Federación → UPI a artesanas",
      simulateSettlement: "Simular liquidación instantánea UPI",
      nothingPending: "Nada pendiente por liquidar",
      upiSettledToast_one: "{{count}} pago UPI liquidado al instante",
      upiSettledToast_other: "{{count}} pagos UPI liquidados al instante",
      table: {
        item: "Artículo",
        usdReceived: "USD recibidos",
        inrWithdrawn: "INR retirados",
        maker: "Artesana",
        share: "Participación",
        status: "Estado",
        empty: "No hay pagos aún. Las ventas de la tienda aparecerán aquí."
      },
      upiCredited: "UPI acreditado",
      nothingPendingLog: "nada pendiente"
    },
    assistant: {
      title: "Asistente Didi",
      toggleAria: "Asistente",
      initialMessage: "¡Hola! Pregúntame sobre cualquier pieza. No puedo cambiar los precios.",
      inputPlaceholder: "Pregunta sobre el producto…",
      sendAria: "Enviar",
      responses: {
        discount: "Los precios se fijan mediante una fórmula justa e inmutable, por lo que no puedo modificarlos. Para pedidos al por mayor, solicita una factura personalizada.",
        productDetail: "{{title}}: {{description}} Hecho por {{maker}} en aprox. {{hours}} horas. Precio: ${{price}} (fijo).",
        shipping: "Enviamos a todo el mundo desde la India, usualmente en 7 a 12 días.",
        care: "Lavar a mano con agua fría y jabón suave; secar a la sombra para preservar los tintes naturales.",
        fallback: "Pregúntame sobre cualquier pieza, materiales, cuidado o envíos."
      }
    },
    errors: {
      micBlocked: "Micrófono bloqueado o no disponible.",
      invalidPricing: "Detalles de precio no válidos."
    },
    language: {
      switcherLabel: "Idioma",
      searchPlaceholder: "Buscar idioma…",
      tier1: "Idiomas de la India",
      tier2: "Idiomas globales de compradores",
      tier3: "Otros idiomas",
      machineTranslated: "Traducción automática",
      current: "Idioma actual"
    }
  },

  // French
  fr: {
    brandName: "Didi Direct",
    roles: { artisan: "Voix de l'artisane", leader: "Examen de la responsable", buyer: "Boutique acheteur", ledger: "Grand livre de la fédération" },
    status: { Pending_Review: "En révision", Live: "En ligne", Sold: "Vendu", Pending: "En attente", Settled: "Réglé" },
    common: {
      resetDemoData: "Réinitialiser les données de démo",
      resetConfirm: "Réinitialiser toutes les données de démo ?",
      close: "Fermer",
      cancel: "Annuler",
      save: "Enregistrer",
      submit: "Soumettre",
      loading: "Chargement…",
      retry: "Réessayer",
      goHome: "Accueil",
      pageNotFound: "Page non trouvée",
      pageNotFoundDesc: "La page recherchée n'existe pas ou a été déplacée.",
      pageError: "La page n'a pas pu se charger",
      pageErrorDesc: "Une erreur est survenue de notre côté. Vous pouvez actualiser ou retourner à l'accueil."
    },
    artisan: {
      howItWorksTitle: "Comment ça fonctionne",
      steps: {
        step1Title: "Parlez de votre création",
        step1Desc: "Prenez une photo et décrivez votre création avec votre voix.",
        step2Title: "L'IA crée l'histoire et le prix en USD",
        step2Desc: "Fiche en anglais avec un prix en dollars assurant un salaire équitable.",
        step3Title: "Validation de la responsable",
        step3Desc: "La responsable de votre collectif valide et publie."
      },
      greeting: "Bonjour, Kamla Didi",
      newListingTitle: "Mettre en vente un nouvel article",
      instruction: "Prenez une photo, puis décrivez-la à la voix.",
      photoUploadAlt: "Photo de l'artisanat",
      changePhoto: "Modifier",
      takePhoto: "Photo",
      bolo: "Parler",
      listening: "À l'écoute…",
      processing: "Compréhension de votre voix…",
      stop: "Arrêter",
      voiceNotSupported: "La reconnaissance vocale n'est pas disponible pour cette langue sur votre navigateur. Veuillez saisir votre description ci-dessous.",
      typeFallbackPlaceholder: "Ex. Écharpe en soie rouge faite main, 6 heures de travail, coût des matières ₹300...",
      continueWithText: "Continuer avec la description textuelle",
      sentSuccessTitle: "Envoyé à la responsable du collectif !",
      sentSuccessSubtitle: "Transmis pour révision.",
      createAnother: "Mettre un autre article en vente",
      draftQuote: "“{{transcript}}”",
      itemSummary: "₹{{materials}} matières · {{hours}} h · {{craft}}",
      materialsCost: "₹{{materials}} matières",
      hoursSpent: "{{hours}} h",
      guessedNotice: "Coûts ou heures non détectés clairement ; estimés automatiquement. Votre responsable peut les ajuster avant publication.",
      speakAgain: "Parler à nouveau",
      submitToLeader: "Envoyer à la responsable",
      recentMemosTitle: "Mémos vocaux récents",
      noMemos: "Aucun mémo vocal pour l'instant. Appuyez sur « Parler » pour commencer.",
      micError: "Microphone inaccessible. Veuillez autoriser le microphone dans votre navigateur. Lecture de la voix de démo."
    },
    leader: {
      queueClear: "La file de révision est vide.",
      deterministicPriceTitle: "Prix déterministe",
      publish: "Publier",
      edit: "Modifier",
      reject: "Rejeter",
      formulaLabel: "(₹{{materials}} + {{hours}}h × ₹{{wageFloor}}) ÷ (1 − {{margin}}) × {{fx}}",
      usdBadge: "USD",
      editModalTitle: "Modifier le tarif",
      titleField: "Titre",
      materialsField: "Matières ₹",
      hoursField: "Heures",
      marginField: "Marge (0–0.99)",
      marginError: "La marge doit être comprise entre 0 et 0.99.",
      savePrice: "Enregistrer le prix"
    },
    storefront: {
      headline: "Fait main, directement auprès de l'artisane.",
      subheadline: "Chaque achat rémunère une artisane en Inde en quelques minutes.",
      emptyState: "Aucun produit en ligne pour l'instant. Les créations validées apparaîtront ici.",
      byMaker: "Par {{maker}} · {{collective}}",
      payWithPayPal: "Payer avec PayPal",
      payPalCheckout: "Payer avec PayPal",
      requestInvoice: "Demander une facture personnalisée",
      paidToast: "Payé · {{orderId}}",
      customInvoiceTitle: "Facture sur mesure",
      emailPlaceholder: "acheteur@entreprise.com",
      quantityField: "Quantité",
      notesPlaceholder: "Couleurs, tailles, date de livraison…",
      estimatedTotal: "Total estimé :",
      calculationBreakdown: "(${{unitPrice}} × {{qty}})",
      sendInvoice: "Envoyer la facture PayPal",
      sending: "Envoi en cours…",
      invoiceSentTitle: "Facture {{id}} envoyée",
      invoiceSentSubtitle: "Total ${{total}} via facturation PayPal"
    },
    ledger: {
      usdReceived: "USD reçus (PayPal)",
      inrWithdrawn: "INR virés sur compte bancaire",
      fxRate: "Taux de change FX",
      flowSummary: "PayPal USD → Compte SBI Fédération → UPI aux artisanes",
      simulateSettlement: "Simuler un règlement UPI instantané",
      nothingPending: "Aucun règlement en attente",
      upiSettledToast_one: "{{count}} paiement UPI réglé instantanément",
      upiSettledToast_other: "{{count}} paiements UPI réglés instantanément",
      table: {
        item: "Article",
        usdReceived: "USD reçus",
        inrWithdrawn: "INR virés",
        maker: "Artisane",
        share: "Part",
        status: "Statut",
        empty: "Aucun paiement pour l'instant. Les ventes de la boutique apparaîtront ici."
      },
      upiCredited: "UPI crédité",
      nothingPendingLog: "rien en attente"
    },
    assistant: {
      title: "Assistant Didi",
      toggleAria: "Assistant",
      initialMessage: "Bonjour ! Posez-moi des questions sur chaque pièce. Je ne peux pas modifier les prix.",
      inputPlaceholder: "Une question sur une création…",
      sendAria: "Envoyer",
      responses: {
        discount: "Les prix sont établis selon une formule équitable et transparente, je ne peux pas les modifier. Pour des commandes en gros, demandez une facture sur mesure.",
        productDetail: "{{title}}: {{description}} Réalisé par {{maker}} en environ {{hours}} heures. Prix : ${{price}} (fixe).",
        shipping: "Expédition internationale depuis l'Inde, généralement en 7 à 12 jours.",
        care: "Lavage doux à froid à la main avec un savon délicat, séchage à l'ombre pour préserver les teintes naturelles.",
        fallback: "Interrogez-moi sur nos articles, les matières, l'entretien ou la livraison."
      }
    },
    errors: {
      micBlocked: "Microphone bloqué ou inaccessible.",
      invalidPricing: "Informations de tarification invalides."
    },
    language: {
      switcherLabel: "Langue",
      searchPlaceholder: "Rechercher une langue…",
      tier1: "Langues de l'Inde",
      tier2: "Langues internationales",
      tier3: "Autres langues",
      machineTranslated: "Traduction automatique",
      current: "Langue active"
    }
  },

  // German
  de: {
    brandName: "Didi Direct",
    roles: { artisan: "Stimme der Handwerkerin", leader: "Prüfung durch Kollektivleitung", buyer: "Käufer-Marktplatz", ledger: "Föderations-Hauptbuch" },
    status: { Pending_Review: "In Überprüfung", Live: "Live", Sold: "Verkauft", Pending: "Ausstehend", Settled: "Abgerechnet" },
    common: {
      resetDemoData: "Demodaten zurücksetzen",
      resetConfirm: "Alle Demodaten zurücksetzen?",
      close: "Schließen",
      cancel: "Abbrechen",
      save: "Speichern",
      submit: "Absenden",
      loading: "Laden…",
      retry: "Wiederholen",
      goHome: "Zur Startseite",
      pageNotFound: "Seite nicht gefunden",
      pageNotFoundDesc: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      pageError: "Seite konnte nicht geladen werden",
      pageErrorDesc: "Ein Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder kehren Sie zur Startseite zurück."
    },
    artisan: {
      howItWorksTitle: "So funktioniert es",
      steps: {
        step1Title: "Beschreiben Sie Ihr Kunsthandwerk",
        step1Desc: "Machen Sie ein Foto und beschreiben Sie Ihr Werk frei mit Ihrer Stimme.",
        step2Title: "KI erstellt Beschreibung & USD-Preis",
        step2Desc: "Englisches Angebot mit fairem, formelbasiertem Dollarpreis.",
        step3Title: "Freigabe durch die Kollektivleitung",
        step3Desc: "Ihre Leiterin prüft das Werk und schaltet es frei."
      },
      greeting: "Namaste, Kamla Didi",
      newListingTitle: "Neues Kunstwerk einstellen",
      instruction: "Foto aufnehmen und anschließend sprechen.",
      photoUploadAlt: "Hochgeladenes Kunstwerk",
      changePhoto: "Ändern",
      takePhoto: "Foto",
      bolo: "Sprechen",
      listening: "Höre zu…",
      processing: "Verarbeite Spracheingabe…",
      stop: "Stopp",
      voiceNotSupported: "Spracherkennung wird in diesem Browser für diese Sprache nicht unterstützt. Bitte geben Sie den Text unten ein.",
      typeFallbackPlaceholder: "Z.B. Handgewebter roter Seidenschal, 6 Stunden Arbeitszeit, Materialkosten ₹300...",
      continueWithText: "Mit Textbeschreibung fortfahren",
      sentSuccessTitle: "An die Kollektivleiterin übermittelt!",
      sentSuccessSubtitle: "Zur Überprüfung eingereicht.",
      createAnother: "Weiteres Produkt einstellen",
      draftQuote: "“{{transcript}}”",
      itemSummary: "₹{{materials}} Material · {{hours}} Std. · {{craft}}",
      materialsCost: "₹{{materials}} Material",
      hoursSpent: "{{hours}} Std.",
      guessedNotice: "Kosten oder Arbeitsstunden wurden automatisch geschätzt. Ihre Leiterin kann die Werte vor der Veröffentlichung anpassen.",
      speakAgain: "Erneut sprechen",
      submitToLeader: "Zur Prüfung einreichen",
      recentMemosTitle: "Kürzliche Sprachnotizen",
      noMemos: "Noch keine Sprachnotizen vorhanden. Tippen Sie auf „Sprechen“ zum Starten.",
      micError: "Mikrofon nicht verfügbar. Bitte Berechtigung im Browser erteilen. Demo-Audio wird wiedergegeben."
    },
    leader: {
      queueClear: "Die Prüfungs-Warteschlange ist leer.",
      deterministicPriceTitle: "Deterministischer Preis",
      publish: "Freigeben",
      edit: "Bearbeiten",
      reject: "Ablehnen",
      formulaLabel: "(₹{{materials}} + {{hours}}h × ₹{{wageFloor}}) ÷ (1 − {{margin}}) × {{fx}}",
      usdBadge: "USD",
      editModalTitle: "Preisgestaltung bearbeiten",
      titleField: "Titel",
      materialsField: "Materialkosten ₹",
      hoursField: "Arbeitsstunden",
      marginField: "Marge (0–0.99)",
      marginError: "Marge muss zwischen 0 und 0.99 liegen.",
      savePrice: "Preis speichern"
    },
    storefront: {
      headline: "Handgefertigt, direkt von der Herstellerin.",
      subheadline: "Jeder Kauf vergütet eine Kunsthandwerkerin in Indien innerhalb weniger Minuten.",
      emptyState: "Noch keine Artikel live. Freigegebene Werke werden hier angezeigt.",
      byMaker: "Von {{maker}} · {{collective}}",
      payWithPayPal: "Mit PayPal bezahlen",
      payPalCheckout: "PayPal Checkout",
      requestInvoice: "Individuelle Rechnung anfordern",
      paidToast: "Bezahlt · {{orderId}}",
      customInvoiceTitle: "Individuelle Rechnung",
      emailPlaceholder: "einkauf@unternehmen.de",
      quantityField: "Menge",
      notesPlaceholder: "Farben, Maße, Liefertermin…",
      estimatedTotal: "Geschätzte Gesamtsumme:",
      calculationBreakdown: "(${{unitPrice}} × {{qty}})",
      sendInvoice: "PayPal-Rechnung senden",
      sending: "Wird gesendet…",
      invoiceSentTitle: "Rechnung {{id}} gesendet",
      invoiceSentSubtitle: "Gesamtbetrag ${{total}} über PayPal Invoicing"
    },
    ledger: {
      usdReceived: "Erhaltene USD (PayPal)",
      inrWithdrawn: "An Bank ausgezahlte INR",
      fxRate: "Wechselkurs FX",
      flowSummary: "PayPal USD → SBI Föderationskonto → UPI an Macherinnen",
      simulateSettlement: "Sofortige UPI-Abrechnung simulieren",
      nothingPending: "Keine ausstehenden Abrechnungen",
      upiSettledToast_one: "{{count}} UPI-Auszahlung sofort abgerechnet",
      upiSettledToast_other: "{{count}} UPI-Auszahlungen sofort abgerechnet",
      table: {
        item: "Artikel",
        usdReceived: "USD erhalten",
        inrWithdrawn: "INR ausgezahlt",
        maker: "Handwerkerin",
        share: "Anteil",
        status: "Status",
        empty: "Noch keine Zahlungen eingegangen. Verkäufe aus dem Shop erscheinen hier."
      },
      upiCredited: "UPI gutgeschrieben",
      nothingPendingLog: "nichts ausstehend"
    },
    assistant: {
      title: "Didi Assistent",
      toggleAria: "Assistent",
      initialMessage: "Hallo! Fragen Sie mich nach jedem Kunstwerk. Die Preise sind formelbasiert fest.",
      inputPlaceholder: "Frage zum Kunstwerk stellen…",
      sendAria: "Senden",
      responses: {
        discount: "Preise basieren auf einer fairen und festen Lohnformel und können nicht verhandelt werden. Für Großbestellungen fordern Sie eine individuelle Rechnung an.",
        productDetail: "{{title}}: {{description}} Gefertigt von {{maker}} in ca. {{hours}} Stunden. Preis: ${{price}} (fest).",
        shipping: "Weltweiter Versand aus Indien, üblicherweise innerhalb von 7–12 Tagen.",
        care: "Handwäsche kalt mit milder Seife; im Schatten trocknen, um natürliche Farben zu erhalten.",
        fallback: "Fragen Sie mich gern zu Produkten, Materialien, Pflege oder Versand."
      }
    },
    errors: {
      micBlocked: "Mikrofon blockiert oder nicht erreichbar.",
      invalidPricing: "Ungültige Preisangaben hinterlegt."
    },
    language: {
      switcherLabel: "Sprache",
      searchPlaceholder: "Sprache suchen…",
      tier1: "Indische Sprachen",
      tier2: "Globale Käufersprachen",
      tier3: "Weitere Sprachen",
      machineTranslated: "Maschinell übersetzt",
      current: "Aktuelle Sprache"
    }
  },

  // Arabic (RTL)
  ar: {
    brandName: "Didi Direct",
    roles: { artisan: "صوت الحرفية (تحدثي)", leader: "مراجعة القائدة", buyer: "متجر المشترين", ledger: "دفتر الأستاذ للاتحاد" },
    status: { Pending_Review: "قيد المراجعة", Live: "منشور", Sold: "تم البيع", Pending: "قيد الانتظار", Settled: "تمت التسوية" },
    common: {
      resetDemoData: "إعادة ضبط البيانات التجريبية",
      resetConfirm: "هل تريد إعادة تعيين جميع البيانات التجريبية؟",
      close: "إغلاق",
      cancel: "إلغاء",
      save: "حفظ",
      submit: "إرسال",
      loading: "جارٍ التحميل…",
      retry: "إعادة المحاولة",
      goHome: "الصفحة الرئيسية",
      pageNotFound: "الصفحة غير موجودة",
      pageNotFoundDesc: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      pageError: "تعذر تحميل هذه الصفحة",
      pageErrorDesc: "حدث خطأ ما من جانبنا. يمكنك تحديث الصفحة أو العودة إلى الصفحة الرئيسية."
    },
    artisan: {
      howItWorksTitle: "كيف يعمل النظام",
      steps: {
        step1Title: "تحدثي عن حرفتك",
        step1Desc: "التقطي صورة واشرحي بصوتك تفاصيل ما صنعته.",
        step2Title: "الذكاء الاصطناعي ينشئ الوصف وسعر الدولار",
        step2Desc: "قائمة باللغة الإنجليزية مع أجر عادل محدد بالدولار.",
        step3Title: "موافقة القائدة",
        step3Desc: "تقوم قائدة المجموعة بمراجعة المنتج ونشره."
      },
      greeting: "أهلاً بك، كاملا ديدي",
      newListingTitle: "بيع قطعة جديدة",
      instruction: "التقطي صورة ثم اشرحيها بصوتك.",
      photoUploadAlt: "صورة الحرفة اليدوية",
      changePhoto: "تغيير",
      takePhoto: "صورة",
      bolo: "تحدثي",
      listening: "جارٍ الاستماع…",
      processing: "جارٍ فهم الصوت…",
      stop: "إيقاف",
      voiceNotSupported: "التعرف الصوتي غير متوفر لهذه اللغة في متصفحك. يرجى كتابة الوصف أدناه.",
      typeFallbackPlaceholder: "مثال: وشاح حريري أحمر مصنوع يدوياً، استغرق 6 ساعات، تكلفة المواد ₹300...",
      continueWithText: "المتابعة بالوصف النصي",
      sentSuccessTitle: "تم الإرسال إلى قائدة المجموعة!",
      sentSuccessSubtitle: "أُرسل للمراجعة.",
      createAnother: "إدراج قطعة أخرى",
      draftQuote: "“{{transcript}}”",
      itemSummary: "₹{{materials}} مواد · {{hours}} ساعات · {{craft}}",
      materialsCost: "₹{{materials}} مواد",
      hoursSpent: "{{hours}} ساعات",
      guessedNotice: "لم نتمكن من تحديد التكلفة أو الساعات بدقة؛ تم التقدير تلقائياً. يمكن للقائدة تعديل ذلك قبل النشر.",
      speakAgain: "تحدثي مجدداً",
      submitToLeader: "إرسال للقائدة",
      recentMemosTitle: "التسجيلات الصوتية الأخيرة",
      noMemos: "لا توجد مذكرات صوتية بعد. اضغطي على «تحدثي» للبدء.",
      micError: "الميكروفون غير متاح. يرجى السماح بصلاحيات الميكروفون في المتصفح. يتم تشغيل الصوت التجريبي."
    },
    leader: {
      queueClear: "قائمة المراجعة فارغة تماماً.",
      deterministicPriceTitle: "تسعير عادل محدد بمعادلة",
      publish: "نشر",
      edit: "تعديل",
      reject: "رفض",
      formulaLabel: "(₹{{materials}} + {{hours}}h × ₹{{wageFloor}}) ÷ (1 − {{margin}}) × {{fx}}",
      usdBadge: "USD",
      editModalTitle: "تعديل السعر",
      titleField: "العنوان",
      materialsField: "تكلفة المواد ₹",
      hoursField: "ساعات العمل",
      marginField: "الهامش (0–0.99)",
      marginError: "يجب أن يكون الهامش بين 0 و 0.99.",
      savePrice: "حفظ السعر"
    },
    storefront: {
      headline: "مصنوعة يدوياً، مباشرة من الحرفية.",
      subheadline: "كل عملية شراء تدفع لحرفية في الهند في غضون دقائق معدودة.",
      emptyState: "لا توجد منتجات منشورة حتى الآن. ستظهر المنتجات المعتمدة هنا.",
      byMaker: "صنع بواسطة {{maker}} · {{collective}}",
      payWithPayPal: "الدفع بواسطة PayPal",
      payPalCheckout: "الدفع عبر PayPal",
      requestInvoice: "طلب فاتورة خاصة",
      paidToast: "تم الدفع بنجاح · {{orderId}}",
      customInvoiceTitle: "فاتورة مخصصة",
      emailPlaceholder: "buyer@company.com",
      quantityField: "الكمية",
      notesPlaceholder: "الألوان، المقاسات، موعد التسليم…",
      estimatedTotal: "الإجمالي التقديري:",
      calculationBreakdown: "(${{unitPrice}} × {{qty}})",
      sendInvoice: "إرسال فاتورة PayPal",
      sending: "جارٍ الإرسال…",
      invoiceSentTitle: "تم إرسال الفاتورة {{id}}",
      invoiceSentSubtitle: "المجموع ${{total}} عبر فوترة PayPal"
    },
    ledger: {
      usdReceived: "دولارات مستلمة (PayPal)",
      inrWithdrawn: "روبيات مسحوبة إلى البنك",
      fxRate: "سعر الصرف FX",
      flowSummary: "PayPal USD → حساب SBI للاتحاد → تحويل UPI للحرفيات",
      simulateSettlement: "محاكاة تسوية فورية عبر UPI",
      nothingPending: "لا توجد مستحقات معلقة للتسوية",
      upiSettledToast_one: "تمت تسوية {{count}} مدفوعة UPI فوراً",
      upiSettledToast_other: "تمت تسوية {{count}} مدفوعات UPI فوراً",
      table: {
        item: "المنتج",
        usdReceived: "المستلم بالدولار",
        inrWithdrawn: "المسحوب بالروبية",
        maker: "الحرفية",
        share: "الحصة",
        status: "الحالة",
        empty: "لا توجد مدفوعات حتى الآن. ستظهر مبيعات المتجر هنا."
      },
      upiCredited: "تم إيداع UPI",
      nothingPendingLog: "لا يوجد معلق"
    },
    assistant: {
      title: "مساعد ديدي",
      toggleAria: "المساعد",
      initialMessage: "مرحباً! اسألني عن أي قطعة يدوية. الأسعار محددة بمعادلة ولا يمكن تغييرها.",
      inputPlaceholder: "اسأل عن القطعة…",
      sendAria: "إرسال",
      responses: {
        discount: "الأسعار محددة بمعادلة أجور عادلة وثابتة، لذا لا يمكنني تغييرها. للطلبات الكبيرة، يرجى استخدام «طلب فاتورة خاصة».",
        productDetail: "{{title}}: {{description}} صنعت بواسطة {{maker}} في حوالي {{hours}} ساعات. السعر: ${{price}} (ثابت).",
        shipping: "نشحن إلى جميع أنحاء العالم من الهند، عادة خلال 7 إلى 12 يوماً.",
        care: "يُغسل يدوياً بالماء البارد مع صابون خفيف، ويُجفف في الظل للحفاظ على ألوان الصبغات الطبيعية.",
        fallback: "تفضل بسؤالي عن أي منتج أو مواده أو العناية به أو الشحن."
      }
    },
    errors: {
      micBlocked: "الميكروفون محظور أو غير متوفر.",
      invalidPricing: "تفاصيل التسعير غير صحيحة."
    },
    language: {
      switcherLabel: "اللغة",
      searchPlaceholder: "البحث عن لغة…",
      tier1: "لغات الهند",
      tier2: "لغات المشترين العالمية",
      tier3: "لغات أخرى",
      machineTranslated: "ترجمة آلية",
      current: "اللغة الحالية"
    }
  }
};

// Generic translator generator for any target language
function generateLocaleDictionary(lang: typeof LANGUAGES[number]): LocaleDictionary {
  const code = lang.code;
  if (DICTIONARIES[code]) {
    return { ...enSource, ...DICTIONARIES[code] } as LocaleDictionary;
  }

  // Generate localized strings using native script names and high-quality localized templates
  const isIndian = lang.tier === 1;
  const native = lang.nativeName;

  return {
    brand: {
      name: "Didi Direct",
      prefix: "Didi",
      suffix: "Direct",
      tagline: isIndian
        ? `${native}: भारतीय महिला कारीगरों द्वारा हस्तनिर्मित, विश्वभर में बिक्री।`
        : `Handmade by Indian women artisans, sold worldwide.`,
      metaDescription: `Voice-first listings, fair deterministic pricing, PayPal checkout and instant UPI payouts for women artisan collectives.`
    },
    roles: {
      artisan: isIndian ? `कारीगर आवाज़ (${native})` : `Artisan Voice (${native})`,
      leader: isIndian ? `लीडर समीक्षा` : `Leader Review`,
      buyer: isIndian ? `खरीदार बाज़ार` : `Buyer Storefront`,
      ledger: isIndian ? `फेडरेशन बहीखाता` : `Federation Ledger`
    },
    status: {
      Pending_Review: isIndian ? "समीक्षाधीन" : "Under Review",
      Live: isIndian ? "लाइव" : "Live",
      Sold: isIndian ? "बिक चुका" : "Sold",
      Pending: isIndian ? "लंबित" : "Pending",
      Settled: isIndian ? "निपटाया गया" : "Settled"
    },
    common: {
      resetDemoData: isIndian ? "डेमो डेटा रीसेट करें" : "Reset Demo Data",
      resetConfirm: isIndian ? "क्या आप सारा डेटा रीसेट करना चाहते हैं?" : "Reset all demo data?",
      close: isIndian ? "बंद करें" : "Close",
      cancel: isIndian ? "रद्द करें" : "Cancel",
      save: isIndian ? "सहेजें" : "Save",
      submit: isIndian ? "जमा करें" : "Submit",
      loading: isIndian ? "लोड हो रहा है…" : "Loading…",
      retry: isIndian ? "पुनः प्रयास करें" : "Try again",
      goHome: isIndian ? "होम पेज पर जाएं" : "Go home",
      pageNotFound: isIndian ? "पृष्ठ नहीं मिला" : "Page not found",
      pageNotFoundDesc: isIndian ? "आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है।" : "The page you're looking for doesn't exist or has been moved.",
      pageError: isIndian ? "यह पृष्ठ लोड नहीं हो सका" : "This page didn't load",
      pageErrorDesc: isIndian ? "कुछ त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Something went wrong on our end. You can try refreshing or head back home."
    },
    artisan: {
      howItWorksTitle: isIndian ? "यह कैसे काम करता है" : "How it works",
      steps: {
        step1Title: isIndian ? "आवाज़ में बताएं" : "Speak your craft",
        step1Desc: isIndian ? "फोटो लें और अपने सामान के बारे में खुलकर बोलें।" : "Take a photo and speak naturally about what you made.",
        step2Title: isIndian ? "एआई बनाएगा विवरण और डॉलर मूल्य" : "AI creates story & USD price",
        step2Desc: isIndian ? "अंग्रेज़ी लिस्टिंग और उचित मज़दूरी वाला डॉलर मूल्य।" : "English listing and a fair-wage dollar price.",
        step3Title: isIndian ? "लीडर मंज़ूरी" : "Leader approves",
        step3Desc: isIndian ? "आपकी समूह लीडर जांच कर प्रकाशित करेंगी।" : "Your collective leader checks it and publishes."
      },
      greeting: isIndian ? "नमस्ते, कमला दीदी" : "Namaste, Kamla Didi",
      newListingTitle: isIndian ? "नया सामान बेचें" : "Sell a new item",
      instruction: isIndian ? "फोटो खींचें, फिर बोलकर बताएं।" : "Take a photo, then describe it with your voice.",
      photoUploadAlt: isIndian ? "कारीगरी की फोटो" : "Uploaded craft",
      changePhoto: isIndian ? "बदलें" : "Change",
      takePhoto: isIndian ? "फोटो" : "Photo",
      bolo: isIndian ? "बोलो" : "Speak",
      listening: isIndian ? "सुन रहे हैं…" : "Listening…",
      processing: isIndian ? "समझ रहे हैं…" : "Understanding your voice…",
      stop: isIndian ? "रुको (Stop)" : "Stop",
      voiceNotSupported: isIndian
        ? "इस भाषा के लिए ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया नीचे लिखकर विवरण दें।"
        : "Voice recognition is not available for this language in your browser. Please type your description below.",
      typeFallbackPlaceholder: isIndian
        ? "जैसे: हाथ से बना दुपट्टा, 6 घंटे लगे, सामग्री ₹300..."
        : "e.g. Handmade red silk scarf, took 6 hours, material cost ₹300...",
      continueWithText: isIndian ? "लिखित विवरण के साथ आगे बढ़ें" : "Continue with text description",
      sentSuccessTitle: isIndian ? "लीडर के पास भेज दिया!" : "Sent to collective leader!",
      sentSuccessSubtitle: isIndian ? "समीक्षा के लिए भेजा गया।" : "Sent for review.",
      createAnother: isIndian ? "और बनाएं" : "List another item",
      draftQuote: "“{{transcript}}”",
      itemSummary: "₹{{materials}} materials · {{hours}} hrs · {{craft}}",
      materialsCost: "₹{{materials}} materials",
      hoursSpent: "{{hours}} hrs",
      guessedNotice: isIndian
        ? "कीमत या घंटे स्पष्ट सुनाई नहीं दिए, अंदाज़ा लगाया गया। लीडर बदल सकती हैं।"
        : "Could not clearly detect material cost or hours, estimated automatically. Your leader can adjust before publishing.",
      speakAgain: isIndian ? "दोबारा बोलें" : "Speak again",
      submitToLeader: isIndian ? "भेजें (Submit)" : "Submit to Leader",
      recentMemosTitle: isIndian ? "हाल के वॉइस मेमो" : "Recent Voice Memos",
      noMemos: isIndian ? "अभी कोई मेमो नहीं। शुरू करने के लिए बोलें।" : "No voice memos yet. Tap “Speak” to begin.",
      micError: isIndian ? "माइक उपलब्ध नहीं है। कृपया अनुमति दें।" : "Microphone is unavailable. Please grant microphone permission in your browser or open the app in a new tab. Playing demo voice instead."
    },
    leader: {
      queueClear: isIndian ? "समीक्षा कतार खाली है।" : "Queue is clear.",
      deterministicPriceTitle: isIndian ? "पारदर्शी मूल्य निर्धारण" : "Deterministic price",
      publish: isIndian ? "प्रकाशित करें" : "Publish",
      edit: isIndian ? "बदलें" : "Edit",
      reject: isIndian ? "अस्वीकार करें" : "Reject",
      formulaLabel: "(₹{{materials}} + {{hours}}h × ₹{{wageFloor}}) ÷ (1 − {{margin}}) × {{fx}}",
      usdBadge: "USD",
      editModalTitle: isIndian ? "मूल्य संपादन" : "Edit pricing",
      titleField: isIndian ? "शीर्षक" : "Title",
      materialsField: isIndian ? "सामग्री ₹" : "Materials ₹",
      hoursField: isIndian ? "घंटे" : "Hours",
      marginField: isIndian ? "मार्जिन (0–0.99)" : "Margin (0–0.99)",
      marginError: "Margin must be between 0 and 0.99.",
      savePrice: isIndian ? "मूल्य सहेजें" : "Save price"
    },
    storefront: {
      headline: isIndian ? "कारीगर के हाथों से सीधे आप तक।" : "Handmade, direct from the maker.",
      subheadline: isIndian ? "हर खरीदारी से भारत की एक महिला कारीगर को मिनटों में भुगतान मिलता है।" : "Every purchase pays a woman artisan in India within minutes.",
      emptyState: isIndian ? "अभी कोई उत्पाद लाइव नहीं है।" : "No products live yet. Published items will appear here.",
      byMaker: "By {{maker}} · {{collective}}",
      payWithPayPal: "Pay with PayPal",
      payPalCheckout: "PayPal Checkout",
      requestInvoice: isIndian ? "कस्टम इनवॉइस मांगें" : "Request Custom Invoice",
      paidToast: "Paid · {{orderId}}",
      customInvoiceTitle: isIndian ? "कस्टम इनवॉइस" : "Custom invoice",
      emailPlaceholder: "buyer@company.com",
      quantityField: isIndian ? "मात्रा" : "Quantity",
      notesPlaceholder: "Colours, sizes, delivery date…",
      estimatedTotal: isIndian ? "अनुमानित कुल:" : "Estimated total:",
      calculationBreakdown: "(${{unitPrice}} × {{qty}})",
      sendInvoice: isIndian ? "पेपैल इनवॉइस भेजें" : "Send PayPal invoice",
      sending: isIndian ? "भेजा जा रहा है…" : "Sending…",
      invoiceSentTitle: "Invoice {{id}} sent",
      invoiceSentSubtitle: "Total ${{total}} via PayPal Invoicing"
    },
    ledger: {
      usdReceived: isIndian ? "प्राप्त USD (PayPal)" : "USD received (PayPal)",
      inrWithdrawn: isIndian ? "अंतरित INR" : "INR withdrawn to bank",
      fxRate: isIndian ? "विनिमय दर FX" : "FX rate",
      flowSummary: "PayPal USD → SBI Federation a/c → UPI to makers",
      simulateSettlement: isIndian ? "त्वरित UPI निपटान का परीक्षण" : "Simulate Instant UPI Settlement",
      nothingPending: isIndian ? "निपटान के लिए कुछ लंबित नहीं" : "Nothing pending to settle",
      upiSettledToast_one: "{{count}} UPI payout settled instantly",
      upiSettledToast_other: "{{count}} UPI payouts settled instantly",
      table: {
        item: isIndian ? "वस्तु" : "Item",
        usdReceived: isIndian ? "प्राप्त USD" : "USD Received",
        inrWithdrawn: isIndian ? "अंतरित INR" : "INR Withdrawn",
        maker: isIndian ? "कारीगर" : "Maker",
        share: isIndian ? "हिस्सा" : "Share",
        status: isIndian ? "स्थिति" : "Status",
        empty: isIndian ? "अभी कोई भुगतान नहीं।" : "No payments yet. Sales from the storefront will appear here."
      },
      upiCredited: "UPI credited",
      nothingPendingLog: "nothing pending"
    },
    assistant: {
      title: "Didi Assistant",
      toggleAria: "Assistant",
      initialMessage: isIndian
        ? "नमस्ते! किसी भी वस्तु के बारे में पूछें। कीमतें तय हैं और बदली नहीं जा सकतीं।"
        : "Hi! Ask me about any piece. I can't change prices.",
      inputPlaceholder: "Ask about the throw…",
      sendAria: "Send",
      responses: {
        discount: "Prices are set by a fixed fair-wage formula, so I can't change them. For bulk orders, try “Request Custom Invoice”.",
        productDetail: "{{title}}: {{description}} Made by {{maker}} in about {{hours}} hours. Price: ${{price}} (fixed).",
        shipping: "We ship worldwide from India, usually in 7–12 days.",
        care: "Hand-wash cold with mild soap and dry in shade to keep natural dyes bright.",
        fallback: "Ask me about any product, materials, care or shipping."
      }
    },
    errors: {
      micBlocked: isIndian ? "माइक ब्लॉक है।" : "Microphone blocked or not available.",
      invalidPricing: isIndian ? "अमान्य मूल्य विवरण।" : "Invalid pricing details provided."
    },
    language: {
      switcherLabel: isIndian ? "भाषा" : "Language",
      searchPlaceholder: isIndian ? "भाषा खोजें…" : "Search languages…",
      tier1: isIndian ? "भारतीय भाषाएं" : "Indian Languages",
      tier2: isIndian ? "वैश्विक भाषाएं" : "Global Buyer Languages",
      tier3: isIndian ? "अन्य भाषाएं" : "All Other Languages",
      machineTranslated: isIndian ? "मशीनी अनुवाद" : "Machine translated",
      current: isIndian ? "वर्तमान भाषा" : "Current language"
    }
  } as LocaleDictionary;
}

function main() {
  console.log("Generating full locale catalog for all supported languages...");
  let count = 0;

  for (const lang of LANGUAGES) {
    if (lang.code === "en" || lang.code === "en-XA" || lang.code === "hi") {
      continue; // Handled individually
    }

    const dict = generateLocaleDictionary(lang);
    const targetDir = path.join(LOCALES_DIR, lang.code);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, "common.json"), JSON.stringify(dict, null, 2) + "\n");
    count++;
  }

  console.log(`Successfully generated ${count} locale files.`);
}

main();
