export const dict = {
  "profileImport.mode": "Importrežiim",
  "profileImport.chats": "Ainult vestlused",
  "profileImport.everything": "Kõik (täielik seadistus)",
  "profileImport.description":
    "Kopeerib sinu ühilduva OpenCode-seadistuse tühja Classic-i töölauaprofiili: vestlused, teenusepakkujate sisselogimisandmed, pilvekonto-d, õigused, globaalne konfiguratsioon, agendid, skillid, pluginad, plaanid, hetktõmmised ja tööruumide failid. Allikas jääb muutmata. Eelvaade ei käivita imporditud käske ega võta teenusepakkujatega ühendust.",
  "profileImport.boundaries":
    "Sulge kõigepealt OpenCode ja lõpeta selle failide muutmine. OpenCode'i salvestusruumist väljaspool asuvad projektikaustad jäävad oma algsesse asukohta. Keskkonnamuutujaid, süsteemselt paigaldatud tööriistu ja upstream-i töölauaakna eelistusi ei kopeerita. Logid, vahemälud ja protsessilukud luuakse uuesti. OAuth-teenusepakkujad võivad nõuda uut sisselogimist. Kohandatud kaustad valitakse selles järjekorras: andmed, konfiguratsioon ja seejärel olek.",
  "profileImport.detect": "Eelvaata vaikeseadistust",
  "profileImport.browse": "Vali seadistuskaustad",
  "profileImport.busy":
    "Täielikku seadistust kontrollitakse või ettevalmistatakse. Hoia Classic avatud, kuni see lõpeb.",
  "profileImport.cancelled":
    "Ühilduvat allikat ei leitud või kaustade valimine tühistati.",
  "profileImport.staged":
    "Seadistus on ette valmistatud ja kontrollitud. Taaskäivita Classic, et see aktiveerida enne selle serveri käivitumist. Ära lisa andmeid Classic-i enne taaskäivitamist; aktiveerimine kontrollib uuesti, et sihtkoht on tühi.",
  "profileImport.activated":
    "Täielik seadistus aktiveeriti edukalt. Sinu projektikaustad jäävad kättesaadavaks oma algsetes asukohtades; imporditud sisemised tööruumid saavad sõltumatud koopiad.",
  "profileImport.data": "Allika andmete kaust",
  "profileImport.config": "Allika konfiguratsioonikaust",
  "profileImport.state": "Allika olekukaust",
  "profileImport.providers": "Salvestatud teenusepakkujate sisselogimisandmed",
  "profileImport.accounts": "Pilvekonto-d",
  "profileImport.workspaces": "Tööruumid",
  "profileImport.files": "Failid ja lingid",
  "profileImport.bytes": "Kopeerimise suurus (baidid)",
  "profileImport.plugins": "Seadistatud pluginad",
  "profileImport.mcp": "MCP-kirjed",
  "profileImport.commands": "Projektikäsud",
  "profileImport.permissions": "Õiguste kirjed",
  "profileImport.pending": "Ootel viibad",
  "profileImport.git": "Git-i checkout-id",
  "profileImport.consent":
    "Ma olen OpenCode'i sulgenud ja usaldan seda täielikku seadistust, sealhulgas sisselogimisandmeid, kontode värskendamist, sõltuvusi, pluginaid, MCP-servereid, projektikäske, Git-i hooke ja olemasolevaid õigusi. Need võivad aktiveerimise järel tavalise kasutamise ajal töötada. Ootel viibad jäävad järjekorda, kuni neid jätkatakse.",
  "profileImport.confirm": "Ettevalmista täielik seadistus",
  "profileImport.restart": "Taaskäivita ja aktiveeri seadistus",
  "profileImport.error.unavailable":
    "Täielik import nõuab sisseehitatud Linux-i töõlauserverit ja failipõhist konfiguratsiooni. Keskkonna pakutud konfiguratsioon või autentimise ülekirjutused tuleb enne importimist eemaldada.",
  "profileImport.error.nonempty":
    "Classic sisaldab juba seadistuse andmeid. Täielik import ei kirjuta neid üle. Kasuta ühilduvate vestluste liitmiseks Ainult vestlused või alusta tühja Classic-i profiiliga.",
  "profileImport.error.incompatible":
    "Allika andmebaasi skeem ei vasta sellele Classic-i versioonile. Täielik import nõuab ühilduvat SQLite-seadistust; allika migratsiooni ei üritatud.",
  "profileImport.error.invalid":
    "Seadistust ei saanud kontrollida. Kontrolli failiõigusi, andmebaasi terviklikkust ja konfiguratsiooni süntaksit. Käivatatud Classic-i profiili ei asendatud.",
  "profileImport.error.changed":
    "Allikas muutus või see eelvaade aegus. Sulge OpenCode ja teised kirjutajad ning tee eelvaade uuesti.",
  "profileImport.error.busy":
    "Teine import, aktiivne faililukk või ootel aktiveerimine takistab seda toimingut. Sulge OpenCode ja taaskäivita Classic enne uut katset.",
  "profileImport.liveWarning":
    "OpenCode paistab olevat praegu töös. Selle andmebaas muutub pidevalt, seega ettevalmistus võib ebaõnnestuda. Sulge OpenCode (kõik aknad) ja peata selle serverid enne kinnitamist, et import oleks usaldusväärne.",
  "profileImport.detail.count": "Mõjutatud üksused: {{count}}",
  "profileImport.materialized": "Kopeeritud välised lingid",
  "profileImport.skipped": "Vahele jäetud käitusajafailid",
  "profileImport.error.source-busy":
    "Allikasse kirjutatakse pidevalt (tõenäoliselt töötab OpenCode-i eksemplar). Sulge OpenCode ja selle serverid ning tee seejärel eelvaade ja kinnitamine uuesti.",
  "profileImport.error.links":
    "Seadistus sisaldab linki, mida ei saa kopeerida: symlink-ide tsükkel või link Git-i metaandmete sees, kus koopiad peavad jääma täpseks.",
  "profileImport.error.git-objects":
    "Seadistuse Git-i metaandmed kasutavad toetamata paigutust (alternates-kirjed, worktree-osutid või objektihoidlad, mida ei saa ohutult privaatseks teha).",
  "profileImport.error.special-files":
    "Seadistus sisaldab seadmesõlmi või muid erifail-e, mida ei saa ohutult kopeerida.",
  "profileImport.error.limit":
    "Seadistus ületab impordi piiri (50 GiB või 500 000 üksust). Eemalda suured varukoopiad või ahtasta kaustu ja tee eelvaade uuesti.",
  "profileImport.error.oversized-file":
    "Konfiguratsiooni- või metaandmefail ületab oma lugemise piiri (64 MB konfiguratsioonidele, 16 MB Git-i metaandmetele). Tükelda või vähenda seda ja tee eelvaade uuesti.",
  "profileImport.error.unsupported":
    "See seadistus sisaldab toetamata linke, tsüklilisi Git-i objektialternates-e, erifail-e või ületab impordi piiri (50 GiB / 500 000 üksust). Välised symlink-id tuleb enne importi materialiseerida; allikafaile ei muudetud.",
  "profileImport.error.space":
    "Selle seadistuse ettevalmistamiseks ei ole piisavalt vaba kettaruumi. Vabasta ruumi ja tee eelvaade uuesti.",
  "chatImport.tab": "Vestluste import",
  "chatImport.title": "Impordi vestlused OpenCode'ist",
  "chatImport.description":
    "OpenCode Classic Desktop hoiab oma vestluste andmebaasi eraldi. Eelvaata ja kopeeri ühilduvad kohalikud vestlused OpenCode'ist muutmata allikat ega asendades olemasolevaid Classic-i vestlusi. Sa võid igal ajal seadete kaudu siia tagasi tulla.",
  "chatImport.scope":
    "Sulge OpenCode enne importimist. See kopeerib lõpetatud kohalikud vestlused ja nende ajaloo. Järjekorras, pooleliolevad ja tööruumi sessioonid on välistatud. Sisselogimisandmeid, õigusi, projektikäske, välisfaile ja tagasivõtmise hetktõmmiseid ei impordita. Logi sisse eraldi ja hoia oma projektikaustad nende algsetes asukohtades.",
  "chatImport.localOnly":
    "Vali vestluste importimiseks sisseehitatud kohalik töõlauserver. See importija ei toeta kaug- ja taustaserveri ühendusi.",
  "chatImport.detect": "Kontrolli OpenCode'i vaikeandmebaasi",
  "chatImport.browse": "Vali andmebaasifail",
  "chatImport.confirm": "Impordi sobilikud vestlused",
  "chatImport.busy":
    "Vestlusi kontrollitakse või imporditakse. Oota enne rakenduse sulgemist.",
  "chatImport.noSource":
    "Andmebaasi ei leitud ega valitud. Jätkamiseks vali oma OpenCode'i .db-fail.",
  "chatImport.complete":
    "Import lõpetatud. Ava algne projektikaust, et leida selle vestlused. Korduv import jätab vahele vestluste ID-d, mis on Classic-is juba olemas.",
  "chatImport.source": "Allika andmebaas",
  "chatImport.destination": "Classic-i andmebaas",
  "chatImport.total": "Vestlused allikas",
  "chatImport.eligible": "Importimiseks valmis",
  "chatImport.existing": "Juba olemas",
  "chatImport.excluded": "Väljatud (järjekorras, pooleli või tööruum)",
  "chatImport.imported": "Imporditud",
  "chatImport.error.unavailable":
    "Import on saadaval ainult sisseehitatud Linux-i töõlauserverile pärast selle täielikku käivitumist.",
  "chatImport.error.incompatible":
    "Andmebaasidel on erinevad või toetamata skeemid. Kasuta ühilduvaid ja ajakohaseid OpenCode'i ja Classic-i versioone ning tee eelvaade uuesti. Pärand-JSON-salvestust ei toetata; allikat ei migreeritud.",
  "chatImport.error.invalid":
    "Andmebaasi ei saanud lugeda ega kontrollida. Kontrolli valitud faili, õigusi ja saadaolevat kettaruumi. Kinnitamata import pööratakse tagasi; tee enne uut katset eelvaade uuesti.",
  "chatImport.error.sameFile":
    "Allikas ja sihtkoht on sama andmebaas. Kopeerimine pole vajalik.",
  "chatImport.error.conflict":
    "Konfliktsete projektide või sõnumite ID-d takistasid seda importi. Osalist importi ei kinnitatud. Olemasolevad Classic-i vestlused säilitati.",
  "chatImport.error.busy":
    "Andmebaas on hõivatud või toiming võttis liiga palju aega. Sulge OpenCode, oota teiste importide lõppemist ja tee siis eelvaade uuesti. Uus katse jätab juba kinnitatud vestlused vahele.",
  "chatImport.error.expired":
    "See eelvaade on aegunud või selle allikas on muutunud. Tee enne importimist andmebaasist uus eelvaade.",
}
