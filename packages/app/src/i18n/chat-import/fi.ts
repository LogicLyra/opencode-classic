export const dict = {
  "profileImport.mode": "Tuontila",
  "profileImport.chats": "Vain keskustelut",
  "profileImport.everything": "Kaikki (koko asennus)",
  "profileImport.description":
    "Kopioi yhteensopivan OpenCode-asennuksesi tyhjään Classic-työpöytäprofiiliin: keskustelut, palveluntarjoajien kirjautumistiedot, pilvitilit, käyttöoikeudet, yleinen määritys, agentit, skillit, lisäosat, suunnitelmat, tilannevedokset ja työtilatiedostot. Lähde pysyy muuttumattomana. Esikatselu ei suorita tuotuja komentoja eikä ota yhteyttä palveluntarjoajiin.",
  "profileImport.boundaries":
    "Sulje ensin OpenCode ja lopeta sen tiedostojen muokkaaminen. OpenCode-tallennuksen ulkopuoliset projektikansiot pysyvät alkuperäisissä poluissaan. Ympäristömuuttujia, järjestelmätasolle asennettuja työkaluja ja ylävirran työpöytäikkunan asetuksia ei kopioida. Lokit, välimuistit ja prosessilukot luodaan uudelleen. OAuth-palveluntarjoajat saattavat vaatia uuden kirjautumisen. Omat kansiot valitaan tässä järjestyksessä: data, määritykset ja sitten tila.",
  "profileImport.detect": "Esikatsele oletusasennus",
  "profileImport.browse": "Valitse asennuskansiot",
  "profileImport.busy":
    "Koko asennusta vahvistetaan tai valmistellaan. Pidä Classic auki, kunnes tämä valmistuu.",
  "profileImport.cancelled":
    "Yhteensopivaa lähdettä ei löytynyt, tai kansion valinta peruutettiin.",
  "profileImport.staged":
    "Asennus on valmisteltu ja vahvistettu. Käynnistä Classic uudelleen aktivoidaksesi sen ennen sen palvelimen käynnistymistä. Älä lisää tietoja Classiciin ennen uudelleenkäynnistystä; aktivointi tarkistaa uudelleen, että kohde on tyhjä.",
  "profileImport.activated":
    "Koko asennus aktivoitiin onnistuneesti. Projekti-kansiosi pysyvät käytettävissä alkuperäisissä poluissaan; tuodut sisäiset työtilat saavat itsenäiset kopiot.",
  "profileImport.data": "Lähteen datakansio",
  "profileImport.config": "Lähteen määrityskansio",
  "profileImport.state": "Lähteen tilakansio",
  "profileImport.providers": "Tallennetut palveluntarjoajien kirjautumistiedot",
  "profileImport.accounts": "Pilvitilit",
  "profileImport.workspaces": "Työtilat",
  "profileImport.files": "Tiedostot ja linkit",
  "profileImport.bytes": "Kopion koko (tavua)",
  "profileImport.plugins": "Määritetyt lisäosat",
  "profileImport.mcp": "MCP-merkinnät",
  "profileImport.commands": "Projektikomennot",
  "profileImport.permissions": "Käyttöoikeustietueet",
  "profileImport.pending": "Odottavat kehotteet",
  "profileImport.git": "Git-checkoutit",
  "profileImport.consent":
    "Olen sulkenut OpenCoden ja luotan tähän koko asennukseen, mukaan lukien kirjautumistiedot, tilien päivitys, riippuvuudet, lisäosat, MCP-palvelimet, projektikomennot, Git-koukut ja olemassa olevat käyttöoikeudet. Nämä voivat toimia normaalin käytön aikana aktivoinnin jälkeen. Odottavat kehotteet pysyvät jonossa, kunnes niitä jatketaan.",
  "profileImport.confirm": "Valmistele koko asennus",
  "profileImport.restart": "Käynnistä uudelleen ja aktivoi asennus",
  "profileImport.error.unavailable":
    "Koko tuonti vaatii sisäänrakennetun Linux-työpöytäpalvelimen ja tiedostopohjaiset määritykset. Ympäristön tarjoamat määritykset tai todennusohitukset on poistettava ennen tuontia.",
  "profileImport.error.nonempty":
    "Classic sisältää jo asennustietoja. Koko tuonti ei korvaa niitä. Käytä Vain keskustelut yhteensopivien keskustelujen yhdistämiseen tai aloita tyhjällä Classic-profiililla.",
  "profileImport.error.incompatible":
    "Lähteen tietokannan skeema ei vastaa tätä Classic-versiota. Koko tuonti vaatii yhteensopivan SQLite-asennuksen; lähteen siirtoa ei yritetty.",
  "profileImport.error.invalid":
    "Asennusta ei voitu vahvistaa. Tarkista tiedostojen käyttöoikeudet, tietokannan eheys ja määrityssyntaksi. Käynnissä olevaa Classic-profiilia ei ole korvattu.",
  "profileImport.error.changed":
    "Lähde muuttui tai tämä esikatselu vanheni. Sulje OpenCode ja muut kirjoittavat prosessit ja esikatsele uudelleen.",
  "profileImport.error.busy":
    "Toinen tuonti, aktiivinen tiedostolukko tai odottava aktivointi estää tämän toiminnon. Sulje OpenCode ja käynnistä Classic uudelleen ennen uudelleenyritystä.",
  "profileImport.liveWarning":
    "OpenCode näyttää olevan käynnissä juuri nyt. Sen tietokanta muuttuu jatkuvasti, joten valmistelu voi epäonnistua. Sulje OpenCode (kaikki ikkunat) ja pysäytä sen palvelimet ennen vahvistamista luotettavan tuonnin varmistamiseksi.",
  "profileImport.detail.count": "Vaikutus kohteisiin: {{count}}",
  "profileImport.materialized": "Kopioitua ulkoiset linkit",
  "profileImport.skipped": "Ohitetut ajonaikaiset tiedostot",
  "profileImport.error.source-busy":
    "Lähteeseen kirjoitetaan jatkuvasti (OpenCode-esiintymä on todennäköisesti käynnissä). Sulje OpenCode ja sen palvelimet ja esikatsele sekä vahvista sitten uudelleen.",
  "profileImport.error.links":
    "Asennus sisältää linkkiä, jota ei voi kopioida: symlink-kierron tai linkin Git-metatietojen sisällä, jossa kopioiden on pysyttävä tarkkoina.",
  "profileImport.error.git-objects":
    "Asennuksen Git-metatiedot käyttävät ei-tuettua rakennetta (alternates-merkinnät, worktree-osoittimet tai objektivarastoja, joita ei voi privatisoida turvallisesti).",
  "profileImport.error.special-files":
    "Asennus sisältää laitenoodteja tai muita erikoistiedostoja, joita ei voi kopioida turvallisesti.",
  "profileImport.error.limit":
    "Asennus ylittää tuontirajan (50 GiB tai 500 000 kohdetta). Poista suuret varmuuskopiotiedostot tai rajaa kansioita ja esikatsele uudelleen.",
  "profileImport.error.oversized-file":
    "Määritys- tai metatietotiedosto ylittää lukurajansa (64 Mt määrityksille, 16 Mt Git-metatiedoille). Jaa tai pienennä sitä ja esikatsele uudelleen.",
  "profileImport.error.unsupported":
    "Tämä asennus sisältää ei-tuettuja linkkejä, syklisiä Git-objektialternates-rakenteita, erikoistiedostoja tai ylittää tuontirajan (50 GiB / 500 000 kohdetta). Ulkoiset symlinkit on materialisoitava ennen tuontia; lähdetiedostoja ei muutettu.",
  "profileImport.error.space":
    "Vapaata levytilaa ei ole riittävästi tämän asennuksen valmisteluun. Vapauta tilaa ja esikatsele uudelleen.",
  "chatImport.tab": "Keskustelutuonti",
  "chatImport.title": "Tuo keskusteluja OpenCodesta",
  "chatImport.description":
    "OpenCode Classic Desktop pitää oman keskustelutietokantansa erillään. Esikatsele ja kopioi yhteensopivat paikalliset keskustelut OpenCodesta muuttamatta lähdettä tai korvaamatta nykyisiä Classic-keskusteluja. Voit palata tähän asetuksista milloin tahansa.",
  "chatImport.scope":
    "Sulje OpenCode ennen tuontia. Tämä kopioi valmiit paikalliset keskustelut ja niiden historian. Jonossa olevat, meneillään olevat ja työtilan istunnot jätetään pois. Kirjautumistietoja, käyttöoikeuksia, projektikomentoja, ulkoisia tiedostoja ja kumoamistilannevedoksia ei tuoda. Kirjaudu erikseen ja pidä projektikansiosi alkuperäisissä poluissaan.",
  "chatImport.localOnly":
    "Valitse sisäänrakennettu paikallinen työpöytäpalvelin tuodaksesi keskusteluja. Etä- ja taustapalvelinyhteyksiä ei tueta tässä tuojassa.",
  "chatImport.detect": "Tarkista OpenCoden oletustietokanta",
  "chatImport.browse": "Valitse tietokantatiedosto",
  "chatImport.confirm": "Tuo kelpaavat keskustelut",
  "chatImport.busy":
    "Tarkistetaan tai tuodaan keskusteluja. Odota ennen sovelluksen sulkemista.",
  "chatImport.noSource":
    "Tietokantaa ei löytynyt tai valittu. Valitse OpenCode-.db-tiedostosi jatkaaksesi.",
  "chatImport.complete":
    "Tuonti valmis. Avaa alkuperäinen projektikansio löytääksesi sen keskustelut. Toistettu tuonti ohittaa keskustelutunnukset, jotka ovat jo Classicissa.",
  "chatImport.source": "Lähdetietokanta",
  "chatImport.destination": "Classic-tietokanta",
  "chatImport.total": "Keskustelut lähteessä",
  "chatImport.eligible": "Valmiita tuotavaksi",
  "chatImport.existing": "Jo olemassa",
  "chatImport.excluded": "Pois jätetyt (jonossa, meneillään tai työtila)",
  "chatImport.imported": "Tuodut",
  "chatImport.error.unavailable":
    "Tuonti on käytettävissä vain sisäänrakennetulle Linux-työpöytäpalvelimelle sen käynnistyttyä loppuun.",
  "chatImport.error.incompatible":
    "Tietokannoilla on eri tai ei-tuetut skeemat. Käytä yhteensopivia, ajan tasalla olevia OpenCode- ja Classic-versioita ja esikatsele uudelleen. Vanhaa JSON-tallennusta ei tueta; lähdettä ei siirretty.",
  "chatImport.error.invalid":
    "Tietokantaa ei voitu lukea tai vahvistaa. Tarkista valittu tiedosto, käyttöoikeudet ja käytettävissä oleva levytila. Vahvistamaton tuonti peruutetaan; esikatsele uudelleen ennen uudelleenyritystä.",
  "chatImport.error.sameFile":
    "Lähde ja kohde ovat sama tietokanta. Kopiota ei tarvita.",
  "chatImport.error.conflict":
    "Ristiriitaiset projekti- tai viestitunnukset estivät tämän tuonnin. Osittaista tuontia ei vahvistettu. Nykyiset Classic-keskustelut säilytettiin.",
  "chatImport.error.busy":
    "Tietokanta on varattu tai toiminto kesti liian kauan. Sulje OpenCode, odota muiden tuontien valmistumista ja esikatsele uudelleen. Uusi yritys ohittaa jo vahvistetut keskustelut.",
  "chatImport.error.expired":
    "Tämä esikatselu vanheni tai sen lähde muuttui. Esikatsele tietokanta uudelleen ennen tuontia.",
}
