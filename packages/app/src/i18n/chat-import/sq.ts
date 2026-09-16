export const dict = {
  "profileImport.mode": "Mënyra e importimit",
  "profileImport.chats": "Vetëm bisedat",
  "profileImport.everything": "Gjithçka (konfigurim i plotë)",
  "profileImport.description":
    "Kopjon konfigurimin tuaj të përputhshëm OpenCode në një profil Classic bosh të desktopit: biseda, kredencialet e ofruesve, llogaritë në cloud, lejet, konfigurimin global, agjentët, skills, shtojcat, planet, fotot e statusit dhe skedarët e hapësirave të punës. Burimi mbetet i pandryshuar. Parapamja nuk ekzekuton komandat e importuara dhe nuk kontakton me ofruesit.",
  "profileImport.boundaries":
    "Mbyllni fillimisht OpenCode dhe ndaloni së redaktuari skedarët e tij. Dosjet e projekteve jashtë depozitës së OpenCode mbeten në shtigjet e tyre origjinale. Variablat e mjedisit, mjetet e instaluara në sistem dhe parapëlqimet e dritares së desktopit të upstream-it nuk kopjohen. Regjistrat, memoriet e fshehura dhe bllokimet e proceseve rigjenerohen. Ofruesit OAuth mund të kërkojnë hyrje të re. Dosjet e personalizuara zgjidhen në këtë rend: të dhëna, konfigurim, pastaj gjendje.",
  "profileImport.detect": "Parapamja e konfigurimit parazgjedhje",
  "profileImport.browse": "Zgjidh dosjet e konfigurimit",
  "profileImport.busy":
    "Konfigurimi i plotë po vleftësohet ose përgatitet. Mbaje Classic të hapur derisa të përfundojë kjo.",
  "profileImport.cancelled":
    "Nuk u gjet asnjë burim i përputhshëm, ose zgjedhja e dosjeve u anulua.",
  "profileImport.staged":
    "Konfigurimi është përgatitur dhe verifikuar. Rinis Classic-in për ta aktivizuar përpara se serveri i tij të nisë. Mos shto të dhëna në Classic përpara rinisjes; aktivizimi verifikon përsëri që destinacioni është bosh.",
  "profileImport.activated":
    "Konfigurimi i plotë u aktivizua me sukses. Dosjet e projekteve tuaja mbeten të passhme në shtigjet e tyre origjinale; hapësirat e punës të brendshme të importuara kanë kopje të pavarura.",
  "profileImport.data": "Dosja e të dhënave të burimit",
  "profileImport.config": "Dosja e konfigurimit të burimit",
  "profileImport.state": "Dosja e gjendjes së burimit",
  "profileImport.providers": "Kredencialet e ruajtura të ofruesve",
  "profileImport.accounts": "Llogaritë në cloud",
  "profileImport.workspaces": "Hapësirat e punës",
  "profileImport.files": "Skedarët dhe lidhjet",
  "profileImport.bytes": "Madhësia e kopjimit (bajt)",
  "profileImport.plugins": "Shtojcat e konfiguruara",
  "profileImport.mcp": "Zërat MCP",
  "profileImport.commands": "Komandat e projektit",
  "profileImport.permissions": "Regjistrat e lejeve",
  "profileImport.pending": "Kërkesat në pritje",
  "profileImport.git": "Checkout-et e Git",
  "profileImport.consent":
    "Kam mbyllur OpenCode-in dhe besoj këtë konfigurim të plotë, përfshirë kredencialet, rifreskimin e llogarive, varësitë, shtojcat, serverat MCP, komandat e projektit, hook-et e Git dhe lejet ekzistuese. Këto mund të ekzekutohen gjatë përdorimit normal pas aktivizimit. Kërkesat në pritje mbeten në radhë derisa të rifillen.",
  "profileImport.confirm": "Përgatit konfigurimin e plotë",
  "profileImport.restart": "Rinis dhe aktivizo konfigurimin",
  "profileImport.error.unavailable":
    "Importimi i plotë kërkon serverin e integruar Linux të desktopit dhe konfigurim të bazuar në skedarë. Konfigurimet ose anëskalimet e autentikimit të ofruara nga mjedisi duhen hequr përpara importimit.",
  "profileImport.error.nonempty":
    "Classic përmban tashmë të dhëna konfigurimi. Importimi i plotë nuk i mbishkruan. Përdor Vetëm bisedat për të bashkuar biseda të përputhshme, ose fillo me një profil Classic bosh.",
  "profileImport.error.incompatible":
    "Skema e bazës së të dhënave të burimit nuk përputhet me këtë version të Classic. Importimi i plotë kërkon një konfigurim SQLite të përputhshëm; nuk u përpoq asnjë migrim i burimit.",
  "profileImport.error.invalid":
    "Konfigurimi nuk u vleftësua dot. Kontrollo lejet e skedarëve, integritetin e bazës së të dhënave dhe sintaksën e konfigurimit. Profili Classic që po ekzekutohet nuk u zëvendësua.",
  "profileImport.error.changed":
    "Burimi ndryshoi ose kjo parapamje skadoi. Mbyll OpenCode-in dhe proceset e tjera shkruese, pastaj bëj parapamjen përsëri.",
  "profileImport.error.busy":
    "Një import tjetër, një bllokim aktiv skedari ose një aktivizim në pritje e pengon këtë veprim. Mbyll OpenCode-in dhe rinis Classic-in përpara se të riprovosh.",
  "profileImport.liveWarning":
    "OpenCode duket se po ekzekutohet pikërisht tani. Baza e tij e të dhënave ndryshon vazhdimisht, ndaj përgatitja mund të dështojë. Mbyll OpenCode-in (të gjitha dritaret) dhe ndalo serverat e tij përpara konfirmimit, për një import të besueshëm.",
  "profileImport.detail.count": "Elementet e prekur: {{count}}",
  "profileImport.materialized": "Lidhjet e jashtme të kopjuara",
  "profileImport.skipped": "Skedarët e ekzekutimit të anashkaluar",
  "profileImport.error.source-busy":
    "Në burim po shkruhet vazhdimisht (ka gjasa që një instancë OpenCode po ekzekutohet). Mbyll OpenCode-in dhe serverat e tij, pastaj bëj përsëri parapamjen dhe konfirmimin.",
  "profileImport.error.links":
    "Konfigurimi përmban një lidhje që nuk mund të kopjohet: një cikël lidhjesh simbolike, ose një lidhje brenda metadatave të Git ku kopjet duhet të mbeten të sakta.",
  "profileImport.error.git-objects":
    "Metadatat e Git të konfigurimit përdorin një paraqitje të pambështetur (zëra alternates, tregues worktree ose depo objektesh që nuk mund të privatizohen në mënyrë të sigurt).",
  "profileImport.error.special-files":
    "Konfigurimi përmban nyje pajisjesh ose skedarë të tjerë specialë që nuk mund të kopjohen në mënyrë të sigurt.",
  "profileImport.error.limit":
    "Konfigurimi e tejkalon kufirin e importimit (50 GiB ose 500 000 elementë). Hiq skedarët e mëdhenj të kopjeve rezervë ose ngushto dosjet, pastaj bëj parapamjen përsëri.",
  "profileImport.error.oversized-file":
    "Një skedar konfigurimi ose metadatash e tejkalon kufirin e leximit të vet (64 MB për konfigurime, 16 MB për metadatat e Git). Ndaje ose zvogëloje, pastaj bëj parapamjen përsëri.",
  "profileImport.error.unsupported":
    "Ky konfigurim përmban lidhje të pambështetuara, alternates ciklike të objekteve Git, skedarë specialë ose e tejkalon kufirin e importimit (50 GiB / 500 000 elementë). Lidhjet simbolike të jashtme duhen materializuar përpara importimit; skedarët e burimit nuk u ndryshuan.",
  "profileImport.error.space":
    "Nuk ka hapësirë të mjaftueshme të lirë në disk për të përgatitur këtë konfigurim. Liro hapësirë dhe bëj parapamjen përsëri.",
  "chatImport.tab": "Importimi i bisedave",
  "chatImport.title": "Importo biseda nga OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop mban një bazë të dhënash të veçantë për biseda. Parapamje dhe kopjo bisedat lokale të përputhshme nga OpenCode pa ndryshuar burimin dhe pa zëvendësuar bisedat ekzistuese të Classic. Mund të kthehet këtu nga cilësimet në çdo kohë.",
  "chatImport.scope":
    "Mbyll OpenCode-in përpara importimit. Kjo kopjon bisedat lokale të përfunduara dhe historikun e tyre. Bisedat në radhë, në zhvillim dhe ato të hapësirave të punës përjashtohen. Kredencialet, lejet, komandat e projektit, skedarët e jashtëm dhe fotot e statusit të zhbërjes nuk importohen. Hyr veçmas dhe mbaj dosjet e projekteve tuaja në shtigjet e tyre origjinale.",
  "chatImport.localOnly":
    "Zgjidh serverin e integruar vendor të desktopit për të importuar biseda. Ky importues nuk mbështet lidhjet me servera të largët dhe servera në sfond.",
  "chatImport.detect": "Kontrollo bazën e të dhënave parazgjedhje të OpenCode",
  "chatImport.browse": "Zgjidh skedarin e bazës së të dhënave",
  "chatImport.confirm": "Importo bisedat e përshtatshme",
  "chatImport.busy":
    "Po kontrollohen ose importohen biseda. Prit përpara se ta mbyllësh aplikacionin.",
  "chatImport.noSource":
    "Nuk u gjet ose u zgjodh asnjë bazë të dhënash. Zgjidh skedarin tënd OpenCode .db për të vazhduar.",
  "chatImport.complete":
    "Importimi përfundoi. Hap dosjen origjinale të projektit për të gjetur bisedat e tij. Një import i përsëritur anashkalon ID-të e bisedave që ekzistojnë tashmë në Classic.",
  "chatImport.source": "Baza e të dhënave e burimit",
  "chatImport.destination": "Baza e të dhënave e Classic",
  "chatImport.total": "Bisedat në burim",
  "chatImport.eligible": "Gati për importim",
  "chatImport.existing": "Ekzistojnë tashmë",
  "chatImport.excluded": "Përjashtuar (në radhë, në zhvillim ose hapësirë pune)",
  "chatImport.imported": "U importuan",
  "chatImport.error.unavailable":
    "Importimi është i passhëm vetëm për serverin e integruar Linux të desktopit pasi të ketë përfunduar nisjen.",
  "chatImport.error.incompatible":
    "Bazat e të dhënave kanë skema të ndryshme ose të pambështetuara. Përdor versione të përputhshme dhe të përditësuara të OpenCode dhe Classic, pastaj bëj parapamjen përsëri. Ruajtja e vjetër JSON nuk mbështetet; burimi nuk u migrim.",
  "chatImport.error.invalid":
    "Baza e të dhënave nuk u lexua dot ose nuk u vleftësua dot. Kontrollo skedarin e zgjedhur, lejet dhe hapësirën e passhme në disk. Një import i pakkonfirmuar kthehet mbrapsht; bëj parapamjen përsëri përpara se të riprovosh.",
  "chatImport.error.sameFile":
    "Burimi dhe destinacioni janë e njëjta bazë të dhënash. Nuk nevojitet kopjim.",
  "chatImport.error.conflict":
    "ID-të e projekteve ose të mesazheve në konflikt e penguan këtë import. Nuk u konfirmua asnjë import i pjesshëm. Bisedat ekzistuese të Classic-ut u ruajtën.",
  "chatImport.error.busy":
    "Baza e të dhënave është e zënë ose veprimi zgjati shumë. Mbyll OpenCode-in, prit të përfundojnë importime të tjera, pastaj bëj parapamjen përsëri. Një përpjekje e re anashkalon bisedat e konfirmuara tashmë.",
  "chatImport.error.expired":
    "Kjo parapamje skadoi ose burimi i saj ndryshoi. Bëj parapamjen e bazës së të dhënave përsëri përpara importimit.",
}
