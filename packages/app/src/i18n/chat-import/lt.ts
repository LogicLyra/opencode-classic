export const dict = {
  "profileImport.mode": "Importavimo režimas",
  "profileImport.chats": "Tik pokalbiai",
  "profileImport.everything": "Viskas (pilna konfigūracija)",
  "profileImport.description":
    "Nukopijuoja jūsų suderinamą OpenCode konfigūraciją į tuščią Classic darbalaukio profilį: pokalbius, teikėjų prisijungimo duomenis, debesų sąskaitas, leidimus, visuotinę konfigūraciją, agentus, skills, įskiepius, planus, momentines kopijas ir darbo sričių failus. Šaltinis lieka nepakeistas. Peržiūra nevykdo importuotų komandų ir nesikreipia į teikėjus.",
  "profileImport.boundaries":
    "Pirmiausia uždarykite OpenCode ir nustokite redaguoti jo failus. Projektų aplankai, esantys už OpenCode saugyklos ribų, lieka savo originaliuose keliuose. Aplinkos kintamųjų, sistemoje įdiegtų įrankių ir upstream darbalaukio langų nuostatų kopijuojama. Žurnalai, podėliai ir procesų užraktai sugeneruojami iš naujo. OAuth teikėjai gali reikalauti prisijungti iš naujo. Pasirinktiniai aplankai renkami tokia tvarka: duomenys, konfigūracija, tada būsena.",
  "profileImport.detect": "Peržiūrėti numatytąją konfigūraciją",
  "profileImport.browse": "Pasirinkti konfigūracijos aplankus",
  "profileImport.busy":
    "Pilna konfigūracija tikrinama arba rengiama. Laikykite Classic atidarytą, kol tai baigsis.",
  "profileImport.cancelled":
    "Nerastas joks suderinamas šaltinis, arba aplankų pasirinkimas buvo atšauktas.",
  "profileImport.staged":
    "Konfigūracija paruošta ir patikrinta. Paleiskite Classic iš naujo, kad suaktyvintumėte ją prieš paleidžiant jos serverį. Nepridėkite duomenų į Classic prieš perkrovimą; suaktyvinimas dar kartą patikrina, ar paskirties vieta tuščia.",
  "profileImport.activated":
    "Pilna konfigūracija sėkmingai suaktyvinta. Jūsų projektų aplankai lieka prieinami savo originaliuose keliuose; importuotos vidinės darbo sritys gauna nepriklausomas kopijas.",
  "profileImport.data": "Šaltinio duomenų aplankas",
  "profileImport.config": "Šaltinio konfigūracijos aplankas",
  "profileImport.state": "Šaltinio būsenos aplankas",
  "profileImport.providers": "Įrašyti teikėjų prisijungimo duomenys",
  "profileImport.accounts": "Debesų sąskaitos",
  "profileImport.workspaces": "Darbo sritys",
  "profileImport.files": "Failai ir nuorodos",
  "profileImport.bytes": "Kopijavimo dydis (baitais)",
  "profileImport.plugins": "Sukonfigūruoti įskiepiai",
  "profileImport.mcp": "MCP įrašai",
  "profileImport.commands": "Projekto komandos",
  "profileImport.permissions": "Leidimų įrašai",
  "profileImport.pending": "Laukiantys prompt",
  "profileImport.git": "Git išvedimai",
  "profileImport.consent":
    "Uždariau OpenCode ir pasitikiu šia pilna konfigūracija, įskaitant prisijungimo duomenis, sąskaitų atnaujinimą, priklausomybes, įskiepius, MCP serverius, projekto komandas, Git kablius ir esamus leidimus. Jie gali veikti įprasto naudojimo metu po suaktyvinimo. Laukiantys prompt lieka eilėje, kol bus atnaujinti.",
  "profileImport.confirm": "Paruošti pilną konfigūraciją",
  "profileImport.restart": "Paleisti iš naujo ir suaktyvinti konfigūraciją",
  "profileImport.error.unavailable":
    "Pilnas importavimas reikalauja integruotojo Linux darbalaukio serverio ir failų pagrindo konfigūracijos. Aplinkos teikiamą konfigūraciją arba autentifikavimo perrašymus reikia pašalinti prieš importuojant.",
  "profileImport.error.nonempty":
    "Classic jau yra konfigūracijos duomenų. Pilnas importavimas jų neperrašo. Naudokite Tik pokalbiai suderinamiems pokalbiams sulieti, arba pradėkite nuo tuščio Classic profilio.",
  "profileImport.error.incompatible":
    "Šaltinio duomenų bazės schema neatitinka šios Classic versijos. Pilnas importavimas reikalauja suderinamos SQLite konfigūracijos; šaltinio perkėlimas nebuvo bandytas.",
  "profileImport.error.invalid":
    "Nepavyko patikrinti konfigūracijos. Patikrinkite failų leidimus, duomenų bazės vientisumą ir konfigūracijos sintaksę. Veikiantis Classic profilis nebuvo pakeistas.",
  "profileImport.error.changed":
    "Šaltinis pasikeitė arba ši peržiūra baigė galioti. Uždarykite OpenCode ir kitus rašančius procesus, tada peržiūrėkite dar kartą.",
  "profileImport.error.busy":
    "Kitas importavimas, aktyvus failo užraktas arba laukiantis suaktyvinimas trukdo šiai operacijai. Uždarykite OpenCode ir paleiskite Classic iš naujo prieš bandydami vėl.",
  "profileImport.liveWarning":
    "Atrodo, kad OpenCode šiuo metu veikia. Jo duomenų bazė nuolat keičiasi, todėl paruošimas gali nepavykti. Uždarykite OpenCode (visus langus) ir sustabdykite jo serverius prieš patvirtindami, kad importavimas būtų patikimas.",
  "profileImport.detail.count": "Paliesti elementai: {{count}}",
  "profileImport.materialized": "Nukopijuotos išorinės nuorodos",
  "profileImport.skipped": "Praleisti vykdymo failai",
  "profileImport.error.source-busy":
    "Į šaltinį nuolat rašoma (turbūt veikia OpenCode egzempliorius). Uždarykite OpenCode ir jo serverius, tada vėl atlikite peržiūrą ir patvirtinimą.",
  "profileImport.error.links":
    "Konfigūracijoje yra nuoroda, kurios negalima nukopijuoti: simbolinių nuorodų ciklas arba nuoroda Git metaduomenyse, kur kopijos turi išlikti tikslbios.",
  "profileImport.error.git-objects":
    "Konfigūracijos Git metaduomenys naudoja nepalaikomą išdėstymą (alternates įrašai, worktree rodyklės arba objektų saugyklos, kurių negalima saugiai privatizuoti).",
  "profileImport.error.special-files":
    "Konfigūracijoje yra įrenginių mazgų arba kitų specialiųjų failų, kurių negalima saugiai nukopijuoti.",
  "profileImport.error.limit":
    "Konfigūracija viršija importavimo ribą (50 GiB arba 500 000 elementų). Pašalinkite didelius atsarginės kopijos failus arba susiaurinkite aplankus ir peržiūrėkite dar kartą.",
  "profileImport.error.oversized-file":
    "Konfigūracijos arba metaduomenų failas viršija jo skaitymo ribą (64 MB konfigūracijoms, 16 MB Git metaduomenims). Padalinkite arba sumažinkite jį ir peržiūrėkite dar kartą.",
  "profileImport.error.unsupported":
    "Ši konfigūracija turi nepalaikomų nuorodų, cikliškų Git objektų alternates, specialiųjų failų arba viršija importavimo ribą (50 GiB / 500 000 elementų). Išorinės simbolinės nuorodos prieš importavimą turi būti materializuotos; šaltinio failai nebuvo pakeisti.",
  "profileImport.error.space":
    "Nėra pakankamai laisvos disko vietos šiai konfigūracijai paruošti. Atlaisvinkite vietos ir peržiūrėkite dar kartą.",
  "chatImport.tab": "Pokalbių importavimas",
  "chatImport.title": "Importuoti pokalbius iš OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop laiko atskirą pokalbių duomenų bazę. Peržiūrėkite ir nukopijuokite suderinamus vietinius pokalbius iš OpenCode nekeisdami šaltinio ir nepakeisdami esamų Classic pokalbių. Galite bet kada grįžti čia iš nustatymų.",
  "chatImport.scope":
    "Uždarykite OpenCode prieš importuodami. Tai nukopijuoja užbaigtus vietinius pokalbius ir jų istoriją. Eilėje esantys, vykstantys ir darbo sričių seansai neįtraukiami. Prisijungimo duomenys, leidimai, projekto komandos, išoriniai failai ir atšaukimo momentinės kopijos neimportuojami. Prisijunkite atskirai ir laikykite savo projektų aplankus originaliuose keliuose.",
  "chatImport.localOnly":
    "Importuoti pokalbius pasirinkite integruotąjį vietinį darbalaukio serverį. Šis importuotojas nepalaiko nuotolinių ir foninių serverių ryšių.",
  "chatImport.detect": "Patikrinti numatytąją OpenCode duomenų bazę",
  "chatImport.browse": "Pasirinkti duomenų bazės failą",
  "chatImport.confirm": "Importuoti tinkamus pokalbius",
  "chatImport.busy":
    "Tikrinami arba importuojami pokalbiai. Palaukite prieš uždarydami programą.",
  "chatImport.noSource":
    "Duomenų bazė nerasta arba nepasirinkta. Norėdami tęsti, pasirinkite savo OpenCode .db failą.",
  "chatImport.complete":
    "Importavimas baigtas. Atidarykite originalų projekto aplanką, kad rastumėte jo pokalbius. Pakartotas importavimas praleidžia pokalbių ID, kurie jau yra Classic.",
  "chatImport.source": "Šaltinio duomenų bazė",
  "chatImport.destination": "Classic duomenų bazė",
  "chatImport.total": "Pokalbiai šaltinyje",
  "chatImport.eligible": "Paruošti importuoti",
  "chatImport.existing": "Jau yra",
  "chatImport.excluded": "Neįtraukti (eilėje, vykstantys ar darbo sritis)",
  "chatImport.imported": "Importuoti",
  "chatImport.error.unavailable":
    "Importavimas prieinamas tik integruotajam Linux darbalaukio serveriui, kai jis baigia paleistį.",
  "chatImport.error.incompatible":
    "Duomenų bazės turi skirtingas arba nepalaikomas schemas. Naudokite suderinamas ir atnaujintas OpenCode ir Classic versijas, tada peržiūrėkite dar kartą. Pasenęs JSON saugojimas nepalaikomas; šaltinis nebuvo perkeltas.",
  "chatImport.error.invalid":
    "Nepavyko perskaityti arba patikrinti duomenų bazės. Patikrinkite pasirinktą failą, leidimus ir laisvą disko vietą. Nepatvirtintas importavimas atšaukiamas; prieš bandydami vėl, peržiūrėkite dar kartą.",
  "chatImport.error.sameFile":
    "Šaltinis ir paskirtis yra ta pati duomenų bazė. Kopijuoti nereikia.",
  "chatImport.error.conflict":
    "Konfliškuojantys projekto ar pranešimų ID sutrukdė šiam importavimui. Jokia dalinė importavimo dalis nebuvo patvirtinta. Esami Classic pokalbiai buvo išsaugoti.",
  "chatImport.error.busy":
    "Duomenų bazė užimta arba operacija užtruko per ilgai. Uždarykite OpenCode, palaukite, kol kiti importavimai baigsis, tada peržiūrėkite dar kartą. Pakartotinis bandymas praleidžia jau patvirtintus pokalbius.",
  "chatImport.error.expired":
    "Ši peržiūra baigė galioti arba jos šaltinis pasikeitė. Prieš importuodami peržiūrėkite duomenų bazę dar kartą.",
}
