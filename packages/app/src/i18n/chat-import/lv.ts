export const dict = {
  "profileImport.mode": "Importēšanas režīms",
  "profileImport.chats": "Tikai tērzēšanas",
  "profileImport.everything": "Viss (pilna konfigurācija)",
  "profileImport.description":
    "Kopē jūsu saderīgo OpenCode konfigurāciju tukšā Classic darbvirsmas profilā: tērzēšanas, pakalpojumu sniedzēju pierakstīšanās dati, mākoņkonti, atļaujas, globālā konfigurācija, aģenti, skills, spraudņi, plāni, momentuzņēmumi un darbtelpu faili. Avots paliek nemainīgs. Priekšskatījums neizpilda importētās komandas un nesazinās ar pakalpojumu sniedzējiem.",
  "profileImport.boundaries":
    "Vispirms aizveriet OpenCode un pārtrauciet tā failu rediģēšanu. Projekta mapes ārpus OpenCode krātuves paliek savos sākotnējos ceļos. Vides mainīgos, sistēmā instalētos rīkus un augšupplūsmas darbvirsmas logu preferences nekopē. Žurnālus, kešatmiņas un procesu slēgenus ģenerē no jauna. OAuth pakalpojumu sniedzēji var pieprasīt jaunu pieteikšanos. Pielāgotās mapes atlasa šādā secībā: dati, konfigurācija un pēc tam stāvoklis.",
  "profileImport.detect": "Priekšskatīt noklusējuma konfigurāciju",
  "profileImport.browse": "Izvēlēties konfigurācijas mapes",
  "profileImport.busy":
    "Pilnā konfigurācija tiek validēta vai sagatavota. Turiet Classic atvērtu, līdz tas beidzas.",
  "profileImport.cancelled":
    "Netika atrasts neviens saderīgs avots, vai mapju atlase tika atcelta.",
  "profileImport.staged":
    "Konfigurācija ir sagatavota un pārbaudīta. Restartējiet Classic, lai to aktivizētu, pirms tā serveris sāk darboties. Nepievienojiet datus Classic pirms restartēšanas; aktivizēšana vēlreiz pārbauda, ka galamērķis ir tukšs.",
  "profileImport.activated":
    "Pilnā konfigurācija tika veiksmīgi aktivizēta. Jūsu projektu mapes paliek pieejamas savos sākotnējos ceļos; importētās iekšējās darbtelpas iegūst neatkarīgas kopijas.",
  "profileImport.data": "Avota datu mape",
  "profileImport.config": "Avota konfigurācijas mape",
  "profileImport.state": "Avota stāvokļa mape",
  "profileImport.providers": "Saglabātie pakalpojumu sniedzēju pierakstīšanās dati",
  "profileImport.accounts": "Mākoņkonti",
  "profileImport.workspaces": "Darbtelpas",
  "profileImport.files": "Faili un saites",
  "profileImport.bytes": "Kopēšanas izmērs (baiti)",
  "profileImport.plugins": "Konfigurētie spraudņi",
  "profileImport.mcp": "MCP ieraksti",
  "profileImport.commands": "Projekta komandas",
  "profileImport.permissions": "Atļauju ieraksti",
  "profileImport.pending": "Gaidošie prompt",
  "profileImport.git": "Git izņēmumi",
  "profileImport.consent":
    "OpenCode ir aizvērts, un es uzticos šai pilnajai konfigurācijai, tostarp pierakstīšanās datiem, kontu atjaunināšanai, atkarībām, spraudņiem, MCP serveriem, projekta komandām, Git āķiem un esošajām atļaujām. Tie var darboties parastā lietošanā pēc aktivizēšanas. Gaidošie prompt paliek rindā, līdz tiek atsākti.",
  "profileImport.confirm": "Sagatavot pilno konfigurāciju",
  "profileImport.restart": "Restartēt un aktivizēt konfigurāciju",
  "profileImport.error.unavailable":
    "Pilnā importēšana pieprasa iebūvēto Linux darbvirsmas serveri un uz failiem balstītu konfigurāciju. Vidē sniegtā konfigurācija vai autentifikācijas pārrakstīšana pirms importēšanas jānoņem.",
  "profileImport.error.nonempty":
    "Classic jau satur konfigurācijas datus. Pilnā importēšana tos nepārraksta. Izmantojiet Tikai tērzēšanas, lai apvienotu saderīgas sarunas, vai sāciet ar tukšu Classic profilu.",
  "profileImport.error.incompatible":
    "Avota datubāzes shēma neatbilst šai Classic versijai. Pilnā importēšana pieprasa saderīgu SQLite konfigurāciju; avota migrācija netika mēģināta.",
  "profileImport.error.invalid":
    "Konfigurāciju neizdevās validēt. Pārbaudiet failu atļaujas, datubāzes integritāti un konfigurācijas sintaksi. Pašreizējais Classic profils nav aizstāts.",
  "profileImport.error.changed":
    "Avots izmainījās vai šis priekšskatījums beidzās. Aizveriet OpenCode un citus rakstītājus un veiciet priekšskatījumu atkārtoti.",
  "profileImport.error.busy":
    "Citu importēšanu, aktīvs faila slēgens vai gaidoša aktivizēšana novērš šo darbību. Aizveriet OpenCode un restartējiet Classic, pirms mēģināt vēlreiz.",
  "profileImport.liveWarning":
    "OpenCode šķietami darbojas tieši tagad. Tā datubāze nepārtraukti mainās, tāpēc sagatavošana var neizdoties. Aizveriet OpenCode (visus logus) un apturiet tā serverus pirms apstiprināšanas, lai importēšana būtu uzticama.",
  "profileImport.detail.count": "Ietekmētie vienumi: {{count}}",
  "profileImport.materialized": "Iekopētās ārējās saites",
  "profileImport.skipped": "Izlaistie izpildlaika faili",
  "profileImport.error.source-busy":
    "Avotā nepārtraukti raksta (visticamāk darbojas OpenCode instance). Aizveriet OpenCode un tā serverus, pēc tam atkārtoti veiciet priekšskatījumu un apstiprināšanu.",
  "profileImport.error.links":
    "Konfigurācija satur saiti, kuru nevar nokopēt: symlink ciklu vai saiti Git metadatos, kur kopijām jāpaliek precīzām.",
  "profileImport.error.git-objects":
    "Konfigurācijas Git metadati izmanto neatbalstītu izkārtojumu (alternates ieraksti, worktree rādītāji vai objektu krātuves, kuras nevar droši privatizēt).",
  "profileImport.error.special-files":
    "Konfigurācija satur ierīču mezglus vai citus īpašus failus, kurus nevar droši nokopēt.",
  "profileImport.error.limit":
    "Konfigurācija pārsniedz importēšanas ierobežojumu (50 GiB vai 500 000 vienumu). Noņemiet lielos dublējuma failus vai sašauriniet mapes un veiciet priekšskatījumu atkārtoti.",
  "profileImport.error.oversized-file":
    "Konfigurācijas vai metadatu fails pārsniedz tā nolasīšanas ierobežojumu (64 MB konfigurācijām, 16 MB Git metadatiem). Sadaliet vai samaziniet to un veiciet priekšskatījumu atkārtoti.",
  "profileImport.error.unsupported":
    "Šī konfigurācija satur neatbalstītas saites, cikliskus Git objektu alternates, īpašus failus vai pārsniedz importēšanas ierobežojumu (50 GiB / 500 000 vienumu). Ārējie symlink jāmaterializē pirms importēšanas; avota faili netika mainīti.",
  "profileImport.error.space":
    "Nav pietiekami daudz brīvas diska vietas šīs konfigurācijas sagatavošanai. Atbrīvojiet vietu un veiciet priekšskatījumu atkārtoti.",
  "chatImport.tab": "Tērzēšanas importēšana",
  "chatImport.title": "Importēt tērzēšanas no OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop uztur atsevišķu tērzēšanas datubāzi. Priekšskatiet un kopējiet saderīgās lokālās tērzēšanas no OpenCode, nemainot avotu un neaizstājot esošās Classic tērzēšanas. Jūs jebkurā brīdī varat atgriezties šeit no iestatījumiem.",
  "chatImport.scope":
    "Aizveriet OpenCode pirms importēšanas. Tas kopē pabeigtās lokālās tērzēšanas un to vēsturi. Rindā esošās, notiekošās un darbtelpu sesijas ir izslēgtas. Pierakstīšanās dati, atļaujas, projekta komandas, ārējie faili un atsaukšanas momentuzņēmumi netiek importēti. Piesakieties atsevišķi un turiet savu projektu mapes to sākotnējos ceļos.",
  "chatImport.localOnly":
    "Importēšanai izvēlieties iebūvēto lokālo darbvirsmas serveri. Šis importētājs neatbalsta attālinātos un fona serveru savienojumus.",
  "chatImport.detect": "Pārbaudīt OpenCode noklusējuma datubāzi",
  "chatImport.browse": "Izvēlēties datubāzes failu",
  "chatImport.confirm": "Importēt atbilstošās tērzēšanas",
  "chatImport.busy":
    "Notiek tērzēšanu pārbaude vai importēšana. Pagaidiet, pirms aizverat lietotni.",
  "chatImport.noSource":
    "Datubāze netika atrasta vai atlasīta. Lai turpinātu, izvēlieties savu OpenCode .db failu.",
  "chatImport.complete":
    "Importēšana pabeigta. Atveriet sākotnējo projekta mapi, lai atrastu tās tērzēšanas. Atkārtota importēšana izlaiž tērzēšanas ID, kas Classic jau pastāv.",
  "chatImport.source": "Avota datubāze",
  "chatImport.destination": "Classic datubāze",
  "chatImport.total": "Tērzēšanas avotā",
  "chatImport.eligible": "Gatavas importēšanai",
  "chatImport.existing": "Jau pastāv",
  "chatImport.excluded": "Izslēgtas (rindā, notiekošas vai darbtelpa)",
  "chatImport.imported": "Importētas",
  "chatImport.error.unavailable":
    "Importēšana ir pieejama tikai iebūvētajam Linux darbvirsmas serverim pēc tā pilnīgas palaišanas.",
  "chatImport.error.incompatible":
    "Datubāzēm ir dažādas vai neatbalstītas shēmas. Izmantojiet saderīgas un atjauninātas OpenCode un Classic versijas un veiciet priekšskatījumu atkārtoti. Mantotā JSON krātuve netiek atbalstīta; avots netika migrēts.",
  "chatImport.error.invalid":
    "Datubāzi neizdevās nolasīt vai validēt. Pārbaudiet atlasīto failu, atļaujas un pieejamo diska vietu. Neapstiprināta importēšana tiek atgriezeniski atcelta; pirms atkārtota mēģinājuma veiciet priekšskatījumu atkārtoti.",
  "chatImport.error.sameFile":
    "Avots un galamērķis ir viena un tā pati datubāze. Kopēšana nav nepieciešama.",
  "chatImport.error.conflict":
    "Konfliktējoši projekta vai ziņojumu ID novērsa šo importēšanu. Daļēja importēšana netika apstiprināta. Esošās Classic tērzēšanas tika saglabātas.",
  "chatImport.error.busy":
    "Datubāze ir aizņemta vai darbība prasīja pārāk daudz laika. Aizveriet OpenCode, pagaidiet, līdz citas importēšanas beidzas, un veiciet priekšskatījumu atkārtoti. Atkārtots mēģinājums izlaiž jau apstiprinātās tērzēšanas.",
  "chatImport.error.expired":
    "Šis priekšskatījums beidzies vai tā avots ir mainījies. Pirms importēšanas veiciet datubāzes priekšskatījumu atkārtoti.",
}
